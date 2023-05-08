import { z } from 'zod';

export const SpotifyLoginDataSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expireDate: z.number()
});
export type SpotifyLoginData = z.infer<typeof SpotifyLoginDataSchema>;

export const Image = z.object({
  height: z.number().int().nullable(),
  url: z.string().url(),
  width: z.number().int().nullable()
});
export type Image = z.infer<typeof Image>;

export const UserProfileSchema = z.object({
  id: z.string(),
  display_name: z.string(),
  email: z.string().email(),
  images: z.array(Image)
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const DeviceSchema = z.object({
  id: z.string(),
  is_active: z.boolean(),
  name: z.string(),
  volume_percent: z.number().int().min(0).max(100).nullable()
});
export type Device = z.infer<typeof DeviceSchema>;

export const EpisodeSchema = z.object({
  duration_ms: z.number().int(),
  id: z.string(),
  images: z.array(Image),
  name: z.string()
});
export type Episode = z.infer<typeof EpisodeSchema>;

export const ArtistSchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z.array(Image).optional(),
  genres: z.array(z.string()).optional()
});
export type Artist = z.infer<typeof ArtistSchema>;

export const AlbumSchema = z.object({
  total_tracks: z.number().int(),
  id: z.string(),
  images: z.array(Image),
  name: z.string(),
  genres: z.array(z.string()).optional(),
  artists: z.array(ArtistSchema)
});
export type Album = z.infer<typeof AlbumSchema>;

export const TrackSchema = z.object({
  album: AlbumSchema,
  artists: z.array(ArtistSchema),
  duration_ms: z.number(),
  id: z.string(),
  name: z.string(),
  disc_number: z.number().int().positive(),
  track_number: z.number().int().positive()
});
export type Track = z.infer<typeof TrackSchema>;

export const PlaybackStateSchema = z.object({
  device: DeviceSchema,
  repeat_state: z.enum(['off', 'track', 'context']),
  shuffle_state: z.boolean(),
  timestamp: z.number().int(),
  progress_ms: z.number().int().nullable(),
  is_playing: z.boolean(),
  currently_playing_type: z.enum(['track', 'episode', 'ad', 'unknown']),
  item: TrackSchema,
  context: z.object({ uri: z.string() }).optional()
});
export type PlaybackState = z.infer<typeof PlaybackStateSchema>;
