import { MdInfo } from 'react-icons/md';
import { useDataStore } from '../../zustand/app_data_store';
import FavViewCard from '../../components/cards/FavViewCard';
import { List } from 'konsta/react';

const Favorite = () => {
  const { favourites } = useDataStore();

  return (
    <div className="w-full">
      <div>
        <div className="title font-semibold text-lg my-4">Favorites</div>
        {favourites && favourites.length <= 0 && (
          <p className="mt-4 bg-surface-variant backdrop-blur-sm p-1 rounded-xl h-16 xl:w-1/2 justify-center xl:justify-start flex  items-center">
            <MdInfo className="w-5 h-5 me-2" /> <span>No Items Found</span>
          </p>
        )}
        {/* LIST */}
        <List>
          {favourites &&
            favourites.length > 0 &&
            favourites.map((item, i) => <FavViewCard key={i} data={item} />)}
        </List>
      </div>
    </div>
  );
};

export default Favorite;
