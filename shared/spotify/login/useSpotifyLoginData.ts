import { LocalStorageKey, Route } from '@/shared/constants';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SpotifyLoginData, SpotifyLoginDataSchema } from './useGetSpotifyTokens';

export const useSpotifyLoginData = () => {
  const { push } = useRouter();
  const [spotifyLoginData, setSpotifyLoginData] = useState<SpotifyLoginData | null>(null);

  useEffect(() => {
    try {
      const rawLoginData = localStorage.getItem(LocalStorageKey.SPOTIFY_LOGIN_DATA) as string;
      const loginData = SpotifyLoginDataSchema.parse(JSON.parse(rawLoginData));
      setSpotifyLoginData(loginData);
    } catch (error) {
      localStorage.clear();
      push(Route.HOME);
    }
  }, [push]);

  return spotifyLoginData;
};
