import AlbumEmpty from '@/shared/resources/AlbumEmpty.svg';
import ArtistEmpty from '@/shared/resources/ArtistEmpty.svg';
import PlaylistEmpty from '@/shared/resources/PlaylistEmpty.svg';
import { Image } from '@/shared/spotify/schemas';

export const APP_NAME = 'Spot';

export enum LocalStorageKey {
  SPOTIFY_CODE_VERIFIER = `${APP_NAME}_spotify_code_verifier`,
  SPOTIFY_LOGIN_DATA = `${APP_NAME}_spotify_login_data`,
  CURRENT_SONG = `${APP_NAME}_current_song`
}

export enum Route {
  HOME = '/',
  PLAYER = '/player',
  LOGIN = '/login'
}

export enum SpotifyQueryId {
  QUEUE = 'QUEUE',
  PLAYBACK_STATE = 'PLAYBACK_STATE',
  PLAYER = 'PLAYER',
  USER_PROFILE = 'USER_PROFILE',
  CURRENT_SONG = 'CURRENT_SONG'
}

export const EmptyImage: Record<string, Image> = {
  ALBUM: { height: null, url: AlbumEmpty, width: null, missing: true },
  ARTIST: { height: null, url: ArtistEmpty, width: null, missing: true },
  PLAYLIST: { height: null, url: PlaylistEmpty, width: null, missing: true }
};
