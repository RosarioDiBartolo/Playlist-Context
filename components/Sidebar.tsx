
import React from 'react';
import { LayoutDashboard, Import, Library, Settings, Database, Github } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'import', icon: Import, label: 'Import Playlist' },
    { id: 'library', icon: Library, label: 'Local Library' },
    { id: 'mcp', icon: Database, label: 'MCP Knowledge' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ] as const;

  return (
    <aside className="w-64 bg-white border-r h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Database className="text-white w-5 h-5" />
        </div>
        <h1 className="font-bold text-lg text-gray-900 leading-tight">
          Playlist<span className="text-indigo-600">Transcribe</span>
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentView === item.id
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t bg-gray-50">
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">MCP Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-700">Local Server: <strong>Running</strong></span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">npx serve-mcp-vdb</p>
        </div>
        <a 
          href="https://github.com" 
          target="_blank" 
          className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors"
        >
          <Github className="w-4 h-4" />
          Open Source
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
