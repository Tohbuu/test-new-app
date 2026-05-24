export type AnimeRepoSource = {
  name: string;
  lang: string;
  id: string;
  baseUrl: string;
};

export type AnimeRepoIndexEntry = {
  name: string;
  pkg: string;
  apk: string;
  lang: string;
  code: number;
  version: string;
  nsfw: number;
  sources: AnimeRepoSource[];
};

export type LibraryCategory = 'anime' | 'manga';

export type LibraryCatalogEntry = AnimeRepoIndexEntry & {
  category: LibraryCategory;
  sourceCount: number;
  primarySource: AnimeRepoSource | null;
};

export const ANIME_REPO_INDEX_URL =
  process.env.ANIME_REPO_INDEX_URL ?? 'https://raw.githubusercontent.com/yuzono/anime-repo/repo/index.min.json';

export const MANGA_REPO_INDEX_URL =
  process.env.MANGA_REPO_INDEX_URL ?? 'https://raw.githubusercontent.com/yuzono/manga-repo/repo/index.min.json';

function isMangaEntry(entry: AnimeRepoIndexEntry) {
  return /manga/i.test(entry.name) || /manga/i.test(entry.pkg);
}

export function mapRepoEntry(entry: AnimeRepoIndexEntry): LibraryCatalogEntry {
  return {
    ...entry,
    category: isMangaEntry(entry) ? 'manga' : 'anime',
    sourceCount: entry.sources.length,
    primarySource: entry.sources[0] ?? null,
  };
}

export async function fetchAnimeRepoIndex(): Promise<AnimeRepoIndexEntry[]> {
  const response = await fetch(ANIME_REPO_INDEX_URL, {
    cache: 'no-store',
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load anime repo index (${response.status})`);
  }

  const data = (await response.json()) as unknown;

  if (!Array.isArray(data)) {
    throw new Error('Anime repo index did not return an array');
  }

  return data as AnimeRepoIndexEntry[];
}

export async function fetchMangaRepoIndex(): Promise<AnimeRepoIndexEntry[]> {
  const response = await fetch(MANGA_REPO_INDEX_URL, {
    cache: 'no-store',
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load manga repo index (${response.status})`);
  }

  const data = (await response.json()) as unknown;

  if (!Array.isArray(data)) {
    throw new Error('Manga repo index did not return an array');
  }

  return data as AnimeRepoIndexEntry[];
}

export function splitCatalogEntries(entries: AnimeRepoIndexEntry[]) {
  const catalogEntries = entries.map(mapRepoEntry);

  return {
    anime: catalogEntries.filter((entry) => entry.category === 'anime'),
    manga: catalogEntries.filter((entry) => entry.category === 'manga'),
    total: catalogEntries.length,
  };
}

export function slugifyLibraryEntry(entry: Pick<AnimeRepoIndexEntry, 'pkg' | 'name'>) {
  return encodeURIComponent(entry.pkg);
}

export function slugMatchesEntry(slug: string, entry: Pick<AnimeRepoIndexEntry, 'pkg' | 'name'>) {
  const normalizedSlug = decodeURIComponent(slug);
  return normalizedSlug === entry.pkg || normalizedSlug === entry.name || slugifyLibraryEntry(entry) === slug;
}