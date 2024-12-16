export interface ProductAttribute {
  name: string;
  options: string[];
}

export interface Attribute {
  id: number;
  name: string;
  options?: any[];
}

export interface Category {
  id: number;
  name: string;
}

export interface CategoryPageProps {
  category: Category;
  attributes: Attribute[];
  initialProducts: any[];
  totalProducts: number;
}
export interface LineItem {
  product_id: string;
  name: string;
  quantity: number;
  price: string;
  total: string;
  image?: string; // Optional image property
  regular_price?: string; // Optional regular price property
}

export interface Address {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: number;
  date_created: string;
  payment_status: string;
  status: string;
  total: string;
  subtotal?: string;
  shipping_total?: string;
  tax?: string;
  phone?: string;
  email?: string;
  shipping: Address; // Correctly typing shipping as an Address object
  line_items: LineItem[];
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
  slug: string;
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
  quantity?: number;
  totalPrice?: number;
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
  acf?: {
    ikonka_1?: string;
    ikonka_2?: string;
    ikonka_3?: string;
    ikonka_4?: string;
  };
}

export interface NowosciPost {
  id: number;
  title: { rendered: string };
  featured_media: number;
  imageUrl: string; // Featured image URL
}

export interface PostArchive {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  date: string;
  _embedded?: {
    'wp:featuredmedia'?: { source_url: string }[];
  };
  featuredImage?: string; // Add transformed `featuredImage` property
}
