import MobileLayout from '@/components/MobileLayout';
import { useSpotifyLoginData } from '@/shared/spotify/login/useSpotifyLoginData';
import { usePlaybackState } from '@/shared/spotify/query/usePlaybackState';
import { usePlayer } from '@/shared/spotify/query/usePlayer';
import { useUserProfile } from '@/shared/spotify/query/useUserProfile';
import Head from 'next/head';

export default function Player() {
  const { spotifyLoginData } = useSpotifyLoginData();
  const { userProfile } = useUserProfile();
  const { player } = usePlayer();
  const { playbackState } = usePlaybackState();

  console.log(playbackState);

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
