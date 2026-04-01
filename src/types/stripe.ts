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

  export interface StripePaymentData {
    id: string | null
  }

// export interface Cart {
//   items: CartItem[];
//   total: number;
//   currency: string;
// }