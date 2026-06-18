import type { YoutubeInitData, SearchType } from '../types_api';
import { parseLockupViewModel, parseVideoRenderer } from '../utils';
import { parseNextToken } from './nextTokenParser';

// ─── main export ──────────────────────────────────────────────────────────────

/**
 * Parses a YouTube search-results page into a SearchType.
 * Inside itemSectionRenderer.contents we pick:
 *   • videoRenderer       → VideoType
 *   • lockupViewModel     → PlaylistType  (contentType = LOCKUP_CONTENT_TYPE_PLAYLIST)
 *
 * Everything else (gridShelfViewModel, shorts, ads, …) is skipped.
 */
export function parseSearchResults(res: YoutubeInitData): SearchType | false {
  try {
    const sectionContents: any[] =
      res.initdata.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer
        .contents;

    const contents: SearchType['contents'] = [];
    let nextPage = '';

    for (const section of sectionContents) {
      // Continuation token sits directly in sectionListRenderer.contents
      if (section.continuationItemRenderer) {
        nextPage = parseNextToken(section);
        continue;
      }

      const items: any[] = section.itemSectionRenderer?.contents ?? [];

      for (const item of items) {
        if (item.videoRenderer) {
          contents.push({
            data: parseVideoRenderer(item.videoRenderer),
            type: 'video',
          });
        } else if (item.lockupViewModel) {
          contents.push({
            data: parseLockupViewModel(item.lockupViewModel),
            type: 'playlist',
          });
        }
        // gridShelfViewModel, shortsLockupViewModel, etc. are intentionally skipped
      }
    }

    return { contents, nextPage };
  } catch (error) {
    console.log('parseSearchResults Error :: ', (error as Error).message);
    return false;
  }
}
