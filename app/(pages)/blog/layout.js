

// app/(pages)/blog/layout.js

export const metadata = {
    title: 'Blog - Recent Posts',
    description: 'Explore the recent blog posts.',
    keywords: ['blogs', 'recent posts', 'articles'],
    openGraph: {
      title: 'Blog - Recent Posts',
      description: 'Explore the recent blog posts on our site.',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
      type: 'website',
    },
  };
  
  export default function BlogLayout({ children }) {
    return (
      <div>
        {children}
      </div>
    );
  }
  