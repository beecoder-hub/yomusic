import type { YoutubeInitData, homeSongsType } from '../types_api';

// ─── helpers ─────────────────────────────────────────────────────────────────

/**
 * Section titles use either `simpleText` (most sections) or `runs[0].text`
 * (sections that have a navigation link attached to their title).
 * We must handle both.
 */
function getSectionTitle(titleObj: any): string {
  return titleObj?.simpleText ?? titleObj?.runs?.[0]?.text ?? '';
}

/**
 * ALBUM and PLAYLIST content types wrap the thumbnail inside
 * collectionThumbnailViewModel (stacked-cards visual).
 */
function getCollectionThumbnail(lock: any): string {
  try {
    const sources: any[] =
      lock.contentImage.collectionThumbnailViewModel.primaryThumbnail.thumbnailViewModel.image
        .sources;
    if (sources.length >= 2) {
      return sources[1]?.url ?? ''; // use medium quality for now by default
    }
    return sources[sources.length - 1]?.url ?? '';
  } catch {
    return '';
  }
}

// ─── main export ──────────────────────────────────────────────────────────────

/**
 * Parses the YouTube Music channel home page.
 *
 */
export function parseMusicData(res: YoutubeInitData): homeSongsType | false {
  try {
    const richContents: any[] =
      res.initdata.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
        .richGridRenderer.contents;

    const music: NonNullable<homeSongsType['music']> = [];
    const albums: NonNullable<homeSongsType['albums']> = [];

    for (const section of richContents) {
      const shelf = section?.richSectionRenderer?.content?.richShelfRenderer;
      if (!shelf) continue;

      const sectionTitle = getSectionTitle(shelf.title);
      const shelfContents: any[] = shelf.contents ?? [];

      const vid: { videoId: string; title: string }[] = [];
      const pList: { playlistId: string; title: string; thumbnail: string }[] = [];

      for (const c of shelfContents) {
        const lock = c?.richItemRenderer?.content?.lockupViewModel;
        if (!lock) continue;

        const contentType: string = lock.contentType ?? '';
        const contentId: string = lock.contentId ?? '';
        const title: string = lock.metadata?.lockupMetadataViewModel?.title?.content ?? '';

        if (contentType === 'LOCKUP_CONTENT_TYPE_VIDEO') {
          if (contentId) vid.push({ videoId: contentId, title });
        } else if (
          contentType === 'LOCKUP_CONTENT_TYPE_ALBUM' ||
          contentType === 'LOCKUP_CONTENT_TYPE_PLAYLIST'
        ) {
          // Both map to albums[]; thumbnails use the collection wrapper path
          const thumbnail = getCollectionThumbnail(lock);
          if (contentId) pList.push({ playlistId: contentId, title, thumbnail });
        }
      }

      if (vid.length > 0) music.push({ title: sectionTitle, content: vid });
      if (pList.length > 0) albums.push({ title: sectionTitle, content: pList });
    }

    return { music, albums };
  } catch (error) {
    console.log('parseMusicData Error :: ', (error as Error).message);
    return false;
  }
}
