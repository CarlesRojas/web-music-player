import { env } from '@/env.mjs';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';
import { axiosSpotifyConfig } from '../axiosSpotifyConfig';
import { useSpotifyLoginData } from '../login/useSpotifyLoginData';

const UserProfileSchema = z.object({
  name: z.string(),
  email: z.string(),
  image: z.string().optional()
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

const getUserProfile = async (accessToken?: string) => {
  if (!accessToken) throw new Error('No access token provided');

  const response = await axios({
    ...axiosSpotifyConfig(accessToken),
    url: `${env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL}/me`,
    method: 'get'
  });

  return UserProfileSchema.parse({
    name: response.data.display_name,
    email: response.data.email,
    image: response.data.images.length > 0 ? response.data.images[0].url : undefined
  });
};

export const useUserProfile = () => {
  const { spotifyLoginData } = useSpotifyLoginData();

  const {
    data: userProfile,
    isError: isErrorUserProfile,
    isLoading: isLodingUserProfile
  } = useQuery(['userProfile'], () => getUserProfile(spotifyLoginData?.accessToken), {
    enabled: !!spotifyLoginData?.accessToken
  });

  return { userProfile, isErrorUserProfile, isLodingUserProfile };
};
