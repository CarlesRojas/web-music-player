import { env } from '@/env.mjs';
import { LocalStorageKey, Route } from '@/shared/constants';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { SpotifyLoginData, SpotifyLoginDataSchema } from '../schemas';

export interface RefreshSpotifyTokenMutation {
  refreshToken?: string;
}

const refreshSpotifyLoginData = async ({ refreshToken }: RefreshSpotifyTokenMutation) => {
  if (!refreshToken) throw new AxiosError('Missing refreshToken');

  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(`${env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`).toString('base64')
    },
    url: `${env.NEXT_PUBLIC_SPOTIFY_ACCOUNT_API_BASE_URL}/api/token`,
    data: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    }
  });
};

export const getSpotifyLoginData = async () => {
  const rawLoginData = localStorage.getItem(LocalStorageKey.SPOTIFY_LOGIN_DATA) as string;
  let loginData = SpotifyLoginDataSchema.parse(JSON.parse(rawLoginData));

  if (loginData.expireDate < Date.now()) {
    const response = await refreshSpotifyLoginData({ refreshToken: loginData.refreshToken });
    const refreshedSpotifyLoginData: SpotifyLoginData = SpotifyLoginDataSchema.parse({
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expireDate: Date.now() + response.data.expires_in * 1000
    });
    loginData = refreshedSpotifyLoginData;

    localStorage.setItem(LocalStorageKey.SPOTIFY_LOGIN_DATA, JSON.stringify(loginData));
  }

  return loginData;
};

export const useSpotifyLoginData = () => {
  const { push } = useRouter();

  const {
    data: spotifyLoginData,
    isError: isErrorSpotifyLoginData,
    isLoading: isLodingSpotifyLoginData
  } = useQuery(['spotifyLoginData'], () => getSpotifyLoginData());

  if (isErrorSpotifyLoginData) {
    localStorage.clear();
    push(Route.HOME);
  }

  return { spotifyLoginData, isLodingSpotifyLoginData };
};
