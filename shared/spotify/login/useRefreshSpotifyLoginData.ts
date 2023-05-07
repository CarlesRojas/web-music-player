import { env } from '@/env.mjs';
import { LocalStorageKey, Route } from '@/shared/constants';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { SpotifyLoginData, SpotifyLoginDataSchema } from './useGetSpotifyLoginData';

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
    url: `${env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL}/api/token`,
    data: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    }
  });
};

export const useRefreshSpotifyLoginData = () => {
  const { push } = useRouter();
  const {
    mutate: refreshSpotifyLoginDataMutation,
    isError: isErrorRefreshSpotifyToken,
    data
  } = useMutation({
    mutationFn: refreshSpotifyLoginData
  });

  if (data?.data) {
    try {
      const refreshedSpotifyLoginData: SpotifyLoginData = SpotifyLoginDataSchema.parse({
        accessToken: data.data.access_token,
        refreshToken: data.data.refresh_token,
        expireDate: Date.now() + data.data.expires_in * 1000
      });

      localStorage.setItem(LocalStorageKey.SPOTIFY_LOGIN_DATA, JSON.stringify(refreshedSpotifyLoginData));

      return {
        refreshedSpotifyLoginData,
        refreshSpotifyLoginDataMutation,
        isErrorRefreshSpotifyToken
      };
    } catch (error) {
      localStorage.clear();
      push(Route.HOME);
    }
  }

  return {
    refreshedSpotifyLoginData: null,
    refreshSpotifyLoginDataMutation,
    isErrorRefreshSpotifyToken
  };
};
