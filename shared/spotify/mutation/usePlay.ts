import { env } from '@/env.mjs';
import { SpotifyQueryId } from '@/shared/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { axiosSpotifyConfig } from '../axiosSpotifyConfig';
import { useSpotifyLoginData } from '../login/useSpotifyLoginData';
import { PlaybackState } from '../schemas';

const playMutation = async (accessToken?: string) => {
  if (!accessToken) throw new Error('No access token provided');

  return axios({
    ...axiosSpotifyConfig(accessToken),
    url: `${env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL}/me/player/play`,
    method: 'put'
  });
};

export const usePlay = () => {
  const queryClient = useQueryClient();
  const { spotifyLoginData } = useSpotifyLoginData();

  const { mutate: play } = useMutation({
    mutationFn: () => playMutation(spotifyLoginData?.accessToken),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [SpotifyQueryId.PLAYBACK_STATE] });
      const previous: PlaybackState | undefined = queryClient.getQueryData([SpotifyQueryId.PLAYBACK_STATE]);
      if (!previous) return { previous };

      const newValue: PlaybackState = { ...previous, is_playing: true };
      queryClient.setQueryData([SpotifyQueryId.PLAYBACK_STATE], newValue);

      return { previous };
    },
    onError: (err, args, context) => {
      context && queryClient.setQueryData([SpotifyQueryId.PLAYBACK_STATE], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [SpotifyQueryId.PLAYBACK_STATE] });
    }
  });

  return { play };
};
