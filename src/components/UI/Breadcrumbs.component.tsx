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

  const cleanPath = asPath.split('?')[0];

  // Split the clean path into segments and filter out empty values
  const pathSegments = cleanPath.split('/').filter((segment) => segment);
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const title = segment
      .replace(/-/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase());
    return { href, title };
  });

  // Add the home page as the first breadcrumb item
  breadcrumbItems.unshift({ href: '/', title: 'Hvyt' });

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
