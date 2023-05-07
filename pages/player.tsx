import MobileLayout from '@/components/MobileLayout';
import { useSpotifyLoginData } from '@/shared/spotify/login/useSpotifyLoginData';
import { useUserProfile } from '@/shared/spotify/query/useUserProfile';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import SpotifyPlayer from 'spotify-web-playback';

export default function Player() {
  const { spotifyLoginData } = useSpotifyLoginData();
  const { userProfile } = useUserProfile();

  console.log(userProfile);

  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);

  useEffect(() => {
    if (!spotifyLoginData) return;

    const loadSpotifyPlayer = async () => {
      const spotify = new SpotifyPlayer('Spot', 0.5);
      // await spotify.connect(spotifyLoginData.accessToken);
      setPlayer(spotify);
    };

    loadSpotifyPlayer();
  }, [spotifyLoginData]);

  return (
    <>
      <Head>
        <title>Spot</title>
        <meta name="description" content="Web based client for listening to Spotify." />
      </Head>

      <button
        type="button"
        onClick={async () => {
          spotifyLoginData && (await player?.connect(spotifyLoginData.accessToken));
        }}
      >
        Play
      </button>

      <MobileLayout />
    </>
  );
}
