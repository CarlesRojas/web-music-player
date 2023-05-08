import { env } from '@/env.mjs';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { axiosSpotifyConfig } from '../axiosSpotifyConfig';
import { useSpotifyLoginData } from '../login/useSpotifyLoginData';
import { PlaybackStateSchema } from '../schemas';

const getPlaybackState = async (accessToken?: string) => {
  if (!accessToken) throw new Error('No access token provided');

  const response = await axios({
    ...axiosSpotifyConfig(accessToken),
    url: `${env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL}/me/player`,
    method: 'get'
  });

  return PlaybackStateSchema.parse(response.data);
};

export const usePlaybackState = () => {
  const { spotifyLoginData } = useSpotifyLoginData();

  const {
    data: playbackState,
    isError: isErrorPlaybackState,
    isLoading: isLodingPlaybackState
  } = useQuery(['playbackState'], () => getPlaybackState(spotifyLoginData?.accessToken), {
    enabled: !!spotifyLoginData?.accessToken
  });

  return { playbackState, isErrorPlaybackState, isLodingPlaybackState };
};
