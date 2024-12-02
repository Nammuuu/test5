


export const metadata = {
    title: 'User Profile - Manage Your Account',
    description: 'View and update your account details, preferences, and personal information.',
    keywords: ['user profile', 'account management', 'personal information', 'user settings', 'profile settings'],
    openGraph: {
      title: 'User Profile - Manage Your Account',
      description: 'View and update your account details, preferences, and personal information on our site.',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile/[id]`,
      type: 'website',
    },
};

export default function UserProfileLayout({ children }) {
    return (
      <div>
        {children}
      </div>
    );
}
