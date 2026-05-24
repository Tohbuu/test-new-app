export type PlaylistItem = {
  title: string;
  studio: string;
  episodeCount: number;
  progress: string;
  tags: string[];
};

export type MangaItem = {
  title: string;
  volume: string;
  chapter: string;
  status: string;
  accent: string;
};

export const playlist: PlaylistItem[] = [
  {
    title: 'Skyline Requiem',
    studio: 'Studio Vault',
    episodeCount: 24,
    progress: 'Episode 08 queued',
    tags: ['Action', 'Sci-fi', 'Pinned'],
  },
  {
    title: 'Moon Garden',
    studio: 'Northern Frame',
    episodeCount: 12,
    progress: 'Episode 03 watched',
    tags: ['Slice of life', 'Drama'],
  },
  {
    title: 'Iron Lotus',
    studio: 'Blackglass Works',
    episodeCount: 48,
    progress: 'Episode 19 in progress',
    tags: ['Historical', 'Thriller'],
  },
];

export const mangaShelf: MangaItem[] = [
  {
    title: 'Paper Blade',
    volume: 'Vol. 6',
    chapter: 'Ch. 47',
    status: 'New pages synced',
    accent: 'ember',
  },
  {
    title: 'Silent Atlas',
    volume: 'Vol. 2',
    chapter: 'Ch. 11',
    status: 'Saved for later',
    accent: 'aurora',
  },
  {
    title: 'Midnight Orbit',
    volume: 'Vol. 9',
    chapter: 'Ch. 82',
    status: 'Last read 12m ago',
    accent: 'ink',
  },
];

export const stats = [
  { label: 'Watch queue', value: '18 shows' },
  { label: 'Reader progress', value: '142 chapters' },
  { label: 'Sync status', value: 'Live across devices' },
];

export const readerNotes = [
  'Page snapping for manga spreads',
  'Pinned playlists with episode markers',
  'Offline-safe metadata cache',
];
