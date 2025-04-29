// utils/pinterest.ts
export function trackPinterest(eventName: string, params: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && (window as any).pintrk) {
    (window as any).pintrk('track', eventName, params);
  }
}
