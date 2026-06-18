import { z } from 'zod';

// ==========================================
// 1. Zod Schemas & Inferred Types
// ==========================================

export const VideoSchema = z.object({
  videoId: z.string(),
  title: z.string(),
  duration: z.number(),
  channel: z.string(),
});

export type VideoType = z.infer<typeof VideoSchema>;

export const PlaylistSchema = z.object({
  playlistId: z.string(),
  thumbnail: z.string(),
  title: z.string(),
  channel: z.string(),
  isCustomChannel: z.boolean(),
  videoItems: z.object({
    items: z.array(VideoSchema),
    nextPage: z.string(),
  }),
  total: z.number().optional(),
});

export type PlaylistType = z.infer<typeof PlaylistSchema>;

// ==========================================
// 2. Validation Functions
// ==========================================

/**
 * Validates if the given input matches the VideoSchema.
 */
export function isValidVideo(v: any): boolean {
  return VideoSchema.safeParse(v).success;
}

/**
 * Validates if the given input matches the PlaylistSchema.
 */
export function isValidPlaylist(p: any): boolean {
  return PlaylistSchema.safeParse(p).success;
}

export const VideoArraySchema = z.array(VideoSchema);
export const PlaylistArraySchema = z.array(PlaylistSchema);
// ==========================================
// Array Validation Functions
// ==========================================

/**
 * Validates an array of videos. Returns true if empty.
 */
export function isValidVideoArray(videos: any): boolean {
  return VideoArraySchema.safeParse(videos).success;
}

/**
 * Validates an array of playlists. Returns true if empty.
 */
export function isValidPlaylistArray(playlists: any): boolean {
  return PlaylistArraySchema.safeParse(playlists).success;
}

export type SearchType = {
  contents: { data: VideoType | PlaylistType; type: 'video' | 'playlist' }[];
  nextPage: string;
};

export type Context = {
  client: {
    hl: string;
    gl: string;
    remoteHost: string;
    deviceMake: string;
    deviceModel: string;
    visitorData: string;
    userAgent: string;
    clientName: string;
    clientVersion: string;
    osName: string;
    osVersion: string;
    originalUrl: string;
    platform: string;
    clientFormFactor: string;
    configInfo: {
      appInstallData: string;
    };
    userInterfaceTheme: string;
    browserName: string;
    browserVersion: string;
    acceptHeader: string;
    deviceExperimentId: string;
    rolloutToken: string;
  };
  user: { lockedSafetyMode: boolean };
  request: { useSsl: boolean };
  clickTracking: { clickTrackingParams: string };
};
