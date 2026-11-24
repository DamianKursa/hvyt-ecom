import React from 'react';
import Image from 'next/image';
import { useI18n } from '@/utils/hooks/useI18n';

// Product IDs that should show custom delivery text
const CUSTOM_DELIVERY_PRODUCT_IDS = new Set([
  ''
]);

interface DeliveryReturnInfoProps {
  onScrollToSection?: () => void;
  onOpenReviews?: () => void;
  reviewCount?: number | null;
  stock?: number | null;
  stockStatus?: string;
  isMeble?: boolean;
  productId?: string | number;
}

const DeliveryReturnInfo: React.FC<DeliveryReturnInfoProps> = ({
  onScrollToSection,
  onOpenReviews,
  reviewCount = null,
  stock,
  stockStatus,
  isMeble,
  productId,
}) => {
  const { t } = useI18n();
  const isCustomDeliveryProduct = productId
    ? CUSTOM_DELIVERY_PRODUCT_IDS.has(String(productId))
    : false;

  const customDeliveryText = 'Wysyłka w 6 tygodni ';
  
  const items = [
    {
      icon: '/icons/zwrot.svg',
      text: t.product.returnPolicy,
      alt: 'Return Policy',
    },
    {
      icon: '/icons/galka.png',
      text: t.product.checkSameColor,
      alt: 'Frequently bought together',
      isInteractive: true,
    },
  ];

  // Always show both items, even for meble
  const filteredItems = items;

  // Render stock row if meble or if stock positive / in stock
  const shouldRenderStockRow =
    Boolean(isMeble) ||
    (typeof stock === 'number' && stock > 0) ||
    stockStatus === 'instock';

  const getStockText = () => {
    const shippingText = isCustomDeliveryProduct ? t.checkout.delivery6weeks : t.checkout.delivery24h;
    
    if (typeof stock === 'number' && stock > 0) {
      if (stock >= 50) {
        return `${t.product.over50InStock} ${shippingText}`;
      }
      return `${t.product.onlyXInStock.replace('{count}', String(stock))} ${shippingText}`;
    }
    if (stockStatus === 'instock') {
      return `${t.product.inStock} ${shippingText}`;
    }
    return null;
  };

  return (
    <div className="mt-4 border border-beige-dark rounded-[24px]">
      {shouldRenderStockRow && (
        <div className="flex items-center p-4 space-x-4 w-full border-b border-[#DAD3C8]">
          <Image
            src="/icons/stock.svg"
            alt="Stock info"
            width={24}
            height={24}
          />
          <span className="text-black font-medium">
            {getStockText()}
          </span>
        </div>
      )}
      {filteredItems.map((item, index) => (
        <div
          key={index}
          className="flex items-center p-4 space-x-4 w-full border-b border-[#DAD3C8]"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <Image
              src={item.icon}
              alt={item.alt}
              width={item.isInteractive ? 16 : 24}
              height={item.isInteractive ? 16 : 24}
            />
          </div>
          <span className="text-black">
            {item.isInteractive ? (
              <>
                <span
                  className="underline cursor-pointer text-dark-pastel-red"
                  onClick={onScrollToSection}
                >
                  {t.product.check}
                </span>{' '}
                {t.product.checkSameColor.replace(t.product.check, '').trim()}
              </>
            ) : (
              item.text
            )}
          </span>
        </div>
      ))}
      <div className="flex items-center p-4 space-x-4 w-full">
        <div className="w-6 h-6 flex items-center justify-center">
          <Image
            src="/icons/reviews.svg"
            alt="Reviews"
            width={24}
            height={24}
          />
        </div>
        <span className="text-black">
          <span
            className="underline cursor-pointer text-dark-pastel-red"
            onClick={onOpenReviews}
          >
            {t.product.discoverReviewsLink}
          </span>
          {' '}
          {t.product.discoverReviews.replace(t.product.discoverReviewsLink, '').trim()}
          {reviewCount !== null && ` (${reviewCount})`}
        </span>
      </div>
    </div>
  );
};

export default DeliveryReturnInfo;
