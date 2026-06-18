import { useState } from 'react';
import { MdInfo, MdSearch } from 'react-icons/md';
import PlaylistViewCard from '../../components/cards/PlaylistViewCard';
import { useDataStore } from '../../zustand/app_data_store';
import { List } from 'konsta/react';
import { toastMsg } from '../../utils/toastMsg';

const Playlist = () => {
  const { playlists, setPlaylists } = useDataStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleAddPlaylist = async () => {
    if (!searchQuery.trim()) {
      toastMsg('Vlaues cannot be empty!');
      return false;
    }
    if (searchQuery.includes('https://')) {
      try {
        // check for valid playlist link:
        const res = await fetch(
          `https://www.youtube.com/oembed?url=${encodeURI(searchQuery)}&format=json`
        );
        const data = await res.json();

        const title = data.title;
        const thumbnail = data.thumbnail_url;
        const channel = data.author_name;
        // to get playlist id:
        const html = document.createElement('div');
        html.innerHTML = data.html;
        const iframe = html.firstChild as HTMLIFrameElement;
        const src = iframe.src;
        if (src.includes('videoseries')) {
          const url = new URL(src);
          const params = url.searchParams;
          const playlistId = params.get('list');
          if (playlistId) {
            // finnaly check if the id already exist:
            if (playlists.findIndex((item) => item.playlistId === playlistId) >= 0) {
              toastMsg('Already exist!');
              return false;
            }
            toastMsg('Playlist Added!');
            setPlaylists([
              {
                playlistId: playlistId,
                title: title,
                thumbnail: thumbnail,
                channel: channel,
                isCustomChannel: false,
                videoItems: { items: [], nextPage: '' },
              },
              ...playlists,
            ]);
          }
        } else {
          toastMsg('Invalid Link');
        }
      } catch (error) {
        toastMsg('Invalid Link');
        return (error as Error).message;
      }
    } else {
      // to create custom playlist
      if (playlists.findIndex((item) => item.title.trim() === searchQuery.trim()) >= 0) {
        toastMsg('Already Exist!');
        return false;
      }
      setPlaylists([
        {
          playlistId: String(Date.now()),
          title: searchQuery,
          thumbnail: '',
          channel: 'Custom list',
          isCustomChannel: true,
          videoItems: { items: [], nextPage: '' },
        },
        ...playlists,
      ]);
      toastMsg('Playlist Added');
    }
    // finally reset form:
    handleClear();
  };

  return (
    <div>
      <div className="searchBox bg-md-light-surface-variant dark:bg-md-dark-surface-variant mt-4 rounded-full w-full h-12 relative overflow-hidden">
        <input
          onKeyUp={(e) => e.key === 'Enter' && handleAddPlaylist()}
          type="text"
          className="h-12 w-full absolute top-0 left-0 outline-0 ps-10"
          placeholder="Paste playlist link or create new"
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          value={searchQuery}
        />
        <div className="icon absolute top-0 left-0 flex items-center justify-center h-full w-10">
          <MdSearch size={24} />
        </div>
      </div>

      <div className="title font-semibold text-lg my-4">Playlists</div>
      {playlists && playlists.length <= 0 && (
        <p className="mt-4 bg-surface-variant backdrop-blur-sm p-1 rounded-xl h-16 xl:w-1/2 justify-center xl:justify-start flex  items-center">
          <MdInfo className="w-5 h-5 me-2" /> <span>No Items Found</span>
        </p>
      )}

      {/* LIST */}
      <List>
        {playlists.map((item, i) => (
          <PlaylistViewCard playlistData={item} key={i} />
        ))}
      </List>
    </div>
  );
};

export default Playlist;
