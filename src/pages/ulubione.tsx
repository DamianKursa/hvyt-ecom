import { useWishlist } from '@/context/WhishlistContext';
import ProductPreview from '@/components/Product/ProductPreview.component';
import React from 'react';
import Layout from '@/components/Layout/Layout.component';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <Layout title="Ulubione">
      <div className="container px-4 py-8 md:py-0 md:px-0 max-w-[1440px]">
        <h1 className="text-[40px] text-dark-pastel-red font-bold mb-6">
          Ulubione
        </h1>
        {wishlist.length === 0 ? (
          <p className="text-gray-500">Nie masz ulubionych produktów.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {wishlist.map((product) => (
              <div key={product.slug} className="flex flex-col items-start">
                {/* Product Preview */}
                <ProductPreview
                  product={product}
                  containerClass="w-full"
                  isSmall={false}
                />
                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(product.slug)}
                  className="mt-4 flex py-2 items-center justify-center px-4 text-sm font-light text-black border border-black hover:border-dark-pastel-red rounded-full hover:bg-dark-pastel-red hover:text-white transition"
                >
                  <img
                    src="/icons/trash-black.svg"
                    alt="Trash Icon"
                    className="w-6 h-6 mr-2"
                  />
                  Usuń z ulubionych
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WishlistPage;
