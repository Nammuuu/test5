


// export const metadata = {
//     title: 'Place Order - Finalize Your Purchase',
//     description: 'Review your order details and finalize your purchase. Secure payment options available.',
//     keywords: ['place order', 'checkout', 'finalize purchase', 'order summary', 'secure payment'],
//     openGraph: {
//       title: 'Place Order - Finalize Your Purchase',
//       description: 'Review your order details and finalize your purchase on our site. Secure payment options available.',
//       url: `${process.env.NEXT_PUBLIC_BASE_URL}/order`,
//       type: 'website',
//     },
// };

// export default function OrderPlacementLayout({ children }) {
//     return (
//       <div>
//         {children}
//       </div>
//     );
// }


import React, { Suspense } from 'react';

export const metadata = {
  title: 'Place Order - Finalize Your Purchase',
  description: 'Review your order details and finalize your purchase. Secure payment options available.',
  keywords: ['place order', 'checkout', 'finalize purchase', 'order summary', 'secure payment'],
  openGraph: {
    title: 'Place Order - Finalize Your Purchase',
    description: 'Review your order details and finalize your purchase on our site. Secure payment options available.',
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/order`,
    type: 'website',
  },
};

export default function OrderPlacementLayout({ children }) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
    </div>
  );
}
