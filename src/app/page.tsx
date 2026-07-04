import { LibraryBrowser } from '@/components/library-browser';
import { parseCatalogViewState } from '@/lib/catalog-query';
import { loadAnimeLibrary, loadLibrarySnapshot, loadMangaLibrary } from '@/lib/library';
import { resolveTheme } from '@/lib/theme';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

type HomeProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = (await Promise.resolve(searchParams)) ?? {};
  const { provider, query, category, safety } = parseCatalogViewState(resolvedSearchParams);
  const cookieStore = await cookies();
  const initialTheme = resolveTheme(cookieStore.get('animetail-forge-theme')?.value);
  const [library, animeEntries, mangaEntries] = await Promise.all([
    loadLibrarySnapshot(provider),
    loadAnimeLibrary(),
    loadMangaLibrary(),
  ]);

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade bg-[size:48px_48px] opacity-[0.08]" />
      <div className="pointer-events-none absolute inset-0 bg-radial-sheen" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-6 py-5 shadow-glow backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--accent)]">AniTail Forge</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-3xl">Anime and manga library index base</h1>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-[color:var(--text-muted)]">
            <span className="rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface-strong)] px-4 py-2">Live catalog ready</span>
            <span className="rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface-strong)] px-4 py-2">Shell source: {library.provider}</span>
            <span className="rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface-strong)] px-4 py-2">Category lanes fixed</span>
            <span className="rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface-strong)] px-4 py-2">Reader mode</span>
          </div>
        </header>
        <LibraryBrowser
          snapshot={library}
          animeEntries={animeEntries}
          mangaEntries={mangaEntries}
          viewState={{ provider, query, category, safety }}
          initialTheme={initialTheme}
        />
      </div>
    </main>
  );
}
