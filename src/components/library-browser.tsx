'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { MediaCard } from '@/components/media-card';
import { SectionPanel } from '@/components/section-panel';
import { buildCatalogSearchString, type CatalogViewState, type CategoryFilter, type SafetyFilter } from '@/lib/catalog-query';
import { slugifyLibraryEntry } from '@/lib/anime-repo';
import { THEME_COOKIE_KEY, THEME_STORAGE_KEY, themeOptions, type ThemeId } from '@/lib/theme';
import type { LibraryCatalogEntry, LibrarySnapshot } from '@/lib/library';

type LibraryBrowserProps = {
  snapshot: LibrarySnapshot;
  animeEntries: LibraryCatalogEntry[];
  mangaEntries: LibraryCatalogEntry[];
  viewState: CatalogViewState;
  initialTheme: ThemeId;
};

export function LibraryBrowser({ snapshot, animeEntries, mangaEntries, viewState, initialTheme }: LibraryBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(viewState.query);
  const [category, setCategory] = useState<CategoryFilter>(viewState.category);
  const [safety, setSafety] = useState<SafetyFilter>(viewState.safety);
  const [theme, setTheme] = useState<ThemeId>(initialTheme);
  const [previewTheme, setPreviewTheme] = useState<ThemeId>(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    window.localStorage.setItem(THEME_COOKIE_KEY, theme);
    document.cookie = `${THEME_COOKIE_KEY}=${theme}; path=/; max-age=31536000; samesite=lax`;
  }, [theme]);

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

  const animeItems = useMemo(() => filteredEntries.filter((item) => item.category === 'anime'), [filteredEntries]);
  const mangaItems = useMemo(() => filteredEntries.filter((item) => item.category === 'manga'), [filteredEntries]);

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
        <div className="rounded-[2rem] border border-[color:var(--border-subtle)] bg-[linear-gradient(135deg,rgba(27,47,62,0.96),rgba(8,12,20,0.96))] p-6 shadow-glow backdrop-blur-xl sm:p-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--accent)]">Base shell</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-5xl">
                Browse the live extension catalog with search, filters, and provider switching.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--text-muted)]">
                Search the shell source, while anime and manga lanes stay locked to their own providers for stable category browsing.
              </p>
            </div>
            <div className="grid gap-3 rounded-[1.5rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-strong)] p-4 sm:min-w-56">
              {snapshot.stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--text-muted)]">{stat.label}</p>
                  <p className="mt-2 text-lg font-medium text-[color:var(--text-primary)]">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {snapshot.readerNotes.map((note) => (
              <div key={note} className="rounded-[1.25rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-4 py-4 text-sm text-[color:var(--text-primary)]">
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
            <div className="grid gap-3 rounded-[1.5rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] p-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.72fr)] lg:items-stretch">
              <div className="flex min-w-0 flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--accent)]">Theme selector</p>
                  <p className="mt-1 text-sm text-[color:var(--text-muted)]">Pick a Discord-style palette for the whole shell.</p>
                </div>
                  <span className="rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface-strong)] px-3 py-1 text-xs text-[color:var(--text-muted)]" suppressHydrationWarning>
                    {themeOptions.find((option) => option.id === theme)?.label ?? 'Discord'}
                  </span>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                  {themeOptions.map((option) => {
                    const isActive = option.id === theme;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setTheme(option.id);
                          setPreviewTheme(option.id);
                        }}
                        onMouseEnter={() => setPreviewTheme(option.id)}
                        onFocus={() => setPreviewTheme(option.id)}
                        onMouseLeave={() => setPreviewTheme(theme)}
                        aria-pressed={isActive}
                        className={`group flex items-center gap-3 rounded-[1rem] border px-2.5 py-2 text-left transition duration-150 hover:-translate-y-0.5 ${
                          isActive
                            ? 'border-[color:var(--accent)] bg-[color:var(--surface-strong)] shadow-[0_0_0_1px_var(--accent)]'
                            : 'border-[color:var(--border-subtle)] bg-[color:var(--surface-strong)] hover:border-[color:var(--border-strong)]'
                        }`}
                      >
                        <span className="h-8 w-8 shrink-0 rounded-[0.8rem] border border-white/10" style={{ background: option.swatch }} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-[color:var(--text-primary)]">{option.label}</span>
                          <span className="block truncate text-[0.72rem] leading-5 text-[color:var(--text-muted)]">{option.description}</span>
                        </span>
                        {isActive ? (
                          <span className="rounded-full bg-[color:var(--accent-soft)] px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-primary)]">
                            active
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex min-h-0 flex-col gap-3 rounded-[1.25rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-strong)] p-4">
                {(() => {
                  const activeTheme = themeOptions.find((option) => option.id === previewTheme) ?? themeOptions[0];

                  return (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--accent)]">Preview</p>
                          <p className="mt-1 text-sm text-[color:var(--text-muted)]">Hover to preview, click to lock it in.</p>
                        </div>
                        <span className="rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-2.5 py-1 text-[0.72rem] text-[color:var(--text-muted)]">
                          {activeTheme.id === theme ? 'selected' : 'previewing'}
                        </span>
                      </div>

                      <div className="min-h-[11rem] rounded-[1.15rem] border border-[color:var(--border-subtle)] p-4" style={{ background: activeTheme.swatch }}>
                        <div className="flex h-full flex-col justify-between gap-4 rounded-[0.95rem] border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">{activeTheme.label}</p>
                            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">Discord-inspired shell</h3>
                            <p className="mt-2 max-w-xs text-sm leading-6 text-white/80">{activeTheme.description}</p>
                          </div>

                          <div className="flex flex-wrap gap-2 text-[0.72rem] text-white/85">
                            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Adaptive</span>
                            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Scrollable lanes</span>
                            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Persisted</span>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            <label className="grid gap-2 text-sm text-[color:var(--text-primary)]">
              <span>Search catalog</span>
              <input
                value={query}
                onChange={(event) => {
                  const nextQuery = event.target.value;
                  setQuery(nextQuery);
                  updateViewState({ query: nextQuery });
                }}
                placeholder="Search name, package, version, or source..."
                className="rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-strong)] px-4 py-3 text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--accent)]"
              />
            </label>

            <label className="grid gap-2 text-sm text-[color:var(--text-primary)]">
              <span>Provider</span>
              <select
                value={viewState.provider}
                onChange={(event) => updateProvider(event.target.value)}
                className="rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-strong)] px-4 py-3 text-[color:var(--text-primary)] outline-none focus:border-[color:var(--accent)]"
              >
                <option value="anime-repo">anime-repo (live)</option>
                <option value="manga-repo">manga-repo (live)</option>
                <option value="mock">mock (local fallback)</option>
              </select>
            </label>

            <div className="grid gap-2">
              <span className="text-sm text-[color:var(--text-primary)]">Category</span>
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
                        ? 'border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--text-primary)]'
                        : 'border-[color:var(--border-subtle)] bg-[color:var(--surface-strong)] text-[color:var(--text-muted)] hover:border-[color:var(--border-strong)]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <span className="text-sm text-[color:var(--text-primary)]">Safety</span>
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
                        ? 'border-[color:var(--warning)] bg-[color:var(--warning-soft)] text-[color:var(--text-primary)]'
                        : 'border-[color:var(--border-subtle)] bg-[color:var(--surface-strong)] text-[color:var(--text-muted)] hover:border-[color:var(--border-strong)]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-strong)] px-4 py-3 text-sm text-[color:var(--text-muted)]">
              Showing {filteredEntries.length} of {animeCount + mangaCount} entries {isPending ? '(loading provider...)' : ''}. Scroll the lanes below to browse every site.
            </div>
          </div>
        </SectionPanel>
      </section>

      <section className="mt-6 grid min-h-0 gap-6 xl:grid-cols-2 xl:items-start">
        <SectionPanel
          eyebrow="Anime"
          title="Anime extension sources"
          description="These anime-only cards stay pinned to the anime provider so the lane stays stable as the catalog grows."
          className="min-h-0"
        >
          <div className="max-h-[calc(100vh-22rem)] min-h-0 overflow-y-auto pr-2">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              {animeItems.map((item) => (
                <MediaCard key={item.pkg} item={item} variant="anime" href={`/library/anime/${slugifyLibraryEntry(item)}${animeSearchString}`} />
              ))}
            </div>
          </div>
        </SectionPanel>

        <SectionPanel
          eyebrow="Manga"
          title="Manga extension sources"
          description="These manga-only cards stay pinned to the manga provider so the reader lane remains distinct."
          className="min-h-0"
        >
          <div className="max-h-[calc(100vh-22rem)] min-h-0 overflow-y-auto pr-2">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              {mangaItems.map((item) => (
                <MediaCard key={item.pkg} item={item} variant="manga" href={`/library/manga/${slugifyLibraryEntry(item)}${mangaSearchString}`} />
              ))}
            </div>
          </div>
        </SectionPanel>
      </section>
    </>
  );
}