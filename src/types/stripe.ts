// types/stripe.ts

export interface PaymentFormData {
  email: string;
  name: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
}

export interface CartItem {
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  variation_id?: number;
}

  export interface StripeShippingDetails {
    name: string;
    phone?: string;
    address: PaymentFormData['address'];
  }

  export interface StripePaymentResult {
    id: string;
    paid: boolean;
  }

  export interface StripePaymentFormHandle {
    confirmPayment: () => Promise<StripePaymentResult | null>;
    getPaymentIntentId: () => string | null;
  }

  export interface StripePaymentData {
    id: string | null
  }

// export interface Cart {
//   items: CartItem[];
//   total: number;
//   currency: string;
// }