import { LocalStorageKey, Route } from '@/shared/constants';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SpotifyLoginData, SpotifyLoginDataSchema } from './useGetSpotifyLoginData';
import { useRefreshSpotifyLoginData } from './useRefreshSpotifyLoginData';

export const useSpotifyLoginData = () => {
  const { push } = useRouter();
  const [spotifyLoginData, setSpotifyLoginData] = useState<SpotifyLoginData | null>(null);

  const { refreshedSpotifyLoginData, refreshSpotifyLoginDataMutation, isErrorRefreshSpotifyToken } =
    useRefreshSpotifyLoginData();

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

  useEffect(() => {
    if (!spotifyLoginData) return;

    if (spotifyLoginData.expireDate < Date.now())
      refreshSpotifyLoginDataMutation({ refreshToken: spotifyLoginData.refreshToken });
  }, [refreshSpotifyLoginDataMutation, spotifyLoginData]);

  useEffect(() => {
    if (!refreshedSpotifyLoginData) return;

    setSpotifyLoginData(refreshedSpotifyLoginData);
  }, [refreshedSpotifyLoginData]);

  useEffect(() => {
    if (!isErrorRefreshSpotifyToken) return;
    localStorage.clear();
    push(Route.HOME);
  }, [isErrorRefreshSpotifyToken, push]);

  return spotifyLoginData;
};
