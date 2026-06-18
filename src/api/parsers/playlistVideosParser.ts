import type { PlaylistType, VideoType, YoutubeInitData } from '../types_api';
import { parseLockupViewModel } from '../utils';
import { parseNextToken } from './nextTokenParser';

/**
 * Parses a playlist page response into a single PlaylistType.
 */
export function parsePlaylistVideos(res: YoutubeInitData): PlaylistType | false {
  try {
    const sectionContents: any[] =
      res.initdata.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
        .sectionListRenderer.contents;

    let kContents = sectionContents[0].itemSectionRenderer.contents;
    try {
      // idk some playlist have contents in this playlistVideoListRenderer
      // if so we need to change kContents to actual content
      if (kContents[0].playlistVideoListRenderer) {
        kContents = kContents[0].playlistVideoListRenderer.contents;
      }
    } catch (error) {}

    // ── Playlist-level metadata ──────────────────────────────────────────────
    let title = '';
    try {
      title = res.initdata.metadata.playlistMetadataRenderer.title ?? '';
    } catch {}

    let channel = '';
    try {
      channel =
        res.initdata.sidebar.playlistSidebarRenderer.items[1].playlistSidebarSecondaryInfoRenderer
          .videoOwner.videoOwnerRenderer.title.runs[0].text ?? '';

      if (!channel) {
        channel = res.initdata.header?.playlistHeaderRenderer?.ownerText?.runs[0].text ?? '';
      }
    } catch {}

    let total = 0;
    try {
      total =
        parseInt(
          res.initdata.sidebar.playlistSidebarRenderer.items[0].playlistSidebarPrimaryInfoRenderer
            .stats[0].runs[0].text
        ) ?? 0;

      if (!total) {
        // try another way to extract total
        total = res.initdata.header?.playlistHeaderRenderer?.numVideosText?.runs[0].text ?? 0;
      }
    } catch (error) {}

    let thumbnail = '';
    try {
      let thumbs: any[] = [];
      let tr: any =
        res.initdata.sidebar.playlistSidebarRenderer.items[0].playlistSidebarPrimaryInfoRenderer
          .thumbnailRenderer;

      if ('playlistVideoThumbnailRenderer' in tr) {
        thumbs = tr.playlistVideoThumbnailRenderer.thumbnail.thumbnails;
      } else if ('playlistCustomThumbnailRenderer' in tr) {
        thumbs = tr.playlistCustomThumbnailRenderer.thumbnail.thumbnails;
      }

      thumbnail = thumbs[thumbs.length - 1]?.url ?? '';
    } catch {}

    // try get playlistId
    let playlistId = '';
    try {
      playlistId = sectionContents[0].itemSectionRenderer.targetId;
    } catch (error) {}

    // ── Pagination token ─────
    let nextPage = '';

    let itemsResult: VideoType[] = [];
    // contents can be either playlistVideoRenderer or lockupViewModel
    kContents.forEach((element: any) => {
      if ('lockupViewModel' in element) {
        const v = parseLockupViewModel(element.lockupViewModel);
        itemsResult.push(v as VideoType);
      } else if ('playlistVideoRenderer' in element) {
        itemsResult.push({
          videoId: element.playlistVideoRenderer.videoId,
          title: element.playlistVideoRenderer?.title?.runs[0]?.text ?? '',
          duration: parseInt(element.playlistVideoRenderer?.lengthSeconds, 10) ?? 0,
          channel: element.playlistVideoRenderer?.shortBylineText?.runs[0]?.text || channel,
        });
      } else {
        // try getting next page token if exist
        nextPage = parseNextToken(element);
      }
    });

    return {
      playlistId,
      thumbnail,
      title,
      channel,
      total,
      isCustomChannel: false,
      videoItems: { items: itemsResult, nextPage },
    };
  } catch (error) {
    console.log('parsePlaylistVideos Error :: ', (error as Error).message);
    return false;
  }
}
