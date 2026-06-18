export interface YoutubeInitData {
  initdata: any;
  apiToken: string | null;
  context: any;
  playerData: any;
}

export type VideoType = {
  videoId: string;
  title: string;
  duration: number; // seconds
  channel: string;
};

export type PlaylistType = {
  playlistId: string;
  thumbnail: string;
  title: string;
  channel: string;
  isCustomChannel: boolean; // always false
  videoItems: {
    items: VideoType[];
    nextPage: string;
  };
  total?: number;
};

export type SearchType = {
  contents: { data: VideoType | PlaylistType; type: 'video' | 'playlist' }[];
  nextPage: string;
};

export type homeSongsType = {
  music?: {
    title: string;
    content: {
      videoId: string;
      title: string;
    }[];
  }[];
  albums?: {
    title: string;
    content: {
      playlistId: string;
      title: string;
      thumbnail: string;
    }[];
  }[];
};
