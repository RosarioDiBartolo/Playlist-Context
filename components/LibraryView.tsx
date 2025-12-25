
import React, { useState } from 'react';
// Added Zap and Library to the lucide-react imports
import { Search, Filter, MoreVertical, Edit2, Trash2, ExternalLink, FileText, CheckCircle, Zap, Library } from 'lucide-react';
import { PlaylistData, YouTubeVideo } from '../types';
import { polishTranscript } from '../services/geminiService';

interface LibraryViewProps {
  playlists: PlaylistData[];
  onVideoUpdated: (playlistId: string, videoId: string, updates: Partial<YouTubeVideo>) => void;
}

const LibraryView: React.FC<LibraryViewProps> = ({ playlists, onVideoUpdated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<{ pId: string, v: YouTubeVideo } | null>(null);
  const [polishing, setPolishing] = useState(false);

  const filteredVideos = playlists.flatMap(p => 
    p.videos.map(v => ({ playlistId: p.id, playlistTitle: p.title, ...v }))
  ).filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.playlistTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePolish = async () => {
    if (!selectedVideo) return;
    setPolishing(true);
    try {
      // Use a dummy raw transcript for simulation
      const rawDummy = `
        Hey everyone, today we are talking about ${selectedVideo.v.title}. 
        The first thing you need to know is how the architecture works. 
        Then we will dive into implementation details. 
        It is really important to understand that scaling is hard. 
        But with these tools, it becomes easier. 
        Thanks for watching, don't forget to like and subscribe.
      `;
      const result = await polishTranscript(selectedVideo.v.title, rawDummy);
      onVideoUpdated(selectedVideo.pId, selectedVideo.v.id, { 
        polishedTranscript: result,
        status: 'completed'
      });
      setSelectedVideo(prev => prev ? { ...prev, v: { ...prev.v, polishedTranscript: result, status: 'completed' } } : null);
    } catch (err) {
      console.error(err);
    } finally {
      setPolishing(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* List Pane */}
      <div className={`flex-1 overflow-hidden flex flex-col border-r bg-white ${selectedVideo ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 border-b space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search in library..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{filteredVideos.length} Items</p>
            <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 font-medium">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredVideos.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedVideo({ pId: item.playlistId, v: item })}
              className={`w-full text-left p-4 border-b flex gap-4 transition-colors ${
                selectedVideo?.v.id === item.id ? 'bg-indigo-50 border-indigo-100' : 'hover:bg-gray-50'
              }`}
            >
              <img src={item.thumbnail} alt="" className="w-20 h-12 object-cover rounded shadow-sm flex-shrink-0" />
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate">{item.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">{item.playlistTitle}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-[10px] text-gray-500">{item.duration}</span>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  {item.status === 'completed' ? (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase">
                      <CheckCircle className="w-3 h-3" /> Polished
                    </div>
                  ) : (
                    <div className="text-[10px] font-bold text-orange-500 uppercase">Pending AI Polish</div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Pane */}
      <div className={`flex-[1.5] bg-gray-50 overflow-hidden flex flex-col ${selectedVideo ? 'flex' : 'hidden lg:flex items-center justify-center'}`}>
        {selectedVideo ? (
          <>
            <div className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
                >
                  <Filter className="w-5 h-5 rotate-90" />
                </button>
                <div>
                  <h3 className="font-bold text-gray-900 truncate max-w-md">{selectedVideo.v.title}</h3>
                  <p className="text-xs text-gray-500">{selectedVideo.v.author}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Export
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-3xl mx-auto space-y-8">
                {selectedVideo.v.polishedTranscript ? (
                  <article className="prose prose-indigo prose-sm bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed font-normal font-sans">
                      {selectedVideo.v.polishedTranscript}
                    </div>
                  </article>
                ) : (
                  <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                      <FileText className="w-8 h-8 text-indigo-500" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Ready for AI Polishing</h4>
                    <p className="text-gray-500 max-w-sm mb-8">
                      This video has been imported. Use our AI to refine the raw transcript into a structured knowledge document.
                    </p>
                    <button
                      onClick={handlePolish}
                      disabled={polishing}
                      className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center gap-3"
                    >
                      {polishing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Polishing Transcript...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 fill-current" />
                          Run AI Polish
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="bg-gray-900 rounded-2xl p-6 text-white overflow-hidden relative">
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-1">Knowledge Server</p>
                      <h5 className="font-bold">Sync to MCP Vector DB</h5>
                    </div>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors">
                      Index Now
                    </button>
                  </div>
                  <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Library className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Select an item</h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              Choose a video from your library to view or edit its polished AI transcript.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryView;
