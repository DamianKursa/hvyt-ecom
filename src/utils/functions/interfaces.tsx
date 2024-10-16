export interface Kolekcja {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content:{
    rendered: string;
  }
  imageUrl: string; // This will be added manually later
  featured_media?: number; // Add featured_media as optional
  yoast_head_json?: {
    og_image?: { url: string }[];
  };
}