import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/utils/hooks/useI18n';

const Instagram = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const {t} = useI18n();
  
  useEffect(() => {
    const getInstagramPosts = async () => {
      try {
        const response = await fetch('/api/instagram');
        if (!response.ok) throw new Error('Failed to fetch Instagram posts');
        const data = await response.json();
        console.log('Instagram API response:', data);
        setPosts(data.data ? data.data.slice(0, 4) : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        setLoading(false);
      }
    };

    getInstagramPosts();
  }, []);

  if (loading) {
    return <p>{t.modal.loading}</p>;
  }

  return (
    <section className="mx-auto max-w-grid-desktop py-16 px-4 md:px-4 lg:px-4 xl:px-4 min-[1440px]:px-0">
      <div className="px-4 md:px-0 mb-8">
        <h2 className="font-size-h2 font-bold text-neutral-darkest text-left">
          {t.product.instagramTitle}
        </h2>
        <p className="font-size-text-medium text-neutral-darkest mt-[10px] text-left">
          {t.product.instagramMessage}
        </p>
      </div>

      <div className="hidden md:block px-4 min-[1440px]:px-0">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {posts.map((post, index) => (
            <a
              key={index}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square col-span-1 overflow-hidden w-full max-w-[322px]"
            >
              {post.media_type === 'VIDEO' ? (
                <video
                  src={post.media_url}
                  controls
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Image
                  src={post.media_url}
                  alt={post.caption || 'Instagram Post'}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
              )}
            </a>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link
            href="https://www.instagram.com/hvyt_pl"
            className="px-6 py-3 text-lg font-light border border-black rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all flex items-center space-x-2"
          >
            <span>{t.product.instagramCTA}</span>
            <img
              src="/icons/Instagram.svg"
              alt="Instagram Icon"
              className="h-5 w-5"
            />
          </Link>
        </div>
      </div>

      <div className="md:hidden grid grid-cols-2 gap-4 px-4 min-[1440px]:px-0">
        {posts.map((post, index) => (
          <a
            key={index}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-full h-[158px]"
          >
            {post.media_type === 'VIDEO' ? (
              <video
                src={post.media_url}
                controls
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Image
                src={post.media_url}
                alt={post.caption || 'Instagram Post'}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            )}
          </a>
        ))}
      </div>
      <div className="md:hidden flex justify-center mt-8">
        <Link
          href="https://www.instagram.com/hvyt_pl"
          className="px-6 py-3 text-lg font-light border border-black rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all flex items-center space-x-2"
        >
          <span>{t.product.instagramCTA}</span>
          <img
            src="/icons/Instagram.svg"
            alt="Instagram Icon"
            className="h-5 w-5"
          />
        </Link>
      </div>
    </section>
  );
};

export default Instagram;
