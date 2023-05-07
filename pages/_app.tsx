import { AppType } from 'next/app';
import { Montserrat } from 'next/font/google';
import { useEffect } from 'react';

import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'] });

const MyApp: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' && 'serviceWorker' in navigator)
      window.addEventListener('load', () => navigator.serviceWorker.register('/sw.mjs'));
  });

  return (
    <main className={montserrat.className}>
      <Component {...pageProps} />
    </main>
  );
};

export default MyApp;
