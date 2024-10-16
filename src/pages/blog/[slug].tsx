import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout.component'; // Adjust based on your structure

const BlogPostPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <Layout title={slug}>
      <section className="w-full py-16">
        <div className="container mx-auto max-w-grid-desktop">
          <h1 className="font-size-h1 font-bold">Blog Post Title Here</h1>
          <p className="text-neutral-darkest">10min czytania</p>
          <div className="my-8">
            <p className="font-size-text-medium text-neutral-darkest">
              Content of the blog post goes here. Replace this with the actual blog post content.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPostPage;
