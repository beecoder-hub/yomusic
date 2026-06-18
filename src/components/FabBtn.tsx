import { MdAlbum } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDataStore } from '../zustand/app_data_store';

const FabBtn = () => {
  const { currentPlayingVideo, isPlaying } = useDataStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    !pathname.includes('/play/') &&
    currentPlayingVideo.isInit && (
      <>
        <div
          className="fixed right-5 bottom-[12vh] z-20 flex items-center justify-center bg-md-light-secondary dark:bg-md-dark-secondary text-on-secondary p-2 rounded-xl"
          onClick={() => {
            navigate(`/play/${currentPlayingVideo.videoId}`);
          }}
        >
          <MdAlbum
            className={`size-10 ${isPlaying && 'animate-pulse'} text-white dark:text-black`}
          />
        </div>
      </>
    )
  );
};

export default FabBtn;
