// interfaces.ts

export interface ProductAttribute {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  price: string;
  salePrice?: string;
  regularPrice?: string;
  description: string;
  image: string;
  attributes: {
    nodes: ProductAttribute[];
  };
  variations?: {
    nodes: {
      image?: {
        sourceUrl: string;
      };
    }[];
  };
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
