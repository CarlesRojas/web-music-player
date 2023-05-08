import { env } from '@/env.mjs';
import { LocalStorageKey, Route } from '@/shared/constants';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { SpotifyLoginData, SpotifyLoginDataSchema } from '../schemas';

export interface GetSpotifyTokenMutation {
  code?: string;
  state?: string;
  codeVerifier?: string;
}

const getSpotifyLoginData = async ({ code, state, codeVerifier }: GetSpotifyTokenMutation) => {
  if (!code || !state || !codeVerifier) throw new AxiosError('Missing code, state or codeVerifier');

  let data = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
    client_id: env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    code_verifier: codeVerifier
  });

  return axios({
    method: 'post',
    url: `${env.NEXT_PUBLIC_SPOTIFY_ACCOUNT_API_BASE_URL}/api/token`,
    data
  });
};

export const useGetSpotifyLoginData = () => {
  const { push } = useRouter();
  const {
    mutate: getSpotifyLoginDataMutation,
    isError: isErrorGetSpotifyToken,
    data
  } = useMutation({
    mutationFn: getSpotifyLoginData
  });

  if (data?.data) {
    try {
      const spotifyLoginData: SpotifyLoginData = SpotifyLoginDataSchema.parse({
        accessToken: data.data.access_token,
        refreshToken: data.data.refresh_token,
        expireDate: Date.now() + data.data.expires_in * 1000
      });

      localStorage.setItem(LocalStorageKey.SPOTIFY_LOGIN_DATA, JSON.stringify(spotifyLoginData));
      push(Route.HOME);
    } catch (error) {
      localStorage.clear();
      push(Route.HOME);
    }
  }

  return {
    getSpotifyLoginDataMutation,
    isErrorGetSpotifyToken
  };
};
