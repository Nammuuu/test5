


export const metadata = {
    title: 'My Orders - Track Your Purchases',
    description: 'View and track the status of your orders. Check delivery status and order history.',
    keywords: ['my orders', 'order history', 'track orders', 'purchase history', 'order status'],
    openGraph: {
      title: 'My Orders - Track Your Purchases',
      description: 'View and track the status of your orders on our site. Check delivery status and order history.',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/my-orders`,
      type: 'website',
    },
};

export default function OrdersLayout({ children }) {
    return (
      <div>
        {children}
      </div>
    );
}


