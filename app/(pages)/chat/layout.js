


export const metadata = {
    title: 'Live Chat - Connect with Us',
    description: 'Start a live chat to get instant support and answers to your questions.',
    keywords: ['live chat', 'customer support', 'instant messaging', 'help', 'support'],
    openGraph: {
      title: 'Live Chat - Connect with Us',
      description: 'Start a live chat to get instant support and answers to your questions on our site.',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/live-chat`,
      type: 'website',
    },
};

export default function LiveChatLayout({ children }) {
    return (
      <div>
        {children}
      </div>
    );
}
