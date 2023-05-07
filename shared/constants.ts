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
