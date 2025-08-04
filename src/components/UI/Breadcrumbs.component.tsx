import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Breadcrumbs: React.FC = () => {
  const router = useRouter();
  const { asPath } = router;
  const [showBreadcrumbs, setShowBreadcrumbs] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide breadcrumbs if scroll position is greater than 50px
      if (window.scrollY > 50) {
        setShowBreadcrumbs(false);
      } else {
        setShowBreadcrumbs(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!showBreadcrumbs) {
    return null;
  }

  // Build breadcrumbs for home, category, or product pages
  const cleanPath = asPath.split('?')[0];
  const rawSegments = cleanPath.split('/').filter(Boolean);

  // Helper to turn slug into human-friendly title
  const slugToTitle = (slug: string) =>
    slug.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());

  // Always start with Home
  const breadcrumbItems: { href: string; title: string }[] = [
    { href: '/', title: 'Hvyt' },
  ];

  // Category page: /kategoria/[slug]
  if (rawSegments[0] === 'kategoria' && rawSegments[1]) {
    breadcrumbItems.push({
      href: `/kategoria/${rawSegments[1]}`,
      title: slugToTitle(rawSegments[1]),
    });
  }
  // Product page: /produkt/[slug]
  else if (rawSegments[0] === 'produkt' && rawSegments[1]) {
    // If you want the category crumb above product, add logic here to fetch the category slug
    // For now, show only product title
    breadcrumbItems.push({
      href: `/produkt/${rawSegments[1]}`,
      title: slugToTitle(rawSegments[1]),
    });
  }
  // Fallback for other nested pages
  else if (rawSegments.length > 0) {
    rawSegments.forEach((segment, index) => {
      const href = '/' + rawSegments.slice(0, index + 1).join('/');
      breadcrumbItems.push({ href, title: slugToTitle(segment) });
    });
  }

  return (
    <nav
      aria-label="breadcrumb"
      className="flex flex-wrap items-center text-sm text-neutral-darkest md:h-10 text-left"
    >
      {breadcrumbItems.map((item, index) => (
        <span key={index} className="flex items-center">
          {index < breadcrumbItems.length - 1 ? (
            <Link
              href={item.href}
              className="hover:underline text-neutral-dark text-[14px] font-light underline"
            >
              {item.title}
            </Link>
          ) : (
            <span className="font-light text-neutral-darkest text-[14px] block">
              {item.title}
            </span>
          )}
          {index < breadcrumbItems.length - 1 && (
            <span className="mx-2">
              <Image
                src="/icons/Breadcrumbs-divider.svg"
                alt="Breadcrumb Divider"
                width={8}
                height={8}
              />
            </span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
