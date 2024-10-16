import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout.component'; // Adjust based on your project structure

const BlogPostPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  // Ensure `slug` is a string or provide a fallback value like "Blog"
  const slugString = Array.isArray(slug) ? slug[0] : slug || 'Blog';

  return (
    <Layout title={slugString}>
      <section className="w-full py-16">
        <div className="container mx-auto max-w-grid-desktop">
          <h1 className="font-size-h1 font-bold">Blog Post Title Here</h1>
          <p className="font-size-text-medium text-neutral-darkest">
            Blog post content goes here. Replace this text with the actual blog post content fetched from your API or database.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPostPage;
