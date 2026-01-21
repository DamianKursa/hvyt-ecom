export type WooProduct = 
{ 
    id: number; 
    slug?: string; 
    [key: string]: any 
};

export interface WooProductIds {
    slugs : {
        [key: string]: string;
    }
    ids: {
        [key: string]: string;
    }
}