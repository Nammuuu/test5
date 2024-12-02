// // app/layout.tsx or app/_app.js (depending on your setup)
// import React from 'react';
// import { AuthProvider } from '../components/context/AuthContext';
// import Navbar from '../components/Nav';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Inter } from "next/font/google";
// import ToastProvider from '../components/ToastProvider';

// const inter = Inter({ subsets: ["latin"] });


// export const metadata = {
//   title: '...',
//   description: '...',
// }
// // <title>Friendshelpworld _app</title>
// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
        
//         <meta name="description" content="Friendshelpworld" />
//         <link
//           href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css"
//           rel="stylesheet"
//         />
//       </head>
//       <body className={inter.className}>
//         <AuthProvider>
//           <Navbar />
//           <ToastProvider />
//           <ToastContainer />
//           {children}
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }
