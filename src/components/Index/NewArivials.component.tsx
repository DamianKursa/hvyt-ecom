import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider';
import { fetchNowosciPosts } from '@/utils/api/woocommerce';
import SkeletonNowosci from '@/components/Skeletons/SkeletonNowosci';
import { motion } from 'framer-motion';

interface NowosciItem {
  id: number;
  src: string; // Image URL
  alt: string; // Image Alt Text
  title?: string; // Optional title
}

const NewArrivalsSection = () => {
  const [nowosciItems, setNowosciItems] = useState<NowosciItem[]>([]);
  const [loading, setLoading] = useState(true);
  // This flag triggers the final state animation.
  const [animateFinal, setAnimateFinal] = useState(false);

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

    // Trigger final layout state after 1 second.
    const timer = setTimeout(() => {
      setAnimateFinal(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SkeletonNowosci />;
  }
  if (nowosciItems.length < 4) {
    return <p>Insufficient Nowosci data available.</p>;
  }

  return (
    <section className="container mx-auto max-w-grid-desktop mt-0 lg:mt-[115px] py-16">
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

      {/* Desktop View */}
      {/* Remove fixed h-[650px] to let height animate */}
      <motion.div
        className="hidden md:flex gap-6"
        layout
        initial={{ height: 650 }} // initial overall height
        animate={{ height: animateFinal ? 642 : 650 }}
        transition={{ duration: 1 }}
      >
        {/* Left Column */}
        <motion.div className="flex flex-col w-1/2 relative" layout>
          {/* Title Block */}
          <motion.div
            layout
            initial={{ marginBottom: 120, y: 0, position: 'relative' }}
            animate={
              animateFinal
                ? {
                    marginBottom: 0,
                    y: -120,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                  }
                : { marginBottom: 120, y: 0, position: 'relative' }
            }
            transition={{ duration: 1 }}
            className="flex flex-col"
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

          {/* Images Container for Images 1 and 2 */}
          {/* Fixed container height: 642px */}
          <div className="flex gap-6 overflow-hidden" style={{ height: 642 }}>
            <motion.div
              layout
              style={{ transformOrigin: 'bottom' }}
              initial={{ scaleY: 300 / 642 }}
              animate={{ scaleY: animateFinal ? 1 : 300 / 642 }}
              transition={{ duration: 1 }}
              className="w-full overflow-hidden flex items-end"
            >
              <Image
                src={nowosciItems[0].src}
                alt={nowosciItems[0].alt}
                width={350}
                height={642}
                className="w-full h-full object-cover object-bottom rounded-lg"
              />
            </motion.div>
            <motion.div
              layout
              style={{ transformOrigin: 'bottom' }}
              initial={{ scaleY: 300 / 642 }}
              animate={{ scaleY: animateFinal ? 1 : 300 / 642 }}
              transition={{ duration: 1 }}
              className="w-full overflow-hidden flex items-end"
            >
              <Image
                src={nowosciItems[1].src}
                alt={nowosciItems[1].alt}
                width={350}
                height={642}
                className="w-full h-full object-cover object-bottom rounded-lg"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Right Column remains unchanged */}
        <div className="flex flex-col w-1/2">
          <div className="flex gap-6 h-full">
            <div className="w-full h-full">
              <Image
                src={nowosciItems[2].src}
                alt={nowosciItems[2].alt}
                width={322}
                height={642}
                className="w-full md:w-[322px] md:h-[642px] h-[245px] object-cover rounded-lg"
              />
            </div>
            <div className="w-full h-full">
              <Image
                src={nowosciItems[3].src}
                alt={nowosciItems[3].alt}
                width={322}
                height={642}
                className="w-full md:w-[322px] md:h-[642px] h-[245px] object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default NewArrivalsSection;
