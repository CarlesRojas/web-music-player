import { useLoginWithSpotify } from '@/shared/spotify/login/useLoginWithSpotify';
import Head from 'next/head';

export default function Home() {
  useLoginWithSpotify();

  return (
    <>
      <Head>
        <title>Spot</title>
        <meta name="description" content="Web based client for listening to Spotify." />
      </Head>
    </>
  );
}
