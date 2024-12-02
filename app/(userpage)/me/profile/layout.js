


export const metadata = {
    title: 'My Profile - Manage Your Account',
    description: 'View and update your account details, preferences, and personal information.',
    keywords: ['my profile', 'account management', 'personal information', 'user settings', 'profile settings'],
    openGraph: {
      title: 'My Profile - Manage Your Account',
      description: 'View and update your account details, preferences, and personal information on our site.',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/my-profile`,
      type: 'website',
    },
};

export default function ProfileLayout({ children }) {
    return (
      <div>
        {children}
      </div>
    );
}
