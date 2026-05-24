import type { LibraryProviderName } from '@/lib/library';

export type CategoryFilter = 'all' | 'anime' | 'manga';
export type SafetyFilter = 'all' | 'safe' | 'nsfw';

export type CatalogViewState = {
  provider: LibraryProviderName;
  query: string;
  category: CategoryFilter;
  safety: SafetyFilter;
};

type CatalogSearchSource = Record<string, string | string[] | undefined> | URLSearchParams | null | undefined;

function readQueryValue(source: CatalogSearchSource, key: string): string | undefined {
  if (!source) {
    return undefined;
  }

  if (typeof (source as URLSearchParams).get === 'function') {
    return (source as URLSearchParams).get(key) ?? undefined;
  }

  const value = (source as Record<string, string | string[] | undefined>)[key];
  return Array.isArray(value) ? value[0] : value;
}

function toProvider(value: string | undefined): LibraryProviderName {
  if (value === 'mock') return 'mock';
  if (value === 'manga-repo') return 'manga-repo';
  return 'anime-repo';
}

function toCategory(value: string | undefined): CategoryFilter {
  return value === 'anime' || value === 'manga' ? value : 'all';
}

function toSafety(value: string | undefined): SafetyFilter {
  return value === 'safe' || value === 'nsfw' ? value : 'all';
}

export function parseCatalogViewState(source: CatalogSearchSource): CatalogViewState {
  return {
    provider: toProvider(readQueryValue(source, 'provider')),
    query: readQueryValue(source, 'q') ?? '',
    category: toCategory(readQueryValue(source, 'category')),
    safety: toSafety(readQueryValue(source, 'safety')),
  };
}

export function buildCatalogSearchString(state: Partial<CatalogViewState>): string {
  const params = new URLSearchParams();

  if (state.provider && state.provider !== 'anime-repo') {
    params.set('provider', state.provider);
  }

  const trimmedQuery = state.query?.trim();
  if (trimmedQuery) {
    params.set('q', trimmedQuery);
  }

  if (state.category && state.category !== 'all') {
    params.set('category', state.category);
  }

  if (state.safety && state.safety !== 'all') {
    params.set('safety', state.safety);
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}