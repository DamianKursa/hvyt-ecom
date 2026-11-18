export type ReviewMediaItem = {
  type: 'image' | 'video';
  url: string;
  poster?: string;
};

type LooseRecord = Record<string, unknown>;

const IMAGE_URL_KEYS = new Set(['ivole_review_image']);
const VIDEO_URL_KEYS = new Set(['ivole_review_video']);
const IMAGE_ID_KEYS = new Set(['ivole_review_image2']);
const VIDEO_ID_KEYS = new Set(['ivole_review_video2']);

const IMAGE_URL_PATTERN = /https?:\/\/[^\s"'<>)]+?\.(?:png|jpe?g|gif|webp)(?:\?[^\s"'<>)]*)?/gi;
const VIDEO_URL_PATTERN = /https?:\/\/[^\s"'<>)]+?\.(?:mp4|webm|ogg|mov|m4v)(?:\?[^\s"'<>)]*)?/gi;
const VIDEO_EXT_PATTERN = /\.(?:mp4|webm|ogg|mov|m4v)(?:\?|#|$)/i;

function isHttpUrl(value: unknown): value is string {
  return typeof value === 'string' && /^https?:\/\//i.test(value.trim());
}

function parseMaybeJson(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function mediaType(value: unknown, fallback: 'image' | 'video'): 'image' | 'video' {
  if (!value || typeof value !== 'object') {
    return isHttpUrl(value) && VIDEO_EXT_PATTERN.test(value) ? 'video' : fallback;
  }
  const record = value as LooseRecord;
  if (record.type === 'video' || record.type === 'image') return record.type;
  const mime = record.mime_type ?? record.mime;
  if (typeof mime === 'string') {
    if (mime.startsWith('video/')) return 'video';
    if (mime.startsWith('image/')) return 'image';
  }
  const url = record.url ?? record.href ?? record.src ?? record.source_url;
  if (isHttpUrl(url) && VIDEO_EXT_PATTERN.test(url)) return 'video';
  return fallback;
}

function addUrl(
  items: ReviewMediaItem[],
  type: 'image' | 'video',
  url: unknown,
  poster?: unknown,
) {
  if (!isHttpUrl(url)) return;
  const cleanUrl = url.trim();
  if (items.some((item) => item.url === cleanUrl)) return;
  const item: ReviewMediaItem = { type, url: cleanUrl };
  if (isHttpUrl(poster)) item.poster = poster.trim();
  items.push(item);
}

function consumeValue(
  items: ReviewMediaItem[],
  fallback: 'image' | 'video',
  value: unknown,
) {
  const parsed = parseMaybeJson(value);
  if (parsed == null) return;

  if (Array.isArray(parsed)) {
    parsed.forEach((entry) => consumeValue(items, fallback, entry));
    return;
  }

  if (typeof parsed === 'object') {
    const record = parsed as LooseRecord;
    const url = record.url ?? record.href ?? record.src ?? record.source_url;
    const poster = record.poster ?? record.thumbnail ?? record.thumb;
    addUrl(items, mediaType(record, fallback), url, poster);
    return;
  }

  addUrl(items, mediaType(parsed, fallback), parsed);
}

function consumeMetaKey(items: ReviewMediaItem[], key: string, value: unknown) {
  if (IMAGE_URL_KEYS.has(key) || IMAGE_ID_KEYS.has(key)) consumeValue(items, 'image', value);
  else if (VIDEO_URL_KEYS.has(key) || VIDEO_ID_KEYS.has(key)) consumeValue(items, 'video', value);
}

function readMetaBag(review: LooseRecord): Array<[string, unknown]> {
  const pairs: Array<[string, unknown]> = [];

  const metaData = review.meta_data;
  if (Array.isArray(metaData)) {
    metaData.forEach((row) => {
      if (!row || typeof row !== 'object') return;
      const record = row as LooseRecord;
      if (typeof record.key === 'string') pairs.push([record.key, record.value]);
    });
  }

  const meta = review.meta;
  if (meta && typeof meta === 'object' && !Array.isArray(meta)) {
    Object.entries(meta as LooseRecord).forEach(([key, value]) => pairs.push([key, value]));
  }

  return pairs;
}

function readContentUrls(review: LooseRecord, items: ReviewMediaItem[]) {
  const content = typeof review.review === 'string' ? review.review : '';
  const images = content.match(new RegExp(IMAGE_URL_PATTERN.source, 'gi')) || [];
  const videos = content.match(new RegExp(VIDEO_URL_PATTERN.source, 'gi')) || [];
  images.forEach((url) => addUrl(items, 'image', url.replace(/&amp;/g, '&')));
  videos.forEach((url) => addUrl(items, 'video', url.replace(/&amp;/g, '&')));
}

export function getReviewMedia(review: object): ReviewMediaItem[] {
  const record = review as LooseRecord;
  const media: ReviewMediaItem[] = [];

  if (Array.isArray(record.media)) {
    record.media.forEach((entry) => consumeValue(media, 'image', entry));
  }

  readMetaBag(record).forEach(([key, value]) => consumeMetaKey(media, key, value));
  readContentUrls(record, media);

  return media;
}

export function withReviewMedia<T>(reviews: T[]): T[] {
  if (!Array.isArray(reviews)) return reviews;
  return reviews.map((review) => {
    if (!review || typeof review !== 'object') return review;
    return { ...(review as LooseRecord), media: getReviewMedia(review) } as T;
  });
}

export function videoFrameSrc(url: string): string {
  return url.includes('#') ? url : `${url}#t=0.1`;
}
