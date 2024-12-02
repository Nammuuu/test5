



export const metadata = {
    title: 'User Dashboard - Manage Your Account',
    description: 'Access your dashboard to manage account settings, view orders, and update your profile.',
    keywords: ['user dashboard', 'account management', 'view orders', 'profile settings', 'user account'],
    openGraph: {
      title: 'User Dashboard - Manage Your Account',
      description: 'Access your dashboard to manage account settings, view orders, and update your profile on our site.',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/dashboard/[id]`, // Replace [id] with the actual user ID dynamically
      type: 'website',
    },
};

export default function UserDashboardLayout({ children }) {
    return (
      <div>
        {children}
      </div>
    );
}
