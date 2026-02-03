import React from 'react';
import Image from 'next/image';
import { useI18n } from '@/utils/hooks/useI18n';

// Product IDs that should show custom delivery text
const CUSTOM_DELIVERY_PRODUCT_IDS = new Set([
  '7564076',
  '7575924'
]);

interface DeliveryReturnInfoProps {
  onScrollToSection?: () => void;
  stock?: number | null;
  stockStatus?: string;
  isMeble?: boolean;
  productId?: string | number;
}

const DeliveryReturnInfo: React.FC<DeliveryReturnInfoProps> = ({
  onScrollToSection,
  stock,
  stockStatus,
  isMeble,
  productId,
}) => {
  const { t } = useI18n();
  const isCustomDeliveryProduct = productId
    ? CUSTOM_DELIVERY_PRODUCT_IDS.has(String(productId))
    : false;
  
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
    const shippingText = isCustomDeliveryProduct ? t.product.shippingAfter : t.product.shippingIn24h;
    
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
        <div
          className={`flex items-center p-4 space-x-4 w-full ${filteredItems.length > 0 ? 'border-b border-[#DAD3C8]' : ''}`}
        >
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
          className={`flex items-center p-4 space-x-4 w-full ${index < filteredItems.length - 1 ? 'border-b border-[#DAD3C8]' : ''
            }`}
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
    </div>
  );
};

export default DeliveryReturnInfo;
