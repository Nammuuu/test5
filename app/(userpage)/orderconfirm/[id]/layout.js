


export const metadata = {
    title: 'Order Details - Review Your Purchase',
    description: 'View the details and status of your order, including items purchased, shipping, and payment information.',
    keywords: ['order details', 'purchase history', 'order status', 'shipping information', 'order summary'],
    openGraph: {
      title: 'Order Details - Review Your Purchase',
      description: 'View the details and status of your order, including items purchased, shipping, and payment information on our site.',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/[id]`,
      type: 'website',
    },
};

export default function OrderDetailsLayout({ children }) {
    return (
      <div>
        {children}
      </div>
    );
}