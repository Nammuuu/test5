


export const metadata = {
    title: 'Shopping Cart - Review Your Items',
    description: 'View and manage the items in your shopping cart before proceeding to checkout.',
    keywords: ['shopping cart', 'review items', 'ecommerce', 'online shopping', 'checkout'],
    openGraph: {
      title: 'Shopping Cart - Review Your Items',
      description: 'View and manage the items in your shopping cart before proceeding to checkout on our site.',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      type: 'website',
    },
};

export default function CartLayout({ children }) {
    return (
      <div>
        {children}
      </div>
    );
}
