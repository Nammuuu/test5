


export const metadata = {
    title: 'Product Search - Find What You Need',
    description: 'Search through our extensive catalog to find the products you are looking for. Filter by categories, price, and more.',
    keywords: ['product search', 'find products', 'online shopping', 'search bar', 'catalog'],
    openGraph: {
      title: 'Product Search - Find What You Need',
      description: 'Search through our extensive catalog to find the products you need on our site.',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/search`, // Adjust as needed for your search page URL
      type: 'website',
    },
};

export default function ProductSearchLayout({ children }) {
    return (
      <div>
        {children}
      </div>
    );
}
