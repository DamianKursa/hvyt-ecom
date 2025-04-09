import Link from 'next/link';

const SocialIcons = () => {
  return (
    <div className="flex md:justify-end lg:justify-normal space-x-4 mt-0 md:mt-[-20px]">
      <Link
        target="_blank"
        href="https://www.facebook.com/HVYTPL/?locale=pl_PL"
        aria-label="Facebook"
      >
        <img src="/icons/Facebook.svg" alt="Facebook" className="h-6" />
      </Link>
      <Link
        target="_blank"
        href="https://instagram.com/hvyt_pl/"
        aria-label="Instagram"
      >
        <img src="/icons/Instagram.svg" alt="Instagram" className="h-6" />
      </Link>
      <Link
        target="_blank"
        href="https://pl.pinterest.com/meethvyt/"
        aria-label="Pinterest"
      >
        <img src="/icons/Pinterest.svg" alt="Pinterest" className="h-6" />
      </Link>
    </div>
  );
};

export default SocialIcons;
