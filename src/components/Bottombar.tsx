import { Tabbar, TabbarLink, ToolbarPane } from 'konsta/react';
import { MdFavorite, MdHome, MdPlaylistPlay, MdWidgets } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

const Bottombar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const links = [
    {
      title: 'Home',
      href: '/',
      icon: <MdHome className="w-6 h-6" />,
    },
    {
      title: 'Playlist',
      href: '/playlist',
      icon: <MdPlaylistPlay className="w-6 h-6" />,
    },
    {
      title: 'Favorite',
      href: '/favorite',
      icon: <MdFavorite className="w-6 h-6" />,
    },
    {
      title: 'More',
      href: '/more',
      icon: <MdWidgets className="w-6 h-6" />,
    },
  ];
  return (
    <Tabbar labels={true} icons={true} className="h-[10vh] overflow-hidden">
      <ToolbarPane>
        {links.map((item) => (
          <TabbarLink
            key={item.title}
            active={pathname === item.href}
            onClick={() => {
              navigate(item.href);
            }}
            icon={item.icon}
            label={item.title}
          />
        ))}
      </ToolbarPane>
    </Tabbar>
  );
};

export default Bottombar;
