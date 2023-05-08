import { env } from '@/env.mjs';
import { LocalStorageKey, Route } from '@/shared/constants';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const generateRandomString = (length = 128) =>
  [...Array(length)].map(() => CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))).join('');

const base64encode = (buffer: ArrayBuffer) =>
  Buffer.from(buffer).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const generateCodeChallenge = async (codeVerifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);

  return base64encode(digest);
};

const loginWithSpotify = async () => {
  const codeVerifier = generateRandomString();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  localStorage.setItem(LocalStorageKey.SPOTIFY_CODE_VERIFIER, codeVerifier);

  let args = new URLSearchParams({
    response_type: 'code',
    client_id: env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    scope: 'streaming user-read-private user-read-email user-read-playback-state',
    redirect_uri: env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
    state: generateRandomString(16),
    code_challenge_method: 'S256',
    code_challenge: codeChallenge
  });

  (window as Window).location = `${env.NEXT_PUBLIC_SPOTIFY_ACCOUNT_API_BASE_URL}/authorize?${args}`;
};

export const useLoginWithSpotify = () => {
  const { push } = useRouter();

  useEffect(() => {
    const rawLoginData = localStorage.getItem(LocalStorageKey.SPOTIFY_LOGIN_DATA);
    if (!rawLoginData) loginWithSpotify();
    else push(Route.PLAYER);
  }, [push]);
};
