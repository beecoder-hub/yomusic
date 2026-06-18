import { MdShare } from 'react-icons/md';
import { handleShare } from '../../utils/shareText';

const ShareP = () => {
  return (
    <div
      className="flex gap-4 items-center py-2 rounded-lg"
      onClick={() => {
        handleShare({
          title: 'Download yo Music',
          url: 'https://yomusic.vercel.app',
          text: 'Download yo Music',
        });
      }}
    >
      <MdShare size={24} />
      <div className="info w-full">
        <div className="title  font-semibold">Share</div>
      </div>
    </div>
  );
};

export default ShareP;
