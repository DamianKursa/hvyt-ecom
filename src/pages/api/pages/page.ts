import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getCache, setCache } from '@/lib/cache';

const CACHE_TTL = 86400;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, pageId, lang } = req.query; 

  try {

    if(pageId) {
      
      const cacheKey = `page:${pageId}`;

      const cached = await getCache(cacheKey);
      
      if (cached) {
        return res.status(200).json(cached);
      }

        const response = await axios.get(
            `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/pages/${pageId}`,
            {
                params: {
                lang
                },
            }
        );

        await setCache(cacheKey, response, CACHE_TTL);

        res.status(200).json(response.data);
    }
    

  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      res.status(status).json({
        error: error.response?.data?.message || 'Failed to fetch page',
      });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
