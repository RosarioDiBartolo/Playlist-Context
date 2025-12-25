
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
// Added Import to lucide-react imports
import { Zap, BookOpen, Clock, HardDrive, ArrowUpRight, Import } from 'lucide-react';
import { PlaylistData } from '../types';

interface DashboardProps {
  playlists: PlaylistData[];
}

const Dashboard: React.FC<DashboardProps> = ({ playlists }) => {
  const totalVideos = playlists.reduce((acc, p) => acc + p.videos.length, 0);
  const totalProcessed = playlists.reduce((acc, p) => acc + p.processedCount, 0);
  
  const chartData = [
    { name: 'Mon', count: 12 },
    { name: 'Tue', count: 19 },
    { name: 'Wed', count: 15 },
    { name: 'Thu', count: 25 },
    { name: 'Fri', count: 20 },
    { name: 'Sat', count: 30 },
    { name: 'Sun', count: 28 },
  ];

  const stats = [
    { label: 'Indexed Transcripts', value: totalProcessed, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Processing', value: totalVideos - totalProcessed, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'AI Polish Efficiency', value: '94%', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Storage Used', value: '1.2 GB', icon: HardDrive, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="p-8 space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-gray-900">Workspace Overview</h2>
        <p className="text-gray-500">Welcome back! Your local knowledge base is growing.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Processing Activity</h3>
            <button className="text-indigo-600 text-sm font-medium flex items-center gap-1 hover:underline">
              View Report <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#4f46e5', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="count" stroke="#4f46e5" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Latest Import</h3>
          {playlists.length > 0 ? (
            <div className="space-y-4">
              <div className="flex gap-4">
                <img 
                  src={playlists[0].videos[0]?.thumbnail} 
                  alt="" 
                  className="w-20 h-14 object-cover rounded-lg border border-gray-100" 
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">{playlists[0].title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{playlists[0].videos.length} total videos</p>
                </div>
              </div>
              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Indexing progress</span>
                  <span className="text-indigo-600 font-bold">
                    {Math.round((playlists[0].processedCount / playlists[0].videos.length) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-1000" 
                    style={{ width: `${(playlists[0].processedCount / playlists[0].videos.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <Import className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500">No playlists imported yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
