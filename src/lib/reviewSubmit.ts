import crypto from 'crypto';
import axios from '@/utils/api/http';

export const REVIEW_LIMITS_FALLBACK = { maxFiles: 5, maxFileSizeMb: 25 };

const TOKEN_TTL_MS = 15 * 60 * 1000;

export type ReviewLimits = {
  maxFiles: number;
  maxFileSizeMb: number;
};

export function wpCustomBase(): string {
  const origin = (process.env.WORDPRESS_API_URL || '').replace(/\/$/, '');
  return `${origin}/wp-json/custom/v1`;
}

export function reviewUploadSecret(): string {
  return process.env.HVYT_REVIEW_UPLOAD_KEY || '';
}

export function createReviewUploadToken(secret: string): string {
  const payload = Buffer.from(JSON.stringify({
    exp: Date.now() + TOKEN_TTL_MS,
    purpose: 'review-media',
    nonce: crypto.randomBytes(16).toString('base64url'),
  })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function readReviewUploadToken(token: string, secret: string): { nonce: string } {
  const [payload, sig] = String(token || '').split('.');
  if (!payload || !sig) {
    throw new Error('invalid_token');
  }
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  const actual = Buffer.from(sig);
  const wanted = Buffer.from(expected);
  if (actual.length !== wanted.length || !crypto.timingSafeEqual(actual, wanted)) {
    throw new Error('invalid_token');
  }
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
    exp?: number;
    purpose?: string;
    nonce?: string;
  };
  if (data.purpose !== 'review-media' || typeof data.nonce !== 'string' || !data.nonce) {
    throw new Error('invalid_token');
  }
  if (typeof data.exp !== 'number' || Date.now() > data.exp) {
    throw new Error('expired_token');
  }
  return { nonce: data.nonce };
}

function clampLimit(value: unknown, fallback: number, max: number): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) return fallback;
  return parsed;
}

export async function fetchReviewLimits(): Promise<ReviewLimits> {
  try {
    const response = await axios.get(`${wpCustomBase()}/product-review`, { timeout: 4000 });
    return {
      maxFiles: clampLimit(response.data?.maxFiles, REVIEW_LIMITS_FALLBACK.maxFiles, 30),
      maxFileSizeMb: clampLimit(response.data?.maxFileSizeMb, REVIEW_LIMITS_FALLBACK.maxFileSizeMb, 200),
    };
  } catch {
    return REVIEW_LIMITS_FALLBACK;
  }
}
