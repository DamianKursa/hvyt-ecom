// components/Product/DisplayProducts.tsx

import Link from 'next/link';

interface Image {
  sourceUrl?: string;
}

interface VariationNode {
  price: string;
  regularPrice: string;
  salePrice?: string;
}

interface Variations {
  nodes: VariationNode[];
}

interface Product {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  description: string;
  image: Image;
  onSale: boolean;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  variations?: Variations;
}

interface DisplayProductsProps {
  products: Product[];
}

const DisplayProducts: React.FC<DisplayProductsProps> = ({ products }) => (
  <div className="grid grid-cols-3 gap-8">
    {products.map((product) => (
      <div key={product.id} className="product-item p-4 border rounded-lg">
        <Link href={`/produkt/${product.slug}`}>
        
            <img
              src={product.image?.sourceUrl || '/images/placeholder.png'}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          
        </Link>
        <Link href={`/produkt/${product.slug}`}>

            <h2 className="text-xl font-semibold">{product.name}</h2>
        </Link>
        <p className="text-lg">
          {product.onSale
            ? product.salePrice || product.price
            : product.price}{' '}
          zł
        </p>
      </div>
    ))}
  </div>
);

export default DisplayProducts;
