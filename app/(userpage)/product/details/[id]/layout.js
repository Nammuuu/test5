


export const metadata = {
    title: 'Product Details - Discover Your Next Purchase',
    description: 'View detailed information about this product, including features, specifications, and customer reviews.',
    keywords: ['product details', 'buy now', 'product specifications', 'customer reviews', 'online shopping'],
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/details/[id]`,
   
};

export default function ProductDetailsLayout({ children }) {
    return (
      <div>
        {children}
      </div>
    );
}
