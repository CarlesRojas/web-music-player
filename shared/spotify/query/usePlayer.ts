import { SpotifyQueryId } from '@/shared/constants';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import SpotifyPlayer from 'spotify-web-playback';
import { useSpotifyLoginData } from '../login/useSpotifyLoginData';

const getPlayer = async (accessToken?: string) => {
  if (!accessToken) throw new Error('No access token provided');

  const player = new SpotifyPlayer('Spot', 0.5);

  try {
    await player.connect(accessToken);
  } catch (error) {
    throw new Error('Could not connect to Spotify');
  }

  return player;
};

export const usePlayer = () => {
  const { spotifyLoginData } = useSpotifyLoginData();

  const [interacted, setInteracted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      const audio = new Audio('/audio.mp3');

      try {
        await audio.play();
        setInteracted(true);
        clearInterval(intervalRef.current);
      } catch (error) {}
    }, 500);

    return () => {
      clearInterval(intervalRef.current!);
    };
  }, []);

  const {
    data: player,
    isError: isErrorPlayer,
    isLoading: isLodingPlayer
  } = useQuery([SpotifyQueryId.PLAYER], () => getPlayer(spotifyLoginData?.accessToken), {
    enabled: !!spotifyLoginData?.accessToken && interacted
  });

  return { player, isErrorPlayer, isLodingPlayer };
};
