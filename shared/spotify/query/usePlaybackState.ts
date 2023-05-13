import { env } from '@/env.mjs';
import { LocalStorageKey, SpotifyQueryId } from '@/shared/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { axiosSpotifyConfig } from '../axiosSpotifyConfig';
import { useSpotifyLoginData } from '../login/useSpotifyLoginData';
import { PlaybackState, PlaybackStateSchema } from '../schemas';

const getPlaybackState = async (accessToken?: string) => {
  if (!accessToken) throw new Error('No access token provided');

  const response = await axios({
    ...axiosSpotifyConfig(accessToken),
    url: `${env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL}/me/player`,
    method: 'get'
  });

  if (typeof response.data !== 'object') return null;
  const playback = PlaybackStateSchema.parse(response.data) as PlaybackState;

  const previousSong = localStorage.getItem(LocalStorageKey.CURRENT_SONG);

  if (previousSong !== playback.item.id) {
    playback.changed = true;
    localStorage.setItem(LocalStorageKey.CURRENT_SONG, playback.item.id);
  }

  return playback;
};

export const usePlaybackState = () => {
  const queryClient = useQueryClient();
  const { spotifyLoginData } = useSpotifyLoginData();

  const {
    data: playbackState,
    isError: isErrorPlaybackState,
    isLoading: isLodingPlaybackState
  } = useQuery([SpotifyQueryId.PLAYBACK_STATE], () => getPlaybackState(spotifyLoginData?.accessToken), {
    enabled: !!spotifyLoginData?.accessToken,
    refetchInterval: 5_000,
    onSettled: (data) => {
      if (data?.changed) queryClient.invalidateQueries({ queryKey: [SpotifyQueryId.QUEUE] });
    }
  });

  return { playbackState, isErrorPlaybackState, isLodingPlaybackState };
};
