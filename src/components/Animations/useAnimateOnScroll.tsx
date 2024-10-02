import { useState, useEffect, RefObject } from 'react';

export const useAnimateOnScroll = (ref: RefObject<HTMLElement>, threshold = 0.3) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current; // Store the reference in a variable

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); // Unobserve after triggering animation
          }
        });
      },
      { threshold }
    );

    if (element) {
      observer.observe(element); // Observe the stored element
    }

    return () => {
      if (element) observer.unobserve(element); // Unobserve using the stored element
    };
  }, [ref, threshold]);

  return isVisible;
};
