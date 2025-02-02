import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider';
import { fetchNowosciPosts } from '@/utils/api/woocommerce';
import SkeletonNowosci from '@/components/Skeletons/SkeletonNowosci';
import { motion, useAnimation } from 'framer-motion';

interface NowosciItem {
  id: number;
  src: string; // Image URL
  alt: string; // Image Alt Text
  title?: string; // Optional title
}

const NewArrivalsSection = () => {
  const [nowosciItems, setNowosciItems] = useState<NowosciItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Create animation controls for the images container and title
  const imageControls = useAnimation();
  const titleControls = useAnimation();

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

  // Sequence the animation with a short delay on mount
  useEffect(() => {
    async function runAnimationSequence() {
      // Wait 500ms before starting
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Phase 1: Expand the images container to 642px
      await imageControls.start({
        height: 642,
        transition: { duration: 1, ease: 'easeInOut' },
      });
      // Animate the title upward so it appears above the images
      await titleControls.start({
        y: -100,
        transition: { duration: 1, ease: 'easeInOut' },
      });
      // Phase 2: Contract the images container back to 300px.
      // Since the container’s height decreases, it animates from the bottom upward.
      await imageControls.start({
        height: 300,
        transition: { duration: 1, ease: 'easeInOut' },
      });
    }
    runAnimationSequence();
  }, [imageControls, titleControls]);

  if (loading) {
    return <SkeletonNowosci />;
  }

  if (nowosciItems.length < 4) {
    return <p>Insufficient Nowosci data available.</p>;
  }

  return (
    <section className="container mx-auto max-w-grid-desktop mt-0 lg:mt-[115px] py-16 relative">
      {/* Mobile Header */}
      <div className="px-[16px] flex flex-col items-start mb-8 md:hidden">
        <h2 className="font-size-h2 font-bold text-neutral-darkest">
          Zobacz nasze nowości
        </h2>
        <p className="font-size-text-medium text-neutral-darkest mt-2">
          Nowa gałka HALOHOLD projektu Moniki Rogusz-Witkoś.
        </p>
        <Link
          href="/kategoria/uchwyty-meblowe?sort=Najnowsze+produkty"
          className="mt-4 px-6 py-3 text-lg font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
        >
          Zobacz nowości →
        </Link>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex gap-6 h-[650px]">
        {/* First Column */}
        <div className="flex flex-col w-1/2 relative">
          {/* Animated Title Container */}
          <motion.div
            className="title-container"
            initial={{ y: 0 }}
            animate={titleControls}
            style={{ position: 'relative', zIndex: 20 }}
          >
            <h2 className="font-size-h2 font-bold text-neutral-darkest">
              Zobacz nasze nowości
            </h2>
            <p className="font-size-text-medium mt-[10px] text-neutral-darkest">
              Nowa gałka HALOHOLD projektu Moniki Rogusz-Witkoś.
            </p>
            <Link
              href="/kategoria/uchwyty-meblowe?sort=Najnowsze+produkty"
              className="w-1/3 mt-[40px] inline-block px-6 py-3 text-lg font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
            >
              Zobacz nowości →
            </Link>
          </motion.div>

          {/* Animated Images Container */}
          <motion.div
            className="flex gap-6 overflow-hidden"
            initial={{ height: 300 }}
            animate={imageControls}
            style={{ position: 'relative', zIndex: 10 }}
          >
            <div className="w-full relative">
              <Image
                src={nowosciItems[0].src}
                alt={nowosciItems[0].alt}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>
            <div className="w-full relative">
              <Image
                src={nowosciItems[1].src}
                alt={nowosciItems[1].alt}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>
          </motion.div>
        </div>

        {/* Second Column */}
        <div className="flex flex-col w-1/2">
          <div className="flex gap-6 h-full">
            <div className="w-full h-full relative">
              <Image
                src={nowosciItems[2].src}
                alt={nowosciItems[2].alt}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>
            <div className="w-full h-full relative">
              <Image
                src={nowosciItems[3].src}
                alt={nowosciItems[3].alt}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
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
                className="rounded-lg"
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
    </section>
  );
};

export default NewArrivalsSection;
