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
  image?: string | { src: string };
  regular_price?: string;
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
  payment_method?: string;
  shipping: Address;
  line_items: LineItem[];
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    company?: string;
    address_1?: string;
    city?: string;
    postcode?: string;
    country?: string;
    phone?: string;
  };
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
  on_sale?: boolean;
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
  type?: 'simple' | 'variable';
  slug: string;
  sale_price?: string;
  regular_price?: string;
  on_sale?: boolean;
  categories?: { id: number; name: string; slug: string }[];
  description: string;
  short_description?: string;
  image: string;
  images?: {
    src: string;
  }[];
  attributes: ProductAttribute[];
  variations?: Variation[];
  meta_data?: {
    key: string;
    value: string;
  }[];
  yoast_head_json?: {
    title?: string;
    description?: string;
    canonical?: string;
    [key: string]: any;
  };
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
    title?: string;
    description?: string;
    canonical?: string;
    [key: string]: any;
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
  imageUrl: string;
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
  featuredImage?: string;
}
