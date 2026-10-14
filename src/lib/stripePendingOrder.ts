const PENDING_KEY = 'hvyt-stripe-pending-order';
const COMPLETED_KEY = 'hvyt-stripe-completed-payment';
const RESUME_LOCK_KEY = 'hvyt-stripe-resume-lock';

export type StripeCheckoutTracking = {
  products: Array<{
    productId: number;
    name: string;
    price: number;
    qty: number;
  }>;
  value: number;
  email: string;
  userId?: string | number;
  externalId?: string;
  paymentMethod: string;
  billing: {
    firstName: string;
    lastName: string;
    phone: string;
    postalCode: string;
    city: string;
    country: string;
  };
  shippingMethod: unknown;
  shippingCost: number;
  shippingAddress: {
    city: string;
    country: string;
    postcode: string;
  };
  saveAddress: boolean;
  addressToSave: Record<string, unknown> | null;
};

export type PendingStripeOrder = {
  paymentIntentId: string;
  orderData: Record<string, any>;
  tracking: StripeCheckoutTracking;
};

export type CompletedStripePayment = {
  paymentIntentId: string;
  thankYouPath: string;
};

function readJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function savePendingStripeOrder(pending: PendingStripeOrder): void {
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
}

export function readPendingStripeOrder(): PendingStripeOrder | null {
  return readJson<PendingStripeOrder>(PENDING_KEY);
}

export function clearPendingStripeOrder(): void {
  sessionStorage.removeItem(PENDING_KEY);
}

export function markStripePaymentCompleted(completed: CompletedStripePayment): void {
  sessionStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
}

export function readCompletedStripePayment(): CompletedStripePayment | null {
  return readJson<CompletedStripePayment>(COMPLETED_KEY);
}

export function beginStripeResume(paymentIntentId: string): boolean {
  const current = sessionStorage.getItem(RESUME_LOCK_KEY);
  if (current) {
    const separator = current.lastIndexOf(':');
    const id = separator >= 0 ? current.slice(0, separator) : current;
    const startedAt = separator >= 0 ? Number(current.slice(separator + 1)) : 0;
    const age = Date.now() - startedAt;
    if (id === paymentIntentId && age >= 0 && age < 20000) return false;
  }
  sessionStorage.setItem(RESUME_LOCK_KEY, `${paymentIntentId}:${Date.now()}`);
  return true;
}

export function endStripeResume(): void {
  sessionStorage.removeItem(RESUME_LOCK_KEY);
}

export function isStripeRedirectReturn(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).has('payment_intent');
}
