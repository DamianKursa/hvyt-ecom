import { GetServerSideProps } from 'next';
import { getSinglePost } from '@/utils/api/getPosts';
import Layout from '@/components/Layout/Layout.component';
import Image from 'next/image';

// Define the BlogPost interface
interface BlogPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  slug: string;
  date: string;
  featuredImage: string | null;
  author: {
    name: string;
    avatar: string | null;
  };
  categories: { name: string }[];
  tags: { name: string }[];
}

// Define props for the page component
interface BlogPostPageProps {
  post: BlogPost | null;
}

const BlogPostPage = ({ post }: BlogPostPageProps) => {
  if (!post) {
    return (
      <Layout title="Post Not Found">
        <div className="container mx-auto py-16">
          <h1 className="text-[56px] font-bold text-black">Post Not Found</h1>
          <p className="text-[18px] font-light text-black">
            The post you are looking for does not exist or has been removed.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={post.title.rendered}>
      <div className="container mx-auto py-16 max-w-[1130px]">
        {/* Title */}
        <h1
          className="text-[56px] font-bold text-black mb-6"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {/* Divider */}
        <div className="border-b border-beige-dark mb-8"></div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="w-full mb-8">
            <img
              src={post.featuredImage}
              alt={post.title.rendered}
              className="w-full h-[635px] object-cover rounded-lg"
            />
          </div>
        )}

        {/* Content Box */}
        <div className="mx-auto max-w-[899px] blog-content text-left">
          <div
            className="text-[18px] font-light text-black leading-7 mb-8"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {/* Author Section */}
          <div className="flex items-center mb-8">
            {post.author.avatar && (
              <img
                src="/images/autor.png"
                alt="Hvyt"
                className="w-12 h-12 rounded-full mr-4"
              />
            )}
            <h4 className="text-[18px] font-bold">Hvyt</h4>
          </div>

          {/* Divider */}
          <div className="border-b border-beige-dark my-8"></div>

          {/* Share Section */}
          <div className="flex justify-between text-black items-center">
            {/* Share Text */}
            <div className="flex items-center">
              <h4 className="text-[18px] font-bold">Udostępnij ten artykuł</h4>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <a href="#">
                <Image
                  src="/icons/Pinterest.svg"
                  alt="Udostępnij na Pinterest"
                  width={20}
                  height={20}
                />
              </a>
              <a href="#">
                <Image
                  src="/icons/facebook.svg"
                  alt="Udostępnij na Facebook"
                  width={20}
                  height={20}
                />
              </a>
              <a href="#">
                <Image
                  src="/icons/instagram.svg"
                  alt="Udostępnij na Instagram"
                  width={20}
                  height={20}
                />
              </a>
              <a href="#">
                <Image
                  src="/icons/x.svg"
                  alt="Udostępnij na X"
                  width={20}
                  height={20}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPostPage;

// Use the `getSinglePost` function in the API call
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params || {};

  console.log('Received slug:', slug);

  if (!slug) {
    return {
      notFound: true,
    };
  }

  try {
    const post = await getSinglePost(slug as string);
    console.log('Fetched post data for slug:', slug, post);

    if (!post) {
      return {
        notFound: true,
      };
    }

    return {
      props: { post },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return { props: { post: null } };
  }
};
