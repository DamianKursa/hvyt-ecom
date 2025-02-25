export const getPostsArchive = async (page: number = 1) => {
  const response = await fetch(`/api/posts/posts?page=${page}`);
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
};

export const getSinglePost = async (slug: string) => {
  try {
    const url = `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/posts?slug=${encodeURIComponent(
      slug,
    )}&_embed`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch post with slug: ${slug}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      return null;
    }

    // Map the response to a single post object
    const post = {
      id: data[0].id,
      title: data[0].title,
      content: data[0].content,
      slug: data[0].slug,
      date: data[0].date,
      featuredImage:
        data[0]._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      author: {
        name: data[0]._embedded?.author?.[0]?.name || 'Unknown Author',
        avatar: data[0]._embedded?.author?.[0]?.avatar_urls?.['96'] || null,
      },
      categories: data[0]._embedded?.['wp:term']?.[0] || [],
      tags: data[0]._embedded?.['wp:term']?.[1] || [],
    };

    return post;
  } catch (error) {
    console.error('Error in getSinglePost function:', error);
    throw error;
  }
};
