import { env } from '@/env.mjs';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { axiosSpotifyConfig } from '../axiosSpotifyConfig';
import { useSpotifyLoginData } from '../login/useSpotifyLoginData';
import { QueueSchema } from '../schemas';

const getQueue = async (accessToken?: string) => {
  if (!accessToken) throw new Error('No access token provided');

  const response = await axios({
    ...axiosSpotifyConfig(accessToken),
    url: `${env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL}/me/player/queue`,
    method: 'get'
  });

  return QueueSchema.parse(response.data);
};

export const useQueue = () => {
  const { spotifyLoginData } = useSpotifyLoginData();

  const {
    data: queue,
    isError: isErrorQueue,
    isLoading: isLodingQueue
  } = useQuery(['queue'], () => getQueue(spotifyLoginData?.accessToken), {
    enabled: !!spotifyLoginData?.accessToken
  });

  return { queue, isErrorQueue, isLodingQueue };
};
