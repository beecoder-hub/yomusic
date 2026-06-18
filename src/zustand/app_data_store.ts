import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { VideoType, PlaylistType } from '../types';

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

export type globalQueueType = {
  currentIndex: number;
  contents: VideoType[];
};
export type dialogDataType = {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  ok?: {
    okText: string;
    onOk?: () => void;
  };
  cancel?: {
    cancelText: string;
    onCancel?: () => void;
  };
  children?: React.ReactNode;
};

// Define types for state & actions
interface DataState {
  hasHydrated: boolean;
  setHasHydrated: (data: boolean) => void;
  /** VARIABLES: */
  isPlaying: boolean;
  setIsPlaying: (data: boolean) => void;
  isPlayerReady: boolean;
  setIsPlayerReady: (status: boolean) => void;
  isPlayerVisible: boolean;
  setIsPlayerVisible: (visible: boolean) => void;
  progress: number;
  setProgress: (value: number) => void;
  seekFn: (sec: number) => void;
  setSeekFn: (fn: (sec: number) => void) => void;
  isLoop: boolean;
  setIsLoop: (data: boolean) => void;

  // HOME SONGS
  homeSongs: homeSongsType;
  setHomeSongs: (data: homeSongsType) => void;

  // MAIN VAR TO KEEP CURRENT PLAYING DATA
  currentPlayingVideo: VideoType & { isInit?: boolean }; // need to track if user loaded any video
  setcurrentPlayingVideo: (data: VideoType & { isInit?: boolean }) => void;
  //   PLAYLISTS list:
  playlists: PlaylistType[];
  setPlaylists: (data: PlaylistType[]) => void;
  // FAVOURITES list:
  favourites: VideoType[];
  setFavourites: (data: VideoType[]) => void;
  // RECENT SEARCHES
  recentSearches: VideoType[];
  setRecentSearches: (data: VideoType[]) => void;
  // HISTORY list:
  history: VideoType[];
  setHistory: (data: VideoType[]) => void;
  /** GLOBAL QUEUE */
  globalQueue: globalQueueType;
  setGlobalQueue: (data: globalQueueType) => void;

  /*** GLOBAL DIALOGS STATE */
  globalDialogData: dialogDataType;
  setglobalDialogData: (dialogData: dialogDataType) => void;

  /** LAST VISITED PLAYLIST: coz we need to persist scroll location in PlaylistView.tsx */
  playlistData: PlaylistType;
  setplaylistData: (playlistData: PlaylistType) => void;
}

// Create store using the curried form of `create`
export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      setHasHydrated: (status) => set({ hasHydrated: status }),
      isPlaying: false,
      setIsPlaying: (value) => set({ isPlaying: value }),
      homeSongs: { music: [], albums: [] },
      setHomeSongs: (data) => {
        set({ homeSongs: data });
      },
      currentPlayingVideo: {
        videoId: 'M7lc1UVf-VE', //fallback
        title: '',
        channel: '',
        duration: 0,
        videoInfo: '',
      },
      setcurrentPlayingVideo: (data) => {
        set({ currentPlayingVideo: data });
      },
      playlists: [],
      setPlaylists: (data) => set({ playlists: data }),
      favourites: [],
      setFavourites: (data) => set({ favourites: data }),
      //  user recent searches list:
      recentSearches: [],
      setRecentSearches: (data: VideoType[]) => {
        set({ recentSearches: data });
      },
      history: [],
      setHistory: (data) => set({ history: data }),
      globalQueue: {
        currentIndex: 0,
        contents: [],
      },
      setGlobalQueue: (data) => {
        set({ globalQueue: data });
      },
      globalDialogData: {
        isOpen: false,
        title: '',
        subtitle: '',
        onClose: () => {},
        ok: {
          okText: 'Ok',
          onOk: () => {},
        },
        cancel: {
          cancelText: 'Cancel',
          onCancel: () => {},
        },
      },
      setglobalDialogData: (data) => {
        set({ globalDialogData: data });
      },
      playlistData: {
        playlistId: '',
        channel: '',
        title: '',
        isCustomChannel: false,
        thumbnail: '',
        videoItems: { items: [], nextPage: '' },
      },
      setplaylistData: (data) => {
        set({ playlistData: data });
      },

      isPlayerReady: false,
      setIsPlayerReady: (status) => set({ isPlayerReady: status }),
      isPlayerVisible: false,
      setIsPlayerVisible: (status) => set({ isPlayerVisible: status }),
      progress: 0,
      setProgress: (status) => set({ progress: status }),
      seekFn: () => {},
      setSeekFn: (fn) => set({ seekFn: fn }),
      isLoop: false,
      setIsLoop: (value) => set({ isLoop: value }),
    }),
    {
      name: 'my-app-storage',
      partialize: (state) => ({
        // only persist theses
        homeSongs: state.homeSongs,
        playlists: state.playlists,
        recentSearches: state.recentSearches,
        favourites: state.favourites,
        history: state.history,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // signal that hydration is done
      },
    }
  )
);
