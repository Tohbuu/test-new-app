import { notFound } from 'next/navigation';
import Link from 'next/link';

import { SectionPanel } from '@/components/section-panel';
import { buildCatalogSearchString, parseCatalogViewState } from '@/lib/catalog-query';
import { slugMatchesEntry } from '@/lib/anime-repo';
import { isLibraryKind, loadLibrarySnapshot, resolveLibraryProviderForKind } from '@/lib/library';

export const dynamic = 'force-dynamic';

type DetailPageProps = {
  params: Promise<{ kind: string; slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function formatBoolean(value: number) {
  return value ? 'NSFW' : 'Safe';
}

export default async function LibraryEntryPage({ params, searchParams }: DetailPageProps) {
  const { kind, slug } = await params;
  if (!isLibraryKind(kind)) {
    notFound();
  }

  const resolvedSearchParams = (await Promise.resolve(searchParams)) ?? {};
  const { query, category, safety } = parseCatalogViewState(resolvedSearchParams);
  const provider = resolveLibraryProviderForKind(kind);
  const snapshot = await loadLibrarySnapshot(provider.name);

  const entry = [...snapshot.anime, ...snapshot.manga].find((candidate) => candidate.category === kind && slugMatchesEntry(slug, candidate));

  if (!entry) {
    notFound();
  }

  return (
    <main className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade bg-[size:48px_48px] opacity-[0.08]" />
      <div className="relative mx-auto min-h-screen w-full max-w-5xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-aurora-300">AniTail Forge</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{entry.name}</h1>
          <p className="mt-3 text-sm text-ink-200">{entry.pkg}</p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-ink-100">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Category provider: {provider.name}</span>
            <Link href={`/${buildCatalogSearchString({ provider: provider.name, query, category, safety })}`} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:border-aurora-300/40">
              Back to catalog
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-ink-900/70 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.28em] text-ink-300">Category</p>
              <p className="mt-2 text-white">{entry.category}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink-900/70 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.28em] text-ink-300">Version</p>
              <p className="mt-2 text-white">v{entry.version}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink-900/70 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.28em] text-ink-300">Safety</p>
              <p className="mt-2 text-white">{formatBoolean(entry.nsfw)}</p>
            </div>
          </div>

          <SectionPanel
            eyebrow="Source details"
            title="Primary source and manifest metadata"
            description="This page resolves the live catalog entry by package name so each card can open a stable detail view."
            className="mt-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-ink-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-ink-300">Primary source</p>
                <p className="mt-2 text-white">{entry.primarySource?.name ?? 'Unknown'}</p>
                <p className="mt-1 text-sm text-ink-300">{entry.primarySource?.baseUrl ?? 'No URL'}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-ink-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-ink-300">Sources</p>
                <p className="mt-2 text-white">{entry.sourceCount}</p>
                <p className="mt-1 text-sm text-ink-300">Language: {entry.lang}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {entry.sources.map((source) => (
                <div key={source.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-ink-100">
                  <p className="font-medium text-white">{source.name}</p>
                  <p className="mt-1 text-ink-300">{source.lang}</p>
                  <p className="mt-1 break-all text-ink-300">{source.baseUrl || 'No base URL provided'}</p>
                </div>
              ))}
            </div>
          </SectionPanel>
        </div>
      </div>
    </main>
  );
}