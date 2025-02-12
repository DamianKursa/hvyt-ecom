import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Breadcrumbs: React.FC = () => {
  const router = useRouter();
  const { asPath } = router;

  // Remove query string by splitting on "?" and taking the first part
  const cleanPath = asPath.split('?')[0];

  // Split the clean path into segments and filter out empty values
  const pathSegments = cleanPath.split('/').filter((segment) => segment);

  // Generate the breadcrumb items from the clean path
  const breadcrumbItems = pathSegments.map((segment, index) => {
    // Reconstruct the href for each breadcrumb step
    const href = '/' + pathSegments.slice(0, index + 1).join('/');

    // Capitalize the first letter of each breadcrumb title
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
      className="flex flex-nowrap items-center text-sm text-neutral-darkest md:h-10"
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
            <span className="font-light text-neutral-darkest text-[14px]">
              {item.title}
            </span>
          )}

          {/* Only show the custom SVG divider if it's not the last item */}
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
