import { GetServerSideProps } from 'next';
import { getSinglePost } from '@/utils/api/getPosts';
import Layout from '@/components/Layout/Layout.component';

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
        <div className="border-b border-neutral-300 mb-8"></div>

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
        <div className="mx-auto max-w-[899px] text-left">
          <div
            className="text-[18px] font-light text-black leading-7 mb-8"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {/* Author Section */}
          <div className="flex items-center mb-8">
            {post.author.avatar && (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full mr-4"
              />
            )}
            <p className="text-[18px] font-bold">{post.author.name}</p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {post.categories.map((category, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
              >
                {category.name}
              </span>
            ))}
          </div>

          {/* Social Media Links */}
          <div className="flex items-center gap-4 text-[16px]">
            <a href="#" className="text-neutral-800">
              <img src="/icons/facebook.svg" alt="Share on Facebook" />
            </a>
            <a href="#" className="text-neutral-800">
              <img src="/icons/twitter.svg" alt="Share on Twitter" />
            </a>
            <a href="#" className="text-neutral-800">
              <img src="/icons/share.svg" alt="Share on other platforms" />
            </a>
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
