// ─── helpers ─────────────────────────────────────────────────────────────────

import type { PlaylistType, VideoType } from './types_api';

/** "11:15:54" | "32:12" | "3:14"  →  seconds */
export function durationToSeconds(text: string): number {
  try {
    const parts = text.trim().split(':').map(Number);
    if (parts.some(isNaN)) return 0;
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
  } catch {
    return 0;
  }
}

// ─── videoRenderer ────────────────────────────────────────────────────────────

export function parseVideoRenderer(v: any): VideoType {
  return {
    videoId: v.videoId ?? '',
    title: v.title?.runs?.[0]?.text ?? '',
    channel: v.ownerText?.runs?.[0]?.text ?? v.longBylineText?.runs?.[0]?.text ?? '',
    duration: durationToSeconds(v.lengthText?.simpleText ?? ''),
  };
}

// ─── lockupViewModel (it can be video or playlist) ───────────────────────────────────────────────

export function parseLockupViewModel(lock: any): PlaylistType | VideoType {
  const contentId: string = lock.contentId ?? '';

  const title: string = lock.metadata?.lockupMetadataViewModel?.title?.content ?? '';

  // Channel probably is in the first non-spacer metadataRow, first part but some items return views at that position
  //   need to handle quirk:
  let channel = '';
  try {
    const rows: any[] =
      lock.metadata.lockupMetadataViewModel.metadata.contentMetadataViewModel.metadataRows;
    for (const row of rows) {
      const parts: any[] | undefined = row.metadataParts;
      if (parts?.length) {
        channel = parts[0].text?.content ?? '';
        break;
      }
    }

    if (channel.includes(' views')) {
      // probably a view value is returned so reset channel:
      channel = '';
    }
  } catch {}

  if (lock.contentType.toLowerCase().includes('video')) {
    // is a video:
    return {
      videoId: contentId,
      title,
      duration: 0,
      channel,
    };
  }
  // else is a playlist:

  // Thumbnail: last source = highest resolution
  let thumbnail = '';
  try {
    const sources: any[] =
      lock.contentImage.collectionThumbnailViewModel.primaryThumbnail.thumbnailViewModel.image
        .sources;
    thumbnail = sources[sources.length - 1]?.url ?? '';
  } catch {}

  return {
    playlistId: contentId,
    thumbnail,
    title,
    channel,
    isCustomChannel: false,
    videoItems: { items: [], nextPage: '' },
  };
}

// sample contex and api token for next page result:
// export const nextParams = {
//   context: {
//     client: {
//       hl: 'en',
//       gl: 'IN',
//       remoteHost: '2409:408a:2d44:6ff0:240f:2eb:58ee:9abe',
//       deviceMake: '',
//       deviceModel: '',
//       visitorData:
//         'Cgtia3d0aE0taWFoVSik07PRBjIKCgJJThIEGgAgH2LfAgrcAjE5LllUPWpNdzFpSVVxNFZTUE55ckVYVnhfNnVyQ0ZQSkRrZFlrN1RVd1FPOW95UDJIemtrQmRFWHQyVWJmU2VBd2pubGdZd3p0bnBYS1h5bWh3YXU3OGVjWG9fcGZaYUxBVWJnT0RQVnRqYXl5cjdvNVYzTS1hV2kxcU5ITExGX2d6TjBSanNhS0MwbG9RalJzYzd0WDNpZlVKSWwta2hwc0xSVGlscV9SbzNKaWJHaDFsb19DTlNHUkxWNVNBbUJUOWN0SFF3Z3B1NTJvdVVlQmluQVM5eHVBUnBZRjhmekRFQXNOc1VkQjdyQmVGQjVGcXg2bEV6YWtmeGFic2Z0eVlZcFdQUDZaT1BJclZpemVPcFRtOEpBX2tUNlBON2VwOVR5Z3lKQUdsWGNiUUYwUV9HQ1BOWlVVZzhCNTJ0aFllLWNoZ1cyRFA3TDR2ZHVHbjhWQWtLajFJZw%3D%3D',
//       userAgent:
//         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36,gzip(gfe)',
//       clientName: 'WEB',
//       clientVersion: '2.20260612.01.00',
//       osName: 'Windows',
//       osVersion: '10.0',
//       originalUrl: 'https://www.youtube.com/?gl\u003dIN\u0026app\u003ddesktop',
//       platform: 'DESKTOP',
//       clientFormFactor: 'UNKNOWN_FORM_FACTOR',
//       configInfo: {
//         appInstallData:
//           'CKTTs9EGENnW0RwQ37fRHBDxnLAFEIiQ0RwQ2vfOHBCe0LAFEMvRsQUQpKnRHBCnjNEcEI-q0RwQ4tSuBRCnrtEcELyk0BwQvoTRHBCL988cEMGP0BwQrNDRHBCCj88cEParsAUQvYqwBRDMxdEcEL22rgUQtMHQHBDN0bEFELTsgBMQn8-AExDe0NEcEMOR0BwQxsjRHBCbwtAcELOQzxwQgc3OHBCh-NAcEPfEgBMQh6zOHBCZjbEFEImwzhwQ14vRHBC45M4cELbgrgUQttvRHBCszdEcEKaasAUQieiuBRCNkNEcENrv0BwQ_LLOHBDj3dEcEIuP0RwQ5d3RHBDnpdEcEJyGuCIQ4M2xBRCArtEcENK90BwQ64_RHBDIp9EcELeGzxwQlofRHBDxtNAcEN68zhwQvZmwBRCowtEcEOuFuCIQzN-uBRCu1s8cENvO0RwqgAFDQU1TV2hWUi1acS1ETGlVRXBRQ25BNzVGWEpEd1JXbzFRX2NBX0ROM3d2d3NSS0hUREtnckFRRHpmOEZ5N2NHLXlhMjVBYUZGUHVnQk9rVG5rdUNLTXpTQU10S3ZKTUV2RzRGbkRIN0xNVFNCdmc0eXoyMmplc2Uyd1lkQnc9PTAA',
//       },
//       userInterfaceTheme: 'USER_INTERFACE_THEME_LIGHT',
//       browserName: 'Chrome',
//       browserVersion: '147.0.0.0',
//       acceptHeader: '*/*',
//       deviceExperimentId: 'ChxOelkxTURjME5qYzFOelk1TmpjNE5EazVNZz09EKTTs9EGGKTTs9EG',
//       rolloutToken: 'COfw3sLEqpCpSxDMp5q7vIOVAxiujPLCvIOVAw%3D%3D',
//     },
//     user: { lockedSafetyMode: false },
//     request: { useSsl: true },
//     clickTracking: { clickTrackingParams: 'IhMI+5LzgL2DlQMVynT1BR0QqCk+' },
//   },
//   apiToken: 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8',
// };
