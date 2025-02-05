import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider';
import { fetchNowosciPosts } from '@/utils/api/woocommerce';
import SkeletonNowosci from '@/components/Skeletons/SkeletonNowosci';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface NowosciItem {
  id: number;
  src: string; // Image URL
  alt: string; // Image Alt Text
  title?: string; // Optional title
}

// Constants – adjust these numbers as needed.
const HERO_HEIGHT = 800; // When the hero is completely off-screen.
const INITIAL_HEIGHT = 344; // Initially visible height (px)
const FINAL_HEIGHT = 642; // Final full container height (px)
// Calculate the initial vertical scale so that only the bottom INITIAL_HEIGHT is shown.
const INITIAL_SCALE = INITIAL_HEIGHT / FINAL_HEIGHT;

/**
 * mergeRefs calls every ref in the array with the node.
 * This avoids directly assigning to a ref’s `.current` (which may be read-only).
 */
function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (node: T) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
}

const NewArrivalsSection = () => {
  const [nowosciItems, setNowosciItems] = useState<NowosciItem[]>([]);
  const [loading, setLoading] = useState(true);
  // heroOut becomes true when the hero is completely off-screen.
  const [heroOut, setHeroOut] = useState(false);

  // Create a ref for the section and use the Intersection Observer.
  const sectionRef = useRef<HTMLElement | null>(null);
  const { ref: inViewRef, inView } = useInView({
    threshold: 1,
    triggerOnce: true,
  });
  const combinedRef = mergeRefs(sectionRef, inViewRef);

  // Fetch posts.
  useEffect(() => {
    const loadNowosci = async () => {
      try {
        const posts = await fetchNowosciPosts();
        const items: NowosciItem[] = posts.map((post) => ({
          id: post.id,
          src: post.imageUrl,
          alt: post.title.rendered,
          title: post.title.rendered,
        }));
        setNowosciItems(items);
      } catch (error) {
        console.error('Error fetching Nowosci items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNowosci();
  }, []);

  // Listen to scroll events to update heroOut and lock/unlock scrolling.
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset >= HERO_HEIGHT && !heroOut) {
        setHeroOut(true);
        // Lock scrolling during the animation.
        document.body.style.overflow = 'hidden';
        // After the animation duration + buffer, unlock scroll.
        setTimeout(() => {
          document.body.style.overflow = '';
        }, 1200);
      } else if (window.pageYOffset < HERO_HEIGHT && heroOut) {
        setHeroOut(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    // Check immediately in case the user is already scrolled down.
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [heroOut]);

  if (loading) {
    return <SkeletonNowosci />;
  }
  if (nowosciItems.length < 4) {
    return <p>Insufficient Nowosci data available.</p>;
  }

  return (
    <section
      ref={combinedRef}
      className="container mx-auto max-w-grid-desktop mt-0 lg:mt-[115px] py-16"
    >
      {/* Mobile View remains unchanged */}
      <div className="px-[16px] flex flex-col items-start mb-8 md:hidden">
        <h2 className="font-size-h2 font-bold text-neutral-darkest">
          Zobacz nasze nowości
        </h2>
        <p className="font-size-text-medium text-neutral-darkest mt-2">
          Nowa gałka HALOHOLD projektu Moniki Rogusz-Witkoś.
        </p>
        <Link
          href="#"
          className="mt-4 px-6 py-3 text-lg font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
        >
          Zobacz nowości →
        </Link>
      </div>
      <div className="md:hidden">
        <ResponsiveSlider
          items={nowosciItems.map((item) => ({
            src: item.src,
            alt: item.alt,
            title: item.title,
          }))}
          renderItem={(item: { src: string; alt: string; title?: string }) => (
            <div className="relative w-full h-[350px]">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-[16px]"
              />
              {item.title && (
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                  {item.title}
                </div>
              )}
            </div>
          )}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex gap-6">
        {/* Left Column */}
        <div className="flex flex-col w-1/2 relative">
          {/* Title Block that moves upward when heroOut is true */}
          <motion.div
            initial={{ y: 0 }}
            animate={heroOut ? { y: -300 } : { y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col mb-8 relative z-10"
          >
            <h2 className="font-size-h2 font-bold text-neutral-darkest">
              Zobacz nasze nowości
            </h2>
            <p className="font-size-text-medium mt-[10px] text-neutral-darkest">
              Nowa gałka HALOHOLD projektu Moniki Rogusz-Witkoś.
            </p>
            <Link
              href="#"
              className="w-1/3 mt-[40px] inline-block px-6 py-3 text-lg font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
            >
              Zobacz nowości →
            </Link>
          </motion.div>

          {/* Extra wrapper: animate container height from FINAL_HEIGHT (642px) to INITIAL_HEIGHT (344px) */}
          <motion.div
            className="relative overflow-hidden"
            style={{ top: '-220px', height: FINAL_HEIGHT }}
            initial={{ height: FINAL_HEIGHT }}
            animate={
              heroOut ? { height: INITIAL_HEIGHT } : { height: FINAL_HEIGHT }
            }
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="flex gap-6 overflow-hidden h-full">
              {/* First Left Image */}
              <div className="w-full overflow-hidden flex items-end">
                <motion.div
                  className="relative w-full h-full"
                  style={{ transformOrigin: 'bottom' }}
                  initial={{ scaleY: INITIAL_SCALE }}
                  animate={{ scaleY: heroOut ? 1 : INITIAL_SCALE }}
                  transition={{ duration: 1 }}
                >
                  <Image
                    src={nowosciItems[0].src}
                    alt={nowosciItems[0].alt}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-[16px]"
                  />
                </motion.div>
              </div>
              {/* Second Left Image */}
              <div className="w-full overflow-hidden flex items-end">
                <motion.div
                  className="relative w-full h-full"
                  style={{ transformOrigin: 'bottom' }}
                  initial={{ scaleY: INITIAL_SCALE }}
                  animate={{ scaleY: heroOut ? 1 : INITIAL_SCALE }}
                  transition={{ duration: 1 }}
                >
                  <Image
                    src={nowosciItems[1].src}
                    alt={nowosciItems[1].alt}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-[16px]"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column – remains unchanged */}
        <div className="flex flex-col w-1/2">
          <div className="flex gap-6 h-full">
            <div className="w-full h-full">
              <Image
                src={nowosciItems[2].src}
                alt={nowosciItems[2].alt}
                width={322}
                height={642}
                className="w-full md:w-[322px] md:h-[642px] h-[245px] object-cover rounded-[16px]"
              />
            </div>
            <div className="w-full h-full">
              <Image
                src={nowosciItems[3].src}
                alt={nowosciItems[3].alt}
                width={322}
                height={642}
                className="w-full md:w-[322px] md:h-[642px] h-[245px] object-cover rounded-[16px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;
