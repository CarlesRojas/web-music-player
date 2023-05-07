import { env } from '@/env.mjs';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';
import { axiosSpotifyConfig } from '../axiosSpotifyConfig';
import { getSpotifyLoginData } from '../login/useSpotifyLoginData';

const UserProfileSchema = z.object({
  name: z.string(),
  email: z.string(),
  image: z.string().optional()
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

const getUserProfile = async () => {
  const loginData = await getSpotifyLoginData();
  const response = await axios({
    ...axiosSpotifyConfig(loginData.accessToken),
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
  const {
    data: userProfile,
    isError: isErrorUserProfile,
    isLoading: isLodingUserProfile
  } = useQuery(['userProfile'], () => getUserProfile());

  return { userProfile, isErrorUserProfile, isLodingUserProfile };
};
