export interface ProductAttribute {
  name: string;
  options: string[];
}

export interface User {
  name?: string;
  username?: string;
  email?: string;
}

export interface Variation {
  id: string;
  name?: string;
  price?: string;
  regular_price?: string;
  sale_price?: string;
  image?: {
    sourceUrl: string;
  };
  attributes?: {
    id: string;
    name: string;
    option: string;
  }[];
}

export interface Product {
  id: string;
  name: string;
  price: string;
  salePrice?: string;
  regularPrice?: string;
  description: string;
  image: string; // Main image
  images?: {
    src: string;
  }[]; // Array of images
  attributes: ProductAttribute[];
  variations?: Variation[]; // Array of product variations
  meta_data?: {
    key: string;
    value: string;
  }[];
  lowest_price?: string;
  baselinker_variations?: Array<{
    id: number;
    sku: string;
    in_stock: boolean;
    stock_quantity: string;
    price: number;
    regular_price: number;
    sale_price: number;
    description: string;
    visible: boolean;
    manage_stock: boolean;
    purchasable: boolean;
    on_sale: boolean;
    image: {
      id: number;
      src: string;
    };
    attributes: Array<{
      id: string;
      name: string;
      option: string;
    }>;
    weight: string;
    meta_data: Array<{
      key: string;
      value: string;
    }>;
  }>;
}

export interface Kolekcja {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  imageUrl: string;
  featured_media?: number;
  yoast_head_json?: {
    og_image?: { url: string }[];
  };
}
