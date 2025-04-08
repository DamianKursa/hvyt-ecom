export const pushGTMEvent = (
  eventName: string,
  ecommerce: Record<string, any> = {}
): void => {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: eventName,
      ecommerce,
    });
  }
};
