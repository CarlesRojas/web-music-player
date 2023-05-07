import MobileLayout from '@/components/MobileLayout';
import { useSpotifyLoginData } from '@/shared/spotify/login/useSpotifyLoginData';
import { useUserProfile } from '@/shared/spotify/query/useUserProfile';
import Head from 'next/head';

export default function Player() {
  useSpotifyLoginData();

  const { userProfile } = useUserProfile();

  console.log(userProfile);

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
