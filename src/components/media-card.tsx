"use client";

import Link from 'next/link';

import type { LibraryCatalogEntry } from '@/lib/anime-repo';

type MediaCardProps = {
  item: LibraryCatalogEntry;
  variant: 'anime' | 'manga';
  href?: string;
};

export function MediaCard({ item, variant, href }: MediaCardProps) {
  const accentRing =
    variant === 'anime' ? 'border-aurora-300/30 text-aurora-200' : item.nsfw ? 'border-ember-300/30 text-ember-200' : 'border-white/10 text-white';
  const sourceUrl = item.primarySource?.baseUrl?.trim();

  const card = (
    <article className={`relative rounded-[1.5rem] border bg-ink-900/60 p-5 transition-transform duration-200 hover:-translate-y-1 ${accentRing}`}>
      {href ? (
        <Link href={href} aria-label={`Open ${item.name} details`} className="absolute inset-0 z-0 rounded-[1.5rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900" />
      ) : null}

      <div className="relative z-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-aurora-300">
            {variant === 'anime' ? 'Anime source' : 'Manga source'}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">{item.name}</h3>
          <p className="mt-1 text-sm text-ink-300">{item.pkg}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-100">v{item.version}</span>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-ink-200">
        <span>{item.lang}</span>
        <span>{item.sourceCount} sources</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink-100">
        <span className="rounded-full bg-white/5 px-3 py-1">code {item.code}</span>
        <span className="rounded-full bg-white/5 px-3 py-1">{item.nsfw ? 'nsfw' : 'safe'}</span>
      </div>
      <div className="mt-5 truncate rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-ink-200">
        {sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="relative z-10 block truncate transition hover:text-white hover:underline"
          >
            {sourceUrl}
          </a>
        ) : (
          'No source url'
        )}
      </div>
      </div>
    </article>
  );

  return card;
}
