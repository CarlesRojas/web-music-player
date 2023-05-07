import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_SPOTIFY_REDIRECT_URI: z.string().min(1),
    NEXT_PUBLIC_SPOTIFY_API_BASE_URL: z.string().min(1),
    NEXT_PUBLIC_SPOTIFY_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET: z.string().min(1)
  },
  runtimeEnv: {
    NEXT_PUBLIC_SPOTIFY_REDIRECT_URI: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
    NEXT_PUBLIC_SPOTIFY_API_BASE_URL: process.env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL,
    NEXT_PUBLIC_SPOTIFY_CLIENT_ID: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET
  }
});
