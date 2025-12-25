
export interface YouTubeVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  author: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  transcript?: string;
  polishedTranscript?: string;
}

export interface PlaylistData {
  id: string;
  title: string;
  videos: YouTubeVideo[];
  processedCount: number;
}

export type ViewState = 'dashboard' | 'import' | 'library' | 'settings' | 'mcp';
