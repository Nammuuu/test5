

// app/(pages)/blog/[id]/layout.js

export async function generateMetadata({ params }) {
    const { id } = params;
  
    // Fetch blog data for dynamic metadata generation
    let blog;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/userblog/${id}`);
      const data = await res.json();
      blog = data.blog;
    } catch (error) {
      return {
        title: 'Blog not found',
        description: 'The blog you are looking for does not exist.',
      };
    }
  
    return {
      title: blog.title,
      description: blog.content.substring(0, 160), // Truncate content for meta description
      openGraph: {
        title: blog.title,
        description: blog.content.substring(0, 160),
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${id}`,
        images: blog.images.length > 0 ? [{ url: blog.images[0], width: 800, height: 600 }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.content.substring(0, 160),
        images: blog.images.length > 0 ? [blog.images[0]] : [],
      },
    };
  }
  
  export default function BlogDetailsLayout({ children }) {
    return <div>{children}</div>;
  }
  