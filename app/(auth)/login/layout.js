




export const metadata = {
    title: 'Login - Access Your Account',
    description: 'Log in to access your account and explore our features.',
    keywords: ['login', 'user access', 'account', 'authentication'],
    openGraph: {
      title: 'Login - Access Your Account',
      description: 'Log in to access your account and explore our features on our site.',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
      type: 'website',
    },
};

  
  export default function LoginLayout({ children }) {
    return (
      <div>
        {children}
      </div>
    );
  }
  