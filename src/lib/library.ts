import { mangaShelf, playlist, readerNotes, stats } from '@/lib/catalog';
import {
  ANIME_REPO_INDEX_URL,
  MANGA_REPO_INDEX_URL,
  fetchAnimeRepoIndex,
  fetchMangaRepoIndex,
  splitCatalogEntries,
  type LibraryCatalogEntry,
} from '@/lib/anime-repo';

export type { LibraryCatalogEntry } from '@/lib/anime-repo';

export type LibraryProviderName = 'anime-repo' | 'manga-repo' | 'mock';
export type LibraryKind = 'anime' | 'manga';

export type LibrarySnapshot = {
  provider: LibraryProviderName;
  generatedAt: string;
  sourceUrl: string;
  stats: Array<{ label: string; value: string }>;
  readerNotes: string[];
  anime: LibraryCatalogEntry[];
  manga: LibraryCatalogEntry[];
  total: number;
};

export interface LibraryProvider {
  readonly name: LibraryProviderName;
  getSnapshot(): Promise<LibrarySnapshot>;
  getAnimeLibrary(): Promise<LibraryCatalogEntry[]>;
  getMangaLibrary(): Promise<LibraryCatalogEntry[]>;
}

export function isLibraryKind(value: string): value is LibraryKind {
  return value === 'anime' || value === 'manga';
}

function buildStats(animeCount: number, mangaCount: number, totalCount: number) {
  return [
    { label: 'Catalog total', value: `${totalCount} extensions` },
    { label: 'Anime sources', value: `${animeCount} entries` },
    { label: 'Manga sources', value: `${mangaCount} entries` },
  ];
}

function buildReaderNotes(animeCount: number, mangaCount: number) {
  return [
    `${animeCount} anime extensions available from the live index`,
    `${mangaCount} manga-oriented entries detected in the same catalog`,
    'API layer now proxies the remote repo instead of static placeholders',
  ];
}

async function loadMockSnapshot(): Promise<LibrarySnapshot> {
  const anime = playlist.map((item) => ({
    name: item.title,
    pkg: `mock.${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '.')}`,
    apk: 'mock.apk',
    lang: 'all',
    code: 0,
    version: '1.0.0',
    nsfw: 0,
    sources: [{ name: item.studio, lang: 'all', id: item.title, baseUrl: '' }],
    category: 'anime' as const,
    sourceCount: 1,
    primarySource: { name: item.studio, lang: 'all', id: item.title, baseUrl: '' },
  }));

  const manga = mangaShelf.map((item) => ({
    name: item.title,
    pkg: `mock.${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '.')}`,
    apk: 'mock.apk',
    lang: 'all',
    code: 0,
    version: '1.0.0',
    nsfw: 0,
    sources: [{ name: item.status, lang: 'all', id: item.title, baseUrl: '' }],
    category: 'manga' as const,
    sourceCount: 1,
    primarySource: { name: item.status, lang: 'all', id: item.title, baseUrl: '' },
  }));

  return {
    provider: 'mock',
    generatedAt: new Date().toISOString(),
    sourceUrl: 'local-seed',
    stats,
    readerNotes,
    anime,
    manga,
    total: anime.length + manga.length,
  };
}

async function loadAnimeRepoSnapshot(): Promise<LibrarySnapshot> {
  const entries = await fetchAnimeRepoIndex();
  const { anime, manga, total } = splitCatalogEntries(entries);

  return {
    provider: 'anime-repo',
    generatedAt: new Date().toISOString(),
    sourceUrl: ANIME_REPO_INDEX_URL,
    stats: buildStats(anime.length, manga.length, total),
    readerNotes: buildReaderNotes(anime.length, manga.length),
    anime,
    manga,
    total,
  };
}

async function loadMangaRepoSnapshot(): Promise<LibrarySnapshot> {
  const entries = await fetchMangaRepoIndex();
  const { anime, manga, total } = splitCatalogEntries(entries);

  return {
    provider: 'manga-repo',
    generatedAt: new Date().toISOString(),
    sourceUrl: MANGA_REPO_INDEX_URL,
    stats: buildStats(anime.length, manga.length, total),
    readerNotes: buildReaderNotes(anime.length, manga.length),
    anime,
    manga,
    total,
  };
}

export interface LibraryProvider {
  readonly name: LibraryProviderName;
  getSnapshot(): Promise<LibrarySnapshot>;
  getAnimeLibrary(): Promise<LibraryCatalogEntry[]>;
  getMangaLibrary(): Promise<LibraryCatalogEntry[]>;
}

const mockLibraryProvider: LibraryProvider = {
  name: 'mock',
  getSnapshot: loadMockSnapshot,
  async getAnimeLibrary() {
    return loadMockSnapshot().then((snapshot) => snapshot.anime);
  },
  async getMangaLibrary() {
    return loadMockSnapshot().then((snapshot) => snapshot.manga);
  },
};

const animeRepoLibraryProvider: LibraryProvider = {
  name: 'anime-repo',
  getSnapshot: loadAnimeRepoSnapshot,
  async getAnimeLibrary() {
    return loadAnimeRepoSnapshot().then((snapshot) => snapshot.anime);
  },
  async getMangaLibrary() {
    return loadAnimeRepoSnapshot().then((snapshot) => snapshot.manga);
  },
};

const mangaRepoLibraryProvider: LibraryProvider = {
  name: 'manga-repo',
  getSnapshot: loadMangaRepoSnapshot,
  async getAnimeLibrary() {
    return loadMangaRepoSnapshot().then((snapshot) => snapshot.anime);
  },
  async getMangaLibrary() {
    return loadMangaRepoSnapshot().then((snapshot) => snapshot.manga);
  },
};

const providers: Record<LibraryProviderName, LibraryProvider> = {
  'anime-repo': animeRepoLibraryProvider,
  'manga-repo': mangaRepoLibraryProvider,
  mock: mockLibraryProvider,
};

export function getLibraryProvider() {
  const providerName = (process.env.LIBRARY_PROVIDER as LibraryProviderName | undefined) ?? 'anime-repo';
  return providers[providerName] ?? animeRepoLibraryProvider;
}

export function resolveLibraryProvider(providerName?: LibraryProviderName) {
  if (!providerName) {
    return getLibraryProvider();
  }

  return providers[providerName] ?? animeRepoLibraryProvider;
}

export function resolveLibraryProviderForKind(kind: LibraryKind) {
  return kind === 'manga' ? mangaRepoLibraryProvider : animeRepoLibraryProvider;
}

export async function loadLibrarySnapshot(preferredProvider?: LibraryProviderName) {
  try {
    const provider = resolveLibraryProvider(preferredProvider);
    return await provider.getSnapshot();
  } catch {
    return loadMockSnapshot();
  }
}

export async function loadAnimeLibrary() {
  try {
    return await animeRepoLibraryProvider.getAnimeLibrary();
  } catch {
    return loadMockSnapshot().then((snapshot) => snapshot.anime);
  }
}

export async function loadMangaLibrary() {
  try {
    return await mangaRepoLibraryProvider.getMangaLibrary();
  } catch {
    return loadMockSnapshot().then((snapshot) => snapshot.manga);
  }
}