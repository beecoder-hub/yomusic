import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LuLoaderCircle } from 'react-icons/lu';
import SearchResultsCard from '../components/cards/SearchResultsVideoCard';
import type { PlaylistType, SearchType, VideoType } from '../types';
import { Button, List } from 'konsta/react';
import { Yt } from '../api';
import SearchResultPlaylistCards from '../components/cards/SearchResultPlaylistCards';

const SearchResults = () => {
  const params = useParams();
  const { term } = params;
  const [searchResultsData, setsearchResultsData] = useState<SearchType>({
    contents: [],
    nextPage: '',
  });
  const [loading, setloading] = useState(false);
  const [nextLoading, setnextLoading] = useState(false);

  useEffect(() => {
    // look for cacahed results:
    const cache = sessionStorage.getItem(`search-${term}`);
    if (cache) {
      const obj = JSON.parse(cache);
      setsearchResultsData(obj);
    } else {
      (async () => {
        if (term) {
          setloading(true);
          const res = await Yt.search(term);
          if (!res) {
            return false;
          }
          const { search, apiToken, context } = res;
          // save context and api token to local storage for next page:
          localStorage.setItem('pageClient', JSON.stringify({ context, apiToken }));
          const formattedObj = {
            contents: search.contents,
            nextPage: search.nextPage,
          };
          setsearchResultsData(formattedObj);
          sessionStorage.setItem(`search-${term}`, JSON.stringify(formattedObj));
          setloading(false);
        }
      })();
    }
  }, []);

  const getNextPage = async () => {
    const token = searchResultsData.nextPage;
    if (!token) {
      return false;
    }
    // get apiToken and context from localstorage:
    const next = localStorage.getItem('pageClient');
    if (!next) {
      return false;
    }
    const { context, apiToken } = JSON.parse(next);
    setnextLoading(true);
    const res = await Yt.getSearchNext(token, context, apiToken);
    if (!res) {
      return false;
    }
    const formattedObj = {
      contents: [...searchResultsData.contents, ...res.contents],
      nextPage: res.nextPage,
    };
    setsearchResultsData(formattedObj);
    sessionStorage.setItem(`search-${term}`, JSON.stringify(formattedObj));
    setnextLoading(false);
  };

  return (
    <div className="pb-4">
      {Array.isArray(searchResultsData.contents) && (
        <div className="title  my-4">
          {` Search Results for '${term}' ${
            searchResultsData?.contents?.length > 0
              ? ` found ${searchResultsData.contents.length} items `
              : ''
          }`}
        </div>
      )}

      {loading && (
        <>
          <br />
          <div className="flex items-center justify-center">
            <LuLoaderCircle className="size-5 animate-spin" />
          </div>
        </>
      )}
      {Array.isArray(searchResultsData.contents) && searchResultsData.contents.length > 0 && (
        <div>
          <List>
            {searchResultsData.contents.map((item, i) => {
              if (item.type === 'video') {
                return <SearchResultsCard key={i} video={item.data as VideoType} />;
              } else if (item.type === 'playlist') {
                return (
                  <SearchResultPlaylistCards key={i} playlistData={item.data as PlaylistType} />
                );
              }
            })}
          </List>
        </div>
      )}

      {!loading &&
        searchResultsData.nextPage &&
        searchResultsData.nextPage &&
        searchResultsData.contents.length > 0 && (
          <div className="mt-4">
            <Button rounded={true} disabled={nextLoading} onClick={getNextPage} className="w-full">
              {nextLoading && <LuLoaderCircle className="size-5 animate-spin" />} Load More
            </Button>
          </div>
        )}
    </div>
  );
};

export default SearchResults;
