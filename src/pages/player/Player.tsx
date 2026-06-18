import { LuLoaderCircle } from 'react-icons/lu';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDataStore } from '../../zustand/app_data_store';
import MusicControls from './MusicControls';
import type { VideoType } from '../../types';
import { Yt } from '../../api';

const Player = () => {
  const params = useParams();
  const { videoId } = params;
  const { currentPlayingVideo, setcurrentPlayingVideo, history, setHistory } = useDataStore();

  const [isLoading, setisLoading] = useState(false);
  const [_gotError, setgotError] = useState('msg');

  useEffect(() => {
    if (videoId) {
      const cachedVideoMap = localStorage.getItem('cachedVideoMap');
      if (cachedVideoMap) {
        // use cache
        //   check if video exist in cache:
        const parsedCachedVideoMap = JSON.parse(cachedVideoMap);
        if (videoId in parsedCachedVideoMap) {
          // has cache:
          setcurrentPlayingVideo({
            ...parsedCachedVideoMap[videoId],
            isInit: true,
          });
          addToHistory(parsedCachedVideoMap[videoId]);
        } else {
          setisLoading(true);
          fetchVideoDetails(videoId);
        }
      } else {
        setisLoading(true);
        fetchVideoDetails(videoId);
      }
    }
  }, [videoId]);

  const fetchVideoDetails = async (videoId: string) => {
    try {
      const videoData = await Yt.getVideoData(videoId);
      if (!videoData) {
        return false;
      }
      setcurrentPlayingVideo({ ...videoData, isInit: true });

      // add this video to LOCALSTORAGE cachedVideoMap:
      let parsedCachedVideoMap: { [x: string]: object } = {};
      const cachedVideoMap = localStorage.getItem('cachedVideoMap');
      if (cachedVideoMap) {
        parsedCachedVideoMap = JSON.parse(cachedVideoMap);
      }
      parsedCachedVideoMap[videoId!] = videoData;
      localStorage.setItem(`cachedVideoMap`, JSON.stringify(parsedCachedVideoMap));

      // FINALLY SET LOADING FALSE
      setisLoading(false);
      //   add to history
      addToHistory(videoData);
    } catch (error) {
      setgotError(error instanceof Error ? error.message : '');
      setisLoading(false);
    }
  };

  const addToHistory = (video: VideoType) => {
    // check if already exist:
    const v = history.some((f) => f.videoId === video.videoId);
    if (v) {
      // has already, just move to top
      setHistory([video, ...history.filter((f) => f.videoId !== video.videoId)]);
    } else {
      // add to top of list with limit:
      const limit = 30;
      setHistory([video, ...history.slice(0, limit - 1)]);
    }
  };

  return (
    <div className="dark:text-white max-w-3xl p-4 xl:mx-auto">
      <div
        className="flex w-full justify-center my-4 h-58 rounded-xl"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url('https://i.ytimg.com/vi/${videoId}/hqdefault.jpg')`,
        }}
      ></div>
      <div className="text-xl xl:text-3xl my-8 line-clamp-2">
        {currentPlayingVideo.title} {currentPlayingVideo.channel}
      </div>
      <div className="text-lg xl:text-xl my-4 text-center">{currentPlayingVideo.channel}</div>
      {!isLoading && videoId ? (
        <MusicControls data={{ ...currentPlayingVideo, videoId: videoId }} />
      ) : (
        <div className="flex justify-center">
          <LuLoaderCircle className="size-6 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default Player;
