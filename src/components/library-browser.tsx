'use client';

import { useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { MediaCard } from '@/components/media-card';
import { SectionPanel } from '@/components/section-panel';
import { buildCatalogSearchString, type CatalogViewState, type CategoryFilter, type SafetyFilter } from '@/lib/catalog-query';
import { slugifyLibraryEntry } from '@/lib/anime-repo';
import type { LibraryCatalogEntry, LibrarySnapshot } from '@/lib/library';

type LibraryBrowserProps = {
  snapshot: LibrarySnapshot;
  animeEntries: LibraryCatalogEntry[];
  mangaEntries: LibraryCatalogEntry[];
  viewState: CatalogViewState;
};

export function LibraryBrowser({ snapshot, animeEntries, mangaEntries, viewState }: LibraryBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(viewState.query);
  const [category, setCategory] = useState<CategoryFilter>(viewState.category);
  const [safety, setSafety] = useState<SafetyFilter>(viewState.safety);

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...animeEntries, ...mangaEntries].filter((entry) => {
      const matchesCategory = category === 'all' || entry.category === category;
      const matchesSafety =
        safety === 'all' || (safety === 'nsfw' ? Boolean(entry.nsfw) : !entry.nsfw);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [entry.name, entry.pkg, entry.version, entry.lang, entry.primarySource?.name ?? '', entry.primarySource?.baseUrl ?? '']
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesSafety && matchesQuery;
    });
  }, [animeEntries, category, mangaEntries, query, safety]);

  const animeCount = animeEntries.length;
  const mangaCount = mangaEntries.length;
  const animeSearchString = buildCatalogSearchString({ provider: 'anime-repo', query, category, safety });
  const mangaSearchString = buildCatalogSearchString({ provider: 'manga-repo', query, category, safety });

  const updateProvider = (nextProvider: string) => {
    const nextSearch = buildCatalogSearchString({
      provider:
        nextProvider === 'mock' ? 'mock' : nextProvider === 'manga-repo' ? 'manga-repo' : 'anime-repo',
      query,
      category,
      safety,
    });

    startTransition(() => {
      router.replace(`${pathname}${nextSearch}`);
    });
  };

  const updateViewState = (nextState: Partial<CatalogViewState>) => {
    const nextSearch = buildCatalogSearchString({
      provider: viewState.provider,
      query,
      category,
      safety,
      ...nextState,
    });

    startTransition(() => {
      router.replace(`${pathname}${nextSearch}`);
    });
  };

  return (
    <>
      <section className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(27,47,62,0.96),rgba(8,12,20,0.96))] p-6 shadow-glow backdrop-blur-xl sm:p-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ember-300">Base shell</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Browse the live extension catalog with search, filters, and provider switching.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-ink-200">
                Search the shell source, while anime and manga lanes stay locked to their own providers for stable category browsing.
              </p>
            </div>
            <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-ink-900/70 p-4 sm:min-w-56">
              {snapshot.stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.28em] text-ink-300">{stat.label}</p>
                  <p className="mt-2 text-lg font-medium text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {snapshot.readerNotes.map((note) => (
              <div key={note} className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4 text-sm text-ink-100">
                {note}
              </div>
            ))}
          </div>
        </div>

        <SectionPanel
          eyebrow="Control center"
          title="Index navigation and quick access"
          description="Search, filters, and provider switching control the shell summary; category lanes stay pinned to their own sources."
          className="h-full"
        >
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm text-ink-100">
              <span>Search catalog</span>
              <input
                value={query}
                onChange={(event) => {
                  const nextQuery = event.target.value;
                  setQuery(nextQuery);
                  updateViewState({ query: nextQuery });
                }}
                placeholder="Search name, package, version, or source..."
                className="rounded-2xl border border-white/10 bg-ink-900/70 px-4 py-3 text-white outline-none placeholder:text-ink-400 focus:border-aurora-300/60"
              />
            </label>

            <label className="grid gap-2 text-sm text-ink-100">
              <span>Provider</span>
              <select
                value={viewState.provider}
                onChange={(event) => updateProvider(event.target.value)}
                className="rounded-2xl border border-white/10 bg-ink-900/70 px-4 py-3 text-white outline-none focus:border-aurora-300/60"
              >
                <option value="anime-repo">anime-repo (live)</option>
                <option value="manga-repo">manga-repo (live)</option>
                <option value="mock">mock (local fallback)</option>
              </select>
            </label>

            <div className="grid gap-2">
              <span className="text-sm text-ink-100">Category</span>
              <div className="grid grid-cols-3 gap-2">
                {(['all', 'anime', 'manga'] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setCategory(item);
                      updateViewState({ category: item });
                    }}
                    className={`rounded-2xl border px-3 py-3 text-sm transition ${
                      category === item
                        ? 'border-aurora-300/60 bg-aurora-400/20 text-white'
                        : 'border-white/10 bg-white/5 text-ink-100 hover:border-aurora-300/40'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <span className="text-sm text-ink-100">Safety</span>
              <div className="grid grid-cols-3 gap-2">
                {(['all', 'safe', 'nsfw'] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSafety(item);
                      updateViewState({ safety: item });
                    }}
                    className={`rounded-2xl border px-3 py-3 text-sm transition ${
                      safety === item
                        ? 'border-ember-300/60 bg-ember-400/20 text-white'
                        : 'border-white/10 bg-white/5 text-ink-100 hover:border-ember-300/40'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-ink-100">
              Showing {filteredEntries.length} of {animeCount + mangaCount} entries {isPending ? '(loading provider...)' : ''}
            </div>
          </div>
        </SectionPanel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <SectionPanel
          eyebrow="Anime"
          title="Anime extension sources"
          description="These anime-only cards stay pinned to the anime provider so the lane stays stable as the catalog grows."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {filteredEntries
              .filter((item) => item.category === 'anime')
              .slice(0, 6)
              .map((item) => (
                <MediaCard key={item.pkg} item={item} variant="anime" href={`/library/anime/${slugifyLibraryEntry(item)}${animeSearchString}`} />
              ))}
          </div>
        </SectionPanel>

        <SectionPanel
          eyebrow="Manga"
          title="Manga extension sources"
          description="These manga-only cards stay pinned to the manga provider so the reader lane remains distinct."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {filteredEntries
              .filter((item) => item.category === 'manga')
              .slice(0, 4)
              .map((item) => (
                <MediaCard key={item.pkg} item={item} variant="manga" href={`/library/manga/${slugifyLibraryEntry(item)}${mangaSearchString}`} />
              ))}
          </div>
        </SectionPanel>
      </section>
    </>
  );
}