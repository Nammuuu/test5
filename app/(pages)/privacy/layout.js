



export const metadata = {
    title: 'Privacy Policy - Your Privacy Matters',
    description: 'Read our Privacy Policy to understand how we handle and protect your personal information.',
    keywords: ['privacy policy', 'data protection', 'personal information', 'privacy', 'terms'],
    openGraph: {
      title: 'Privacy Policy - Your Privacy Matters',
      description: 'Learn about our Privacy Policy and how we handle and protect your personal information on our site.',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`,
      type: 'website',
    },
};

export default function PrivacyPolicyLayout({ children }) {
    return (
      <div>
        {children}
      </div>
    );
}
