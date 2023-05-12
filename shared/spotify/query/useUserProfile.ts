import { env } from '@/env.mjs';
import { SpotifyQueryId } from '@/shared/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { axiosSpotifyConfig } from '../axiosSpotifyConfig';
import { useSpotifyLoginData } from '../login/useSpotifyLoginData';
import { UserProfile, UserProfileSchema } from '../schemas';

const getUserProfile = async (accessToken?: string) => {
  if (!accessToken) throw new Error('No access token provided');

  const response = await axios({
    ...axiosSpotifyConfig(accessToken),
    url: `${env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL}/me`,
    method: 'get'
  });

  return UserProfileSchema.parse(response.data) as UserProfile;
};

export const useUserProfile = () => {
  const { spotifyLoginData } = useSpotifyLoginData();

  const {
    data: userProfile,
    isError: isErrorUserProfile,
    isLoading: isLodingUserProfile
  } = useQuery([SpotifyQueryId.USER_PROFILE], () => getUserProfile(spotifyLoginData?.accessToken), {
    enabled: !!spotifyLoginData?.accessToken
  });

  return { userProfile, isErrorUserProfile, isLodingUserProfile };
};
