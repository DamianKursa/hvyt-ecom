import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getCache, setCache } from '../../lib/cache';
import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';

export const config = { api: { bodyParser: false } } as const;

const CACHE_TTL = 3600;

const WooCommerceAPI = axios.create({
  baseURL: process.env.REST_API,
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',
    password: process.env.WC_CONSUMER_SECRET || '',
  },
});

const parseForm = (req: NextApiRequest): Promise<{ fields: any; files: any }> =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: true, maxFileSize: 1024 * 1024 }); // 1MB per file
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const { productId } = req.query;

      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      const cacheKey = `reviews:product:${productId}`;
      const cachedReviews = await getCache(cacheKey);
      if (cachedReviews) {
        return res.status(200).json(cachedReviews);
      }

      // ← Add status: 'approved' here
      const response = await WooCommerceAPI.get('/products/reviews', {
        params: {
          product: productId,
          per_page: 50,
          status: 'approved',
        },
      });

      await setCache(cacheKey, response.data, CACHE_TTL);

      return res.status(200).json(response.data);
    } else if (method === 'POST') {
      const isMultipart = (req.headers['content-type'] || '').includes('multipart/form-data');

      if (!isMultipart) {
        // Prefer unauthenticated WP comments (guest), fall back to WC authenticated if needed
        const { productId, name, email, content, rating } = req.body;
        if (!productId || !name || !email || !content || !rating) {
          return res.status(400).json({ error: 'All fields are required' });
        }
        const BASE = (process.env.REST_API || '').replace(/\/$/, '');
        const wcReviewsEndpoint = `${BASE}/products/reviews`; // wc/v3
        const wpCommentsEndpoint = BASE.replace('/wc/v3', '/wp/v2') + '/comments';
        try {
          const response = await axios.post(
            wpCommentsEndpoint,
            {
              post: Number(productId),
              author_name: name,
              author_email: email,
              content: content,
              meta: { rating: Number(rating) },
            },
            { headers: { 'Content-Type': 'application/json' } }
          );
          return res.status(201).json(response.data);
        } catch (e) {
          // Fallback to AUTHENTICATED WooCommerce reviews API
          const response = await WooCommerceAPI.post('/products/reviews', {
            product_id: Number(productId),
            reviewer: name,
            reviewer_email: email,
            review: content,
            rating: Number(rating),
            status: 'hold',
          });
          return res.status(201).json(response.data);
        }
      }

      // Multipart flow with image uploads
      const { fields, files } = await parseForm(req);
      const first = (v: any) => (Array.isArray(v) ? v[0] : v);

      const productId = Number(first(fields.productId));
      const name = String(first(fields.name) ?? '').trim();
      const email = String(first(fields.email) ?? '').trim();
      const content = String(first(fields.content) ?? '').trim();
      const rating = Number(first(fields.rating));

      if (!productId || !name || !email || !content || !rating) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Upload up to 5 images to WP Media
      const urls: string[] = [];
      const incoming = (files as any)?.attachments;
      const list: any[] = Array.isArray(incoming) ? incoming : incoming ? [incoming] : [];

      for (const file of list) {
        const f = Array.isArray(file) ? file[0] : file;
        if (!f) continue;
        if (!f.mimetype?.startsWith('image/')) {
          return res.status(400).json({ error: 'Dozwolone są tylko pliki graficzne.' });
        }
        if (Number(f.size) > 1024 * 1024) {
          return res.status(400).json({ error: 'Maksymalny rozmiar pliku to 1MB.' });
        }
        const filename = f.originalFilename || 'review-image.jpg';

        // Upload to custom WP endpoint secured by shared secret header
        const uploadUrl = (process.env.WP_REVIEW_UPLOAD_URL || 'https://wp.hvyt.pl/wp-json/custom/v1/review-media');
        const secret = process.env.HVYT_REVIEW_UPLOAD_KEY || '';
        if (!secret) {
          throw new Error('Missing HVYT_REVIEW_UPLOAD_KEY env var');
        }

        const fd = new FormData();
        fd.append('file', fs.createReadStream(f.filepath), { filename, contentType: f.mimetype || 'application/octet-stream' });

        const uploadRes = await axios.post(uploadUrl, fd, {
          headers: {
            ...fd.getHeaders(),
            'x-hvyt-upload-key': secret,
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });

        const url = uploadRes.data?.url; // { id, url, mime }
        if (url) urls.push(url);
        if (urls.length >= 5) break; // cap
      }

      const attachmentsLine = urls.length ? `\n\nZałączniki: ${urls.join(' ')}` : '';

      const BASE = (process.env.REST_API || '').replace(/\/$/, '');
      const wcReviewsEndpoint = `${BASE}/products/reviews`; // wc/v3
      const wpCommentsEndpoint = BASE.replace('/wc/v3', '/wp/v2') + '/comments';

      try {
        const response = await axios.post(
          wpCommentsEndpoint,
          {
            post: Number(productId),
            author_name: name,
            author_email: email,
            content: `${content}${attachmentsLine}`,
            meta: { rating: Number(rating) },
          },
          { headers: { 'Content-Type': 'application/json' } }
        );
        return res.status(201).json(response.data);
      } catch (e) {
        const response = await WooCommerceAPI.post('/products/reviews', {
          product_id: Number(productId),
          reviewer: name,
          reviewer_email: email,
          review: `${content}${attachmentsLine}`,
          rating: Number(rating),
          status: 'hold',
        });
        return res.status(201).json(response.data);
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error in /api/reviews:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}