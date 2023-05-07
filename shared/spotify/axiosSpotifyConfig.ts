export const axiosSpotifyConfig = (accessToken: string) => {
  return {
    baseURL: process.env.NEXT_PUBLIC_PAYMENT_SERVICE_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  };
};
