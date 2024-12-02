export const metadata = {
    title: 'Register - Create Your Account',
    description: 'Sign up to create your account and start exploring our features.',
    keywords: ['register', 'sign up', 'create account', 'user registration'],
    openGraph: {
      title: 'Register - Create Your Account',
      description: 'Sign up to create your account and start exploring our features on our site.',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/register`,
      type: 'website',
    },
};

export default function RegisterLayout({ children }) {
    return (
      <div>
        {children}
      </div>
    );
}
