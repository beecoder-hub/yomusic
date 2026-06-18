/** strip down code from https://github.com/damonwonghv/youtube-search-api */

import { parsePlaylistVideos } from './parsers/playlistVideosParser';
import { parseSearchResults } from './parsers/searchParser';
import { parseMusicData } from './parsers/musicDataParser';
import { parseAutoComplete } from './parsers/autoCompleteParser';
import type {
  homeSongsType,
  PlaylistType,
  SearchType,
  VideoType,
  YoutubeInitData,
} from './types_api';
// import { nextParams } from './utils';
import { parsePlaylistVideosNext } from './parsers/playlistVideosNextParser';
import { parseSearchResultsNext } from './parsers/searchNextParser';

type getPlaylistVideosProps = { playlist: PlaylistType; context: any; apiToken: string };
type searchProps = { search: SearchType; context: any; apiToken: string };

class YtApi {
  private async getYoutubeInitData(url: string): Promise<YoutubeInitData | false> {
    let initdata: any = {};
    let apiToken: string | null = null;
    let context: any = null;
    let playerData: any = null;
    const location = localStorage.getItem('country') || 'IN';
    const u = new URL(url);
    u.searchParams.set('gl', location);
    u.searchParams.set('app', 'desktop');
    try {
      const page = await fetch(encodeURI(u.toString()), {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': 'Windows',
          Origin: 'https://www.youtube.com',
          Referer: 'https://www.youtube.com',
        },
      }).then((res) => res.text());
      const ytInitData = page.split('var ytInitialData =');
      if (ytInitData && ytInitData.length > 1) {
        const data = ytInitData[1].split('</script>')[0].slice(0, -1);

        if (page.split('innertubeApiKey').length > 1) {
          const apiKeyPart = page.split('innertubeApiKey')[1];
          if (apiKeyPart) {
            apiToken = apiKeyPart.trim().split(',')[0].split('"')[2];
          }
        }

        if (page.split('INNERTUBE_CONTEXT').length > 1) {
          const contextPart = page.split('INNERTUBE_CONTEXT')[1];
          if (contextPart) {
            context = JSON.parse(contextPart.trim().slice(2, -2));
          }
        }

        initdata = JSON.parse(data);

        try {
          const playerDataMatch = page.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\})\s*;/);
          playerData = playerDataMatch ? JSON.parse(playerDataMatch[1]) : null;
        } catch (error) {}
        return { initdata, apiToken, context, playerData };
      } else {
        throw new Error('Cannot parse YouTube initialization data');
      }
    } catch (ex) {
      console.log('error getYoutubeInitData :: ', (ex as Error).message);
      return false;
    }
  }

  async getMusicData(): Promise<homeSongsType | false> {
    const musicEndpoint = `https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ`;
    const res = await this.getYoutubeInitData(musicEndpoint);
    if (!res) {
      return false;
    }
    const musics = parseMusicData(res);
    if (!musics) {
      return false;
    }
    return musics;
  }

  async getVideoData(videoId: string): Promise<VideoType | false> {
    const videoEndpoint = `https://www.youtube.com/watch?v=${videoId}`;
    const res = await this.getYoutubeInitData(videoEndpoint);
    if (!res || !res.playerData) {
      return false;
    }
    const { videoDetails } = res.playerData;
    const duration = parseInt(videoDetails?.lengthSeconds ?? '0', 10);
    const channel = videoDetails?.author ?? '';
    const title = videoDetails?.title ?? '';
    return { videoId, title, channel, duration };
  }

  async getPlaylistVideos(playlistId: string): Promise<getPlaylistVideosProps | false> {
    const playlistEndpoint = `https://www.youtube.com/playlist?list=${playlistId}`;
    const res = await this.getYoutubeInitData(playlistEndpoint);
    if (!res) {
      return false;
    }
    const playlist = parsePlaylistVideos(res);

    if (!playlist) {
      return false;
    }
    return { playlist, context: res.context, apiToken: res.apiToken || '' };
  }

  async getAutoCompleteSearch(query: string): Promise<string[] | false> {
    const autoCompleteEndpoint = `https://suggestqueries-clients6.youtube.com/complete/search?client=youtube&q=${query}`;
    const res = await fetch(autoCompleteEndpoint).then((res) => res.text());
    if (!res) {
      return false;
    }
    const results = parseAutoComplete(res);
    if (!results) {
      return false;
    }
    return results;
  }

  async search(term: string): Promise<searchProps | false> {
    const searchEndpoint = `https://www.youtube.com/results?search_query=${term}`;
    const res = await this.getYoutubeInitData(searchEndpoint);
    if (!res) {
      return false;
    }
    const search = parseSearchResults(res);
    if (!search) {
      return false;
    }
    return { search, context: res.context, apiToken: res.apiToken || '' };
  }

  //  ===== Next pages =====
  async getPlaylistVideosNext(
    token: string,
    context: any,
    apiToken: string
  ): Promise<{ items: VideoType[]; nextPage: string } | false> {
    const data = await fetch(`https://www.youtube.com/youtubei/v1/browse?key=${apiToken}`, {
      method: 'POST',
      body: JSON.stringify({
        context: context,
        continuation: token,
      }),
    }).then((res) => res.json());
    if (!data) {
      return false;
    }
    const res = parsePlaylistVideosNext(data);
    if (!res) {
      return false;
    }
    return res;
  }

  async getSearchNext(token: string, context: any, apiToken: string): Promise<SearchType | false> {
    const data = await fetch(`https://www.youtube.com/youtubei/v1/search?key=${apiToken}`, {
      method: 'POST',
      body: JSON.stringify({
        context: context,
        continuation: token,
      }),
    }).then((res) => res.json());
    if (!data) {
      return false;
    }
    const res = parseSearchResultsNext(data);
    if (!res) {
      return false;
    }
    return res;
  }
}

export const Yt = new YtApi();
