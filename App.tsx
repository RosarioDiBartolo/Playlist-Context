
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ImportView from './components/ImportView';
import LibraryView from './components/LibraryView';
import { ViewState, PlaylistData, YouTubeVideo } from './types';
import { Search, Bell, User } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewState>('dashboard');
  const [playlists, setPlaylists] = useState<PlaylistData[]>(() => {
    const saved = localStorage.getItem('playlist_data');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('playlist_data', JSON.stringify(playlists));
  }, [playlists]);

  const handlePlaylistImported = (data: PlaylistData) => {
    setPlaylists((prev) => [data, ...prev]);
    setView('library');
  };

  const handleVideoUpdated = (playlistId: string, videoId: string, updates: Partial<YouTubeVideo>) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        const updatedVideos = p.videos.map(v => v.id === videoId ? { ...v, ...updates } : v);
        const processedCount = updatedVideos.filter(v => v.status === 'completed').length;
        return { ...p, videos: updatedVideos, processedCount };
      }
      return p;
    }));
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard playlists={playlists} />;
      case 'import':
        return <ImportView onPlaylistImported={handlePlaylistImported} />;
      case 'library':
        return <LibraryView playlists={playlists} onVideoUpdated={handleVideoUpdated} />;
      default:
        return (
          <div className="p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Under Construction</h2>
            <p className="text-gray-500">This feature ({currentView}) will be available in v1.1.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={currentView} setView={setView} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
             {/* Dynamic Breadcrumbs or Search */}
             <div className="relative w-96 max-w-full">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
               <input 
                 type="text" 
                 placeholder="Search transcripts, notes, playlists..." 
                 className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
               />
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-gray-200" />
            <button className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                NA
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">Naples User</span>
            </button>
          </div>
        </header>

        <div className="flex-1">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
