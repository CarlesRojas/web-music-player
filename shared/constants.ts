export const APP_NAME = 'Spot';

export enum LocalStorageKey {
  SPOTIFY_CODE_VERIFIER = `${APP_NAME}_spotify_code_verifier`,
  SPOTIFY_LOGIN_DATA = `${APP_NAME}_spotify_login_data`
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
  USER_PROFILE = 'USER_PROFILE'
}
