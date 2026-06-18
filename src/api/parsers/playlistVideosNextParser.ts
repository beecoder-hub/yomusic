import type { VideoType } from '../types_api';
import { parseLockupViewModel } from '../utils';
import { parseNextToken } from './nextTokenParser';

export function parsePlaylistVideosNext(data: any) {
  try {
    const Items = data.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems;

    const channel =
      data.sidebar.playlistSidebarRenderer?.items[1].playlistSidebarSecondaryInfoRenderer
        ?.videoOwner?.videoOwnerRenderer?.title?.runs[0]?.text ?? '';

    let newToken = '';

    let itemsResult: VideoType[] = [];
    // next page contents can be either playlistVideoRenderer or lockupViewModel
    Items.forEach((element: any) => {
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
        // try get cont. token from element if exist
        newToken = parseNextToken(element);
      }
    });
    return { items: itemsResult, nextPage: newToken };
  } catch (error) {
    console.log('parsePlaylistVideosNext Error :: ', (error as Error).message);
    return false;
  }
}
