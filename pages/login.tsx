import Loading from '@/components/Loading';
import { LocalStorageKey, Route } from '@/shared/constants';
import { useGetSpotifyTokens } from '@/shared/spotify/login/useGetSpotifyTokens';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Login() {
  const { query, push, isReady } = useRouter();

  const { getSpotifyTokenMutation, isErrorGetSpotifyToken } = useGetSpotifyTokens();

  useEffect(() => {
    if (localStorage.getItem(LocalStorageKey.SPOTIFY_LOGIN_DATA)) {
      push(Route.HOME);
      return;
    }
    if (!isReady) return;

    const codeVerifier = localStorage.getItem(LocalStorageKey.SPOTIFY_CODE_VERIFIER) ?? undefined;
    const code = typeof query.code == 'object' ? query.code[0] : query.code;
    const state = typeof query.state == 'object' ? query.state[0] : query.state;

    getSpotifyTokenMutation({ code, state, codeVerifier });
  }, [getSpotifyTokenMutation, isReady, push, query.code, query.state]);

  useEffect(() => {
    if (!isErrorGetSpotifyToken) return;
    localStorage.clear();
    push(Route.HOME);
  }, [isErrorGetSpotifyToken, push]);

  return (
    <>
      <Head>
        <title>Spot</title>
        <meta name="description" content="Web based client for listening to Spotify." />
      </Head>

      <main className="w-full h-full flex">
        <Loading />
      </main>
    </>
  );
}
