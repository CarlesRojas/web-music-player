import { env } from '@/env.mjs';
import { SpotifyQueryId } from '@/shared/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { axiosSpotifyConfig } from '../axiosSpotifyConfig';
import { useSpotifyLoginData } from '../login/useSpotifyLoginData';
import { PlaybackState } from '../schemas';

export type RepeatMode = 'off' | 'track' | 'context';

const setRepeatModeMutation = async (newRepeatMode: RepeatMode, accessToken?: string) => {
  if (!accessToken) throw new Error('No access token provided');

  return axios({
    ...axiosSpotifyConfig(accessToken),
    url: `${env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL}/me/player/repeat?state=${newRepeatMode}`,
    method: 'put'
  });
};

export const getNextRepeatMode = (currentRepeatMode: RepeatMode): RepeatMode => {
  switch (currentRepeatMode) {
    case 'off':
      return 'context';
    case 'context':
      return 'track';
    case 'track':
      return 'off';
  }
};

export const useSetRepeatMode = () => {
  const queryClient = useQueryClient();
  const { spotifyLoginData } = useSpotifyLoginData();

  const { mutate: setRepeatMode } = useMutation({
    mutationFn: (newRepeatMode: RepeatMode) => setRepeatModeMutation(newRepeatMode, spotifyLoginData?.accessToken),
    onMutate: async (newRepeatMode) => {
      await queryClient.cancelQueries({ queryKey: [SpotifyQueryId.PLAYBACK_STATE] });
      const previous: PlaybackState | undefined = queryClient.getQueryData([SpotifyQueryId.PLAYBACK_STATE]);
      if (!previous) return { previous };

      const newValue: PlaybackState = { ...previous, repeat_state: newRepeatMode };
      queryClient.setQueryData([SpotifyQueryId.PLAYBACK_STATE], newValue);

      return { previous };
    },
    onError: (err, args, context) => {
      context && queryClient.setQueryData([SpotifyQueryId.PLAYBACK_STATE], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [SpotifyQueryId.PLAYBACK_STATE] });
      queryClient.invalidateQueries({ queryKey: [SpotifyQueryId.QUEUE] });
    }
  });

  return { setRepeatMode };
};
