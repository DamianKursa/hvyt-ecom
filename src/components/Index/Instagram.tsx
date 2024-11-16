import React, { useEffect, useState } from 'react';
import 'swiper/css';
import Image from 'next/image';
import Link from 'next/link';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider';

const Instagram = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInstagramPosts = async () => {
      try {
        const response = await fetch('/api/instagram');
        if (!response.ok) throw new Error('Failed to fetch Instagram posts');
        const data = await response.json();
        setPosts(data.data.slice(0, 4) || []); // Limit to 4 posts immediately
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        setLoading(false);
      }
    };

    getInstagramPosts();
  }, []);

  if (loading) {
    return <p>Ładowanie...</p>;
  }

  return (
    <section className="container mx-auto max-w-grid-desktop mt-[115px] py-16 md:px-0">
      {/* Heading and Description */}
      <div className="px-4 md:px-0 mb-8">
        <h2 className="font-size-h2 font-bold text-neutral-darkest text-left">
          Hvyt w waszych domach
        </h2>
        <p className="font-size-text-medium text-neutral-darkest text-left">
          Zainspiruj się i zobacz jak nasze produkty sprawdzają się u innych.
        </p>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="grid grid-cols-4 gap-6">
          {posts.map((post, index) => (
            <div key={index} className="relative w-full h-[350px] col-span-1">
              <Image
                src={post.media_url}
                alt={post.caption || 'Instagram Post'}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* Centered Button with Instagram Icon */}
        <div className="flex justify-center mt-8">
          <Link
            href="https://www.instagram.com/hvyt_pl"
            className="px-6 py-3 text-lg font-light border border-neutral-dark rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all flex items-center space-x-2"
          >
            <span>Zobacz nasz Instagram</span>
            <img
              src="/icons/Instagram.svg"
              alt="Instagram Icon"
              className="h-5 w-5"
            />
          </Link>
        </div>
      </div>

      {/* Mobile View: Responsive Slider */}
      <div className="md:hidden">
        <ResponsiveSlider
          items={posts} // Posts are already limited to 4
          renderItem={(post: any) => (
            <div className="relative w-full h-[350px]">
              <Image
                src={post.media_url}
                alt={post.caption || 'Instagram Post'}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default Instagram;
