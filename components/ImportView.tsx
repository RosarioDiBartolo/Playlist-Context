
import React, { useState } from 'react';
import { Link2, Search, Play, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { fetchMockPlaylist } from '../services/geminiService';
import { PlaylistData, YouTubeVideo } from '../types';

interface ImportViewProps {
  onPlaylistImported: (data: PlaylistData) => void;
}

const ImportView: React.FC<ImportViewProps> = ({ onPlaylistImported }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PlaylistData | null>(null);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchMockPlaylist(url);
      setPreview({
        ...data,
        videos: data.videos.map((v: any) => ({ ...v, status: 'pending' })),
        processedCount: 0
      });
    } catch (err) {
      setError("Could not fetch playlist. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartImport = () => {
    if (preview) {
      onPlaylistImported(preview);
      setUrl('');
      setPreview(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Import YouTube Playlist</h2>
        <p className="text-gray-600">Enter a playlist URL to start bulk transcript extraction and AI polishing.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
        <form onSubmit={handleFetch} className="flex gap-3">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="https://www.youtube.com/playlist?list=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Fetch
          </button>
        </form>
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm border border-red-100">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
      </div>

      {preview && (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{preview.title}</h3>
              <p className="text-sm text-gray-500">{preview.videos.length} Videos Found</p>
            </div>
            <button
              onClick={handleStartImport}
              className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Bulk Processing
            </button>
          </div>
          <div className="divide-y max-h-[500px] overflow-y-auto">
            {preview.videos.map((video) => (
              <div key={video.id} className="p-4 flex gap-4 hover:bg-gray-50 transition-colors group">
                <img src={video.thumbnail} alt="" className="w-32 h-20 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">{video.author} • {video.duration}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gray-300" />
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Ready to index</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportView;
