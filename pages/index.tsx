import MobileLayout from '@/components/MobileLayout';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Spot</title>
        <meta name="description" content="Web based client for listening to Spotify." />
      </Head>

      <MobileLayout />
    </>
  );
}
