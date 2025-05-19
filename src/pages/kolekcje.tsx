import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout.component';
import SkeletonKolekcjePage from '../components/Skeletons/SkeletonKolekcjePage';
import IconRenderer from '@/components/UI/IconRenderer';
import Head from 'next/head';

const KolekcjePage = () => {
  const [kolekcjePosts, setKolekcjePosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchKolekcje = async () => {
      try {
        const res = await fetch(
          '/api/woocommerce?action=fetchKolekcjePostsWithImages',
        );
        if (!res.ok) {
          throw new Error('Failed to fetch Kolekcje posts');
        }
        const kolekcjeWithImages = await res.json();
        console.log('Fetched Kolekcje API Response:', kolekcjeWithImages);
        setKolekcjePosts(kolekcjeWithImages);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message || 'Error loading Kolekcje posts');
        } else {
          setErrorMessage('An unknown error occurred');
        }
        setLoading(false);
      }
    };

    fetchKolekcje();
  }, []);

  return (
    <Layout title="Hvyt | Kolekcje">
      <Head>
        <link
          id="meta-canonical"
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/kolekcje`}
        />
      </Head>
      <section className="w-full px-4 mt-[115px] mb-[150px]">
        <div className="container mx-auto max-w-grid-desktop">
          {/* Page Title and Text Section */}
          <div className="text-left mb-12">
            <h1 className="text-[32px] pt-[24px] md:text-[40px] font-bold text-dark-pastel-red">
              Kolekcje
            </h1>
          </div>
          {/* On mobile, display text in one column; on desktop, two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <p className="text-[18px] font-light text-black">
                <span className="font-bold">Zanurz się</span> w piękno
                minimalistycznych linii, geometrycznych kształtów
                <br className="hidden md:block" /> i eleganckich wykończeń,
                które łatwo dopełnią Twoje wnętrze.
              </p>
              <p className="text-[18px] font-light text-black">
                <span className="font-bold">Poznaj uchwyty</span> wykonane z
                najwyższej jakości materiałów, takich jak litły mosiądz, stal
                nierdzewna i aluminium.
              </p>
            </div>
            <div>
              <p className="text-[18px] font-light text-black">
                Niezależnie od tego, czy wolisz eleganckie i nowoczesne
                projekty, czy eklektyczne i ozdobne style,
              </p>
              <p className="text-[18px] font-light text-black">
                nasze kolekcje oferują różnorodne opcje, które zaspokoją każdy
                gust i estetykę.
              </p>
              <p className="text-dark-pastel-red text-[18px] font-light underline">
                <Link href="#">
                  Zobacz co ostatnio nowego dodaliśmy dla Ciebie.
                </Link>
              </p>
            </div>
          </div>
          {loading ? (
            <SkeletonKolekcjePage />
          ) : (
            <>
              {/* First Row - On mobile one column, on desktop 4 columns with first card spanning 2 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {kolekcjePosts.slice(0, 3).map((kolekcja, index) => (
                  <div
                    key={kolekcja.id}
                    className={`relative transition-all duration-300 ${
                      index === 0 ? 'md:col-span-2' : 'md:col-span-1'
                    }`}
                    style={{ height: '445px' }}
                  >
                    <Link href={`/kolekcje/${kolekcja.slug}`}>
                      <Image
                        src={kolekcja.imageUrl || '/placeholder.jpg'}
                        alt={kolekcja.title.rendered}
                        layout="fill"
                        objectFit="cover"
                        quality={100}
                        className="transition-transform duration-500 rounded-[16px] transform group-hover:scale-105"
                      />
                      {/* Render Icons */}
                      <IconRenderer
                        icons={[
                          kolekcja.acf?.ikonka_1,
                          kolekcja.acf?.ikonka_2,
                          kolekcja.acf?.ikonka_3,
                          kolekcja.acf?.ikonka_4,
                        ]}
                        iconPath="/icons/kolekcja/"
                        iconHeight={24}
                      />
                      <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full font-bold text-dark-pastel-red transition-colors duration-300 group-hover:bg-dark-pastel-red group-hover:text-neutral-white">
                        {kolekcja.title.rendered}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Rest of the Rows - On mobile one column, on desktop 4 columns */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {kolekcjePosts.slice(3).map((kolekcja) => (
                  <div
                    key={kolekcja.id}
                    className="relative transition-all duration-300 col-span-1"
                    style={{ height: '445px' }}
                  >
                    <Link href={`/kolekcje/${kolekcja.slug}`}>
                      <Image
                        src={kolekcja.imageUrl}
                        alt={kolekcja.title.rendered}
                        layout="fill"
                        objectFit="cover"
                        quality={100}
                        className="transition-transform rounded-[16px] duration-500 transform group-hover:scale-105"
                      />
                      {/* Render Icons */}
                      <IconRenderer
                        icons={[
                          kolekcja.acf?.ikonka_1,
                          kolekcja.acf?.ikonka_2,
                          kolekcja.acf?.ikonka_3,
                          kolekcja.acf?.ikonka_4,
                        ]}
                        iconPath="/icons/kolekcja/"
                      />
                      <div className="absolute bottom-4 left-4 px-4 py-2 font-bold text-dark-pastel-red transition-colors duration-300 group-hover:bg-dark-pastel-red group-hover:text-neutral-white">
                        {kolekcja.title.rendered}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default KolekcjePage;
