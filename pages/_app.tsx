import { AppProps } from 'next/app';
import { Montserrat } from 'next/font/google';
import { useEffect, useState } from 'react';

import { queryConfig } from '@/shared/queryConfig';
import { DehydratedState, Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextComponentType, NextPageContext } from 'next';
import Head from 'next/head';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'] });

export interface PageProps {
  dehydratedState?: DehydratedState;
}

interface MyAppProps extends AppProps {
  Component: NextComponentType<NextPageContext, any, any>;
  pageProps: PageProps;
}

const MyApp = ({ Component, pageProps }: MyAppProps) => {
  const [queryClient] = useState(() => new QueryClient(queryConfig));

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' && 'serviceWorker' in navigator)
      window.addEventListener('load', () => navigator.serviceWorker.register('/sw.mjs'));
  });

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <main id="__main" className={montserrat.className}>
            <Component {...pageProps} />
          </main>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
