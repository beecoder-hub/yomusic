import type { VideoType } from '../types';

export const getVideoOembed = async (urlParams: {
  url?: string;
  vid?: string;
}): Promise<false | VideoType> => {
  let URL = '';
  if (urlParams.url) {
    URL = `https://youtube.com/oembed?url=${encodeURIComponent(urlParams.url)}&format=json`;
  } else if (urlParams.vid) {
    URL = `https://youtube.com/oembed?url=https://youtube.com/watch?v=${urlParams.vid}&format=json`;
  }

  try {
    const res = await fetch(URL);
    const data = await res.json();
    return {
      title: data.title,
      channel: data.author_name,
      videoId: data.thumbnail_url.split('/')[4],
      duration: 0,
    };
  } catch (error) {
    return false;
  }
};
