import { NextApiRequest, NextApiResponse } from 'next';
import axios, { createApiClient } from '@/utils/api/http';
import { getCache, setCache } from '../../lib/cache';
import { withReviewMedia } from '@/lib/reviewMedia';
import {
  createReviewUploadToken,
  fetchReviewLimits,
  readReviewUploadToken,
  reviewUploadSecret,
  wpCustomBase,
} from '@/lib/reviewSubmit';

export const config = { api: { bodyParser: false } } as const;

const CACHE_TTL = 3600;

const WooCommerceAPI = createApiClient({
  baseURL: process.env.REST_API,
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',
    password: process.env.WC_CONSUMER_SECRET || '',
  },
});

function clientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded || req.socket.remoteAddress || '';
  return raw.split(',')[0].trim();
}

async function readJsonBody(req: NextApiRequest): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  const parsed = JSON.parse(raw);
  return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : {};
}

function attachmentIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => Number(item)).filter((id) => Number.isInteger(id) && id > 0);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    if (method === 'GET' && String(req.query.limits || '') === '1') {
      return res.status(200).json(await fetchReviewLimits());
    }

    if (method === 'GET') {
      const { productId } = req.query;

      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      const page = Math.max(1, Number(req.query.page) || 1);
      const perPage = Math.min(100, Math.max(1, Number(req.query.per_page) || 50));
      const cacheKey = `reviews:product:v3:${productId}:${page}:${perPage}`;
      const cachedReviews = await getCache(cacheKey);
      if (cachedReviews) {
        return res.status(200).json(cachedReviews);
      }

      const response = await WooCommerceAPI.get('/products/reviews', {
        params: {
          product: productId,
          page,
          per_page: perPage,
          status: 'approved',
        },
      });

      const reviews = withReviewMedia(Array.isArray(response.data) ? response.data : []);
      await setCache(cacheKey, reviews, CACHE_TTL);
      return res.status(200).json(reviews);
    }

    if (method === 'POST' && String(req.query.uploadToken || '') === '1') {
      const secret = reviewUploadSecret();
      if (!secret) {
        return res.status(503).json({ code: 'media_unavailable', error: 'Upload is not configured' });
      }
      const limits = await fetchReviewLimits();
      return res.status(200).json({
        token: createReviewUploadToken(secret),
        uploadUrl: `${wpCustomBase()}/product-review-media`,
        ...limits,
      });
    }

    if (method === 'POST') {
      const body = await readJsonBody(req);
      const productId = Number(body.productId);
      const name = String(body.name ?? '').trim();
      const email = String(body.email ?? '').trim();
      const content = String(body.content ?? '').trim();
      const rating = Number(body.rating);
      const mediaIds = attachmentIds(body.attachmentIds);

      if (!productId || !name || !email || !content || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ code: 'validation', error: 'All fields are required' });
      }
      if (Array.isArray(body.attachmentIds) && mediaIds.length !== body.attachmentIds.length) {
        return res.status(400).json({ code: 'validation', error: 'Invalid attachments' });
      }

      if (mediaIds.length > 0) {
        const secret = reviewUploadSecret();
        if (!secret) {
          return res.status(503).json({ code: 'media_unavailable', error: 'Upload is not configured' });
        }
        const limits = await fetchReviewLimits();
        if (mediaIds.length > limits.maxFiles) {
          return res.status(400).json({ code: 'too_many_files', error: 'Too many files' });
        }
        let nonce = '';
        try {
          nonce = readReviewUploadToken(String(body.uploadToken ?? ''), secret).nonce;
        } catch {
          return res.status(400).json({ code: 'validation', error: 'Invalid upload token' });
        }

        try {
          const response = await axios.post(
            `${wpCustomBase()}/product-review`,
            {
              product_id: productId,
              reviewer: name,
              reviewer_email: email,
              review: content,
              rating,
              attachment_ids: mediaIds,
              nonce,
              client_ip: clientIp(req),
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'x-hvyt-upload-key': secret,
              },
              timeout: 20000,
            },
          );
          return res.status(201).json(response.data);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            return res.status(503).json({ code: 'media_unavailable', error: 'Media endpoint is not available' });
          }
          const status = axios.isAxiosError(error) ? error.response?.status : undefined;
          const data = axios.isAxiosError(error) ? error.response?.data : undefined;
          return res.status(status && status >= 400 && status < 500 ? status : 502).json({
            code: data?.code || data?.data?.code || 'review_rejected',
            error: data?.message || 'Review could not be saved',
          });
        }
      }

      const response = await WooCommerceAPI.post('/products/reviews', {
        product_id: productId,
        reviewer: name,
        reviewer_email: email,
        review: content,
        rating,
        status: 'hold',
      });
      return res.status(201).json(response.data);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error('Error in /api/reviews:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
