// utils/gtm.ts
import { trackPinterest } from './pinterest';

type EcommercePayload = {
  value?: number;
  currency?: string;
  items?: Array<{ quantity?: number }>;
  transaction_id?: string;
  [k: string]: any;
};

export const pushGTMEvent = (
  eventName: string,
  ecommerce: EcommercePayload = {}
): void => {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    // 1) push to GTM
    (window as any).dataLayer.push({
      event: eventName,
      ecommerce,
    });
  }

  // 2) mirror to Pinterest
  const pinterestMap: Record<string, string> = {
    view_item:     'viewitem',
    add_to_cart:   'addtocart',
    begin_checkout:'checkout',
    purchase:      'purchase',
    add_payment_info:  'addpaymentinfo',
    add_shipping_info: 'addshippinginfo',
  };

  const pinEvent = pinterestMap[eventName];
  if (pinEvent) {
    const { value, currency, items, transaction_id } = ecommerce;

    // compute total quantity
    const order_quantity = Array.isArray(items)
      ? items.reduce((sum, i) => sum + (i.quantity || 0), 0)
      : undefined;

    // build the param object
    const pinParams: Record<string, any> = {};
    if (value       != null) pinParams.value       = value;
    if (currency    != null) pinParams.currency    = currency;
    if (order_quantity != null) pinParams.order_quantity = order_quantity;
    if (transaction_id)      pinParams.order_id    = transaction_id;

    trackPinterest(pinEvent, pinParams);
  }
};
