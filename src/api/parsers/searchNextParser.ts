import type { SearchType } from '../types_api';
import { parseLockupViewModel, parseVideoRenderer } from '../utils';
import { parseNextToken } from './nextTokenParser';

export function parseSearchResultsNext(data: any): SearchType | false {
  try {
    const Items =
      data.onResponseReceivedCommands[0].appendContinuationItemsAction.continuationItems;
    let newToken = '';
    try {
      const contItem = Items.find((i: any) => 'continuationItemRenderer' in i);
      if (contItem) {
        // Direct continuation token path
        newToken = parseNextToken(contItem);
      }
    } catch {}

    const contents: SearchType['contents'] = [];
    // next page contents can be either playlistVideoRenderer or lockupViewModel
    Items[0].itemSectionRenderer.contents.forEach((item: any) => {
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
    });

    return { contents, nextPage: newToken };
  } catch (error) {
    console.log('parseSearchResultsNext Error :: ', (error as Error).message);
    return false;
  }
}
