import type { PlaylistType } from '../../types';
import { useNavigate } from 'react-router-dom';
import { MdPlaylistPlay } from 'react-icons/md';
import { ListItem } from 'konsta/react';

const SearchResultPlaylistCards = ({ playlistData }: { playlistData: PlaylistType }) => {
  const navigate = useNavigate();

  return (
    <div
      className=""
      onClick={() => {
        navigate(`/list/${playlistData.playlistId}`);
      }}
    >
      <ListItem
        contentClassName="bg-md-light-surface-3 dark:bg-md-dark-surface-3 m-0! my-3!"
        titleWrapClassName="line-clamp-2"
        link
        chevronMaterial={false}
        title={playlistData.title}
        //   after="$15"
        subtitle={playlistData.channel}
        text="Playlist"
        media={
          <div
            className="image w-20 h-18 bg-md-light-primary dark:bg-md-dark-primary rounded-lg flex items-center justify-center"
            style={{
              backgroundImage: `url('${playlistData.thumbnail}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {playlistData.isCustomChannel && (
              <MdPlaylistPlay
                size={32}
                className="text-md-light-on-primary dark:text-md-dark-on-primary"
              />
            )}
          </div>
        }
      />
    </div>
  );
};

export default SearchResultPlaylistCards;
