import { useEffect, useState } from 'react';
import { MdArrowBack, MdSearch } from 'react-icons/md';
import { LuLoaderCircle } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import SearchResultsCard from '../components/cards/SearchResultsVideoCard';
import type { VideoType } from '../types';
import { getVideoOembed } from '../utils/getVideoOembed';
import { useDataStore } from '../zustand/app_data_store';
import RecentSearchesCard from '../components/cards/RecentSearchesCard';
import { Yt } from '../api';
import { List } from 'konsta/react';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggessions, setsuggessions] = useState<string[]>([]);
  const [searchResults, setsearchResults] = useState<VideoType[]>([]);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const { recentSearches } = useDataStore();

  useEffect(() => {
    const searchbar_ = document.getElementById('searchbar_');
    searchbar_?.focus();
  }, []);

  useEffect(() => {
    const tm = setTimeout(async () => {
      if (searchQuery.trim()) {
        setloading(true);
        const res = await Yt.getAutoCompleteSearch(searchQuery);
        if (res) {
          setsuggessions(res);
        }
        setloading(false);
      } else {
        setsuggessions([]);
      }
    }, 800);
    return () => {
      clearTimeout(tm);
    };
  }, [searchQuery]);

  const handleActualSearch = async (value: string) => {
    if (value) {
      setloading(true);
      //   remove suggessions:
      setsuggessions([]);

      // if value is video url?
      if (value.includes('https://')) {
        const videoData = await getVideoOembed({ url: value });
        if (videoData) {
          setsearchResults([videoData]);
        } else {
          alert('invalid link');
        }
        setloading(false);
        return true;
      }
      navigate(`/search/${value}`);
      setloading(false);
    }
  };
  return (
    <div className="dark:text-white px-2">
      <div className="p_search_bar w-full">
        <div className="searchBox bg-md-light-surface-3 dark:bg-md-dark-surface-3 mt-4 rounded-full w-full h-12 relative overflow-hidden">
          <input
            id="searchbar_"
            type="text"
            inputMode="search"
            enterKeyHint="search"
            className="h-12 w-full absolute top-0 left-0 outline-0 ps-10 mb-4"
            placeholder="Search or Paste video Link"
            onKeyUp={(e) => e.key === 'Enter' && handleActualSearch(searchQuery)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            value={searchQuery}
          />
          <div className="icon absolute top-0 left-0 flex items-center justify-center h-full w-10">
            <MdSearch size={24} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center mt-4">
          <LuLoaderCircle className="size-5 animate-spin" />
        </div>
      ) : (
        <>
          {suggessions.length > 0 && (
            <>
              <div className="title font-semibold text-lg my-4">Suggessions</div>
              <div className="flex flex-col gap-4 pb-20">
                {suggessions.map((item, i) => (
                  <div
                    key={i}
                    className="px-4 flex items-center justify-between"
                    onClick={() => {
                      handleActualSearch(item);
                    }}
                  >
                    {item}
                    <MdArrowBack
                      className="size-6 rotate-45"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSearchQuery(item);
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {searchResults.length > 0 && (
            <div>
              <div className="title font-semibold text-lg my-4">Search Results</div>

              <List>
                {searchResults.map((item, i) => (
                  <SearchResultsCard key={i} video={item} />
                ))}
              </List>
            </div>
          )}

          {recentSearches.length > 0 && searchResults.length <= 0 && suggessions.length <= 0 && (
            <div>
              <div className="title font-semibold text-lg my-4">Recent Searches</div>

              <List>
                {recentSearches.map((item, i) => (
                  <RecentSearchesCard key={i} data={item} />
                ))}
              </List>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
