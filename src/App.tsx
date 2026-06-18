import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/tabs/Home';
import Playlist from './pages/tabs/Playlist';
import Favorite from './pages/tabs/Favorite';
import More from './pages/tabs/More';
import FabBtn from './components/FabBtn';
import GlobalDialog from './components/dialogs/GlobalDialog';
import { App as Application } from 'konsta/react';
import BackBtnHandler from './components/BackBtnHandler';
import PlaylistView from './pages/PlaylistView';
import YtWrapper from './components/YtWrapper';
import Player from './pages/player/Player';
import CPlaylistView from './pages/CPlaylistView';
import SearchPage from './pages/SearchPage';
import SearchResults from './pages/SerchResults';
import HistoryPage from './pages/HistoryPage';
import MediaSessionComponent from './components/MediaSessionComponent';
import Analytics from './components/Analytics';
import DailyNotification from './components/DailyNotification';

function App() {
  return (
    <Application theme="material" className="min-h-auto! h-full">
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* TABS */}
            <Route path="/" element={<Home />} />
            <Route path="/playlist" element={<Playlist />} />
            <Route path="/favorite" element={<Favorite />} />
            <Route path="/more" element={<More />} />

            {/* PAGES */}
            <Route path="/play/:videoId" element={<Player />} />
            <Route path="/list/:playlistId" element={<PlaylistView />} />
            <Route path="/clist/:playlistId" element={<CPlaylistView />} />

            {/* SEARCH */}
            <Route path="/search" element={<SearchPage />} />
            <Route path="/search/:term" element={<SearchResults />} />
            {/* HISTORY */}
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
          <BackBtnHandler />
        </Layout>
        <YtWrapper />
        <GlobalDialog />
        <FabBtn />
        <MediaSessionComponent />

        <DailyNotification />
        <Analytics />
      </BrowserRouter>
    </Application>
  );
}

export default App;
