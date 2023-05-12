import { env } from '@/env.mjs';
import { SpotifyQueryId } from '@/shared/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { axiosSpotifyConfig } from '../axiosSpotifyConfig';
import { useSpotifyLoginData } from '../login/useSpotifyLoginData';

const skipToPreviousMutation = async (accessToken?: string) => {
  if (!accessToken) throw new Error('No access token provided');

  return axios({
    ...axiosSpotifyConfig(accessToken),
    url: `${env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL}/me/player/previous`,
    method: 'post'
  });
};

export const useSkipToPrevious = () => {
  const queryClient = useQueryClient();
  const { spotifyLoginData } = useSpotifyLoginData();

  const { mutate: skipToPrevious } = useMutation({
    mutationFn: () => skipToPreviousMutation(spotifyLoginData?.accessToken),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [SpotifyQueryId.QUEUE] })
  });

  return { skipToPrevious };
};
