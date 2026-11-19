import { useEffect, useState } from 'react';
import { useI18n } from '@/utils/hooks/useI18n';

const ScrollToTop = () => {
  const { isEn } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setVisible(window.scrollY >= window.innerHeight);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);

    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={isEn ? 'Back to top' : 'Wróć na górę'}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-4 right-2 z-40 flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-[999px] border border-solid border-dark-pastel-red bg-dark-pastel-red px-[16px] pb-[12px] pt-[10px] transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <img
        src="/icons/scroll-to-top-chevron.svg"
        alt=""
        className="block max-w-none shrink-0"
      />
    </button>
  );
};

export default ScrollToTop;
