import CarouselVideo from '../../components/CarouselVideo';
import CarouselList from '../../components/CarouselList';
import LoaderCarousel from '../../components/LoaderCarousel';
import { loaderState } from '../../utils/loaderState';

import { Yt } from '../../api';
import { useDataStore } from '../../zustand/app_data_store';
import { useEffect } from 'react';

const Home = () => {
  const { hasHydrated, homeSongs, setHomeSongs, recentSearches } = useDataStore();
  useEffect(() => {
    if (hasHydrated) {
      if (homeSongs.music && homeSongs.music.length! <= 0) {
        (async () => {
          const response = await Yt.getMusicData();
          if (response) {
            setHomeSongs({
              music: response.music,
              albums: response.albums,
            });
            // set localstoreage expiry
            localStorage.setItem(
              'ExpiresIn',
              String(Date.now() + 1000 * 60 * 60 * 4) //4 hr
            );
          }
        })();
      } else {
        // using cacahed - check for expiry
        const exp = localStorage.getItem('ExpiresIn');
        if (exp && Number(exp) < Date.now()) {
          // expired: - clear data
          setHomeSongs({ music: [], albums: [] });
          localStorage.removeItem('cachedVideoMap'); // remove all cacahed video data (used by player.tsx)
          window.location.reload();
        }
      }
    }
  }, [hasHydrated]);

  return (
    <div className="w-full">
      {homeSongs.music && homeSongs.music.length! > 0 ? (
        <div>
          {/* msusic */}
          {homeSongs.music &&
            homeSongs.music.map((item, i) => (
              <div key={i}>
                <div className="title font-semibold  my-4">{item.title}</div>
                <CarouselVideo content={item.content} />
              </div>
            ))}

          {/* recent searches */}
          {recentSearches && recentSearches.length > 0 && (
            <>
              <div className="title font-semibold my-4">Recent searches</div>
              <CarouselVideo content={recentSearches} />
            </>
          )}

          {/* playlists */}
          {homeSongs.albums &&
            homeSongs.albums.map((item, i) => (
              <div key={i}>
                <div className="title font-semibold my-4">{item.title}</div>
                <CarouselList content={item.content} />
              </div>
            ))}
        </div>
      ) : (
        <div>
          {/* LOADING CONTAINER */}
          {loaderState.map((item, i) => (
            <div key={i}>
              <div className="title font-semibold  my-4 bg-slate-300 animate-pulse max-w-1/2 rounded-2xl text-transparent">
                laoding title
              </div>
              <LoaderCarousel content={item.content} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
