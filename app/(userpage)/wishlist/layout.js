


export const metadata = {
    title: 'Wishlist - Save Your Favorite Items',
    description: 'View and manage your wishlist. Save your favorite products for future purchases.',
    keywords: ['wishlist', 'favorite items', 'save products', 'online shopping', 'shopping list'],
    openGraph: {
      title: 'Wishlist - Save Your Favorite Items',
      description: 'Manage your wishlist and save your favorite products for future purchases on our site.',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/wishlist`, // Adjust as needed for your wishlist page URL
      type: 'website',
    },
};

export default function WishlistLayout({ children }) {
    return (
      <div>
        {children}
      </div>
    );
}
