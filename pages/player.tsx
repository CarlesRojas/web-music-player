import MobileLayout from '@/components/MobileLayout';
import { useSpotifyLoginData } from '@/shared/spotify/login/useSpotifyLoginData';
import { usePlayer } from '@/shared/spotify/query/usePlayer';
import { useUserProfile } from '@/shared/spotify/query/useUserProfile';
import { useQueryClient } from '@tanstack/react-query';
import Head from 'next/head';

export default function Player() {
  const { spotifyLoginData } = useSpotifyLoginData();
  const { userProfile } = useUserProfile();
  const { player } = usePlayer();
  const queryClient = useQueryClient();

  return (
    <>
      <Head>
        <title>Spot</title>
        <meta name="description" content="Web based client for listening to Spotify." />
      </Head>

      {/* <button
        type="button"
        onClick={async () => {
          queryClient.invalidateQueries(['usePlayer']);
        }}
      >
        Play
      </button> */}

      <MobileLayout />
    </>
  );
}
