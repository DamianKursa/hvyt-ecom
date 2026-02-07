import { useState, useEffect } from 'react';
import { PostArchive } from '@/utils/functions/interfaces';
import { getPostsArchive } from '@/utils/api/getPosts';
import Layout from '@/components/Layout/Layout.component';
import NaszeKolekcje from '@/components/Index/NaszeKolekcje';
import Head from 'next/head';
import { useI18n } from '@/utils/hooks/useI18n';

const trimToWords = (text: string, wordLimit: number): string => {
  const words = text.split(' ');
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(' ') + '...'
    : text;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const BlogArchive = () => {
  const {t} = useI18n();
  const [posts, setPosts] = useState<PostArchive[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getPostsArchive(1);
        setPosts(
          data.posts.map((post: any) => ({
            ...post,
            featuredImage:
              post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
              '/placeholder.jpg',
          })),
        );
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const loadMorePosts = async () => {
    if (page >= totalPages) return;
    setLoadingMore(true);
    try {
      const data = await getPostsArchive(page + 1);
      setPosts((prevPosts) => [
        ...prevPosts,
        ...data.posts.map((post: any) => ({
          ...post,
          featuredImage:
            post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
            '/placeholder.jpg',
        })),
      ]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <Layout title="Hvyt | Blog">
      <Head>
        <link
          id="meta-canonical"
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/blog`}
        />
      </Head>
      <div>
        {/* Header */}
        <header className="pt-[115px] mx-auto container max-w-grid-desktop px-4 md:px-0 py-6">
          <h1 className="text-[40px] md:text-[56px] font-bold text-black">
            Aktualności ze świata wnętrz
          </h1>
          <p className="text-black text-[18px] font-light mt-2">
            Śledź naszego bloga i odkrywaj najnowsze trendy.
          </p>
        </header>

        {/* Posts Section */}
        <section className="container mx-auto max-w-grid-desktop px-4 md:px-0 py-6">
          {posts.length === 0 && (
            <div className="text-center py-16">
              <h2 className="text-xl font-bold text-gray-700">
                Brak artykułów
              </h2>
            </div>
          )}

          {/* First Post */}
          {posts.length > 0 && (
            <article className="flex flex-col md:flex-row overflow-hidden pb-12">
              <img
                src={posts[0].featuredImage}
                alt={posts[0].title?.rendered || 'Blog post image'}
                className="md:w-1/2 h-[185px] md:h-[375px] object-cover rounded-[16px]"
              />
              <div className="px-0 py-4 md:py-0 md:p-6 md:w-1/2 flex flex-col justify-center">
                <p className="text-[16px] font-light text-black mb-2">
                  {formatDate(posts[0].date)}
                </p>
                <h2
                  className="text-[24px] font-bold text-black mb-4"
                  dangerouslySetInnerHTML={{
                    __html: posts[0].title?.rendered || '',
                  }}
                />
                <p
                  className="text-black font-light text-[16px] mb-6"
                  dangerouslySetInnerHTML={{
                    __html: trimToWords(posts[0].excerpt?.rendered || '', 35),
                  }}
                />
                <a
                  href={`/blog/${posts[0].slug}`}
                  className="text-[16px] text-black font-light underline flex items-center gap-2"
                >
                  Czytaj dalej{' '}
                  <img
                    src="/icons/dalej.svg"
                    alt="Dalej icon"
                    className="w-4 h-4"
                  />
                </a>
              </div>
            </article>
          )}

          {/* Remaining Posts */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2  pt-12 gap-y-8 gap-x-6">
            {posts.slice(1).map((post) => (
              <article key={post.id} className="overflow-hidden text-black">
                <img
                  src={post.featuredImage}
                  alt={post.title?.rendered || 'Blog post image'}
                  className="w-full h-[185px] md:h-[245px] rounded-[16px] object-cover"
                />
                <div className="px-0 py-4 md:py-0">
                  <p className="mt-3 text-[16px] font-light">
                    {formatDate(post.date)}
                  </p>
                  <h2
                    className="text-[20px] font-bold mt-3"
                    dangerouslySetInnerHTML={{
                      __html: post.title?.rendered || '',
                    }}
                  />
                  <p
                    className="mt-4 font-light text-[16px]"
                    dangerouslySetInnerHTML={{
                      __html: trimToWords(post.excerpt?.rendered || '', 15),
                    }}
                  />
                  <a
                    href={`/blog/${post.slug}`}
                    className="text-[16px] font-light underline flex items-center gap-2 mt-4"
                  >
                    Czytaj dalej{' '}
                    <img
                      src="/icons/dalej.svg"
                      alt="Dalej icon"
                      className="w-4 h-4"
                    />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center items-center mt-8">
            {page < totalPages && (
              <button
                onClick={loadMorePosts}
                className="px-6 py-3 bg-black text-white text-[16px] font-medium rounded-full hover:bg-gray-800 transition"
                disabled={loadingMore}
              >
                {loadingMore ? t.modal.loading : t.common.showMore}
              </button>
            )}
          </div>
        </section>

        <section className="py-16 bg-beige w-full">
          <div className="container mx-auto max-w-grid-desktop">
            <NaszeKolekcje />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default BlogArchive;
