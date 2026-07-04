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
    variant === 'anime'
      ? 'border-[color:var(--accent-soft)] text-[color:var(--accent)]'
      : item.nsfw
        ? 'border-[color:var(--warning-soft)] text-[color:var(--warning)]'
        : 'border-[color:var(--border-subtle)] text-[color:var(--text-primary)]';
  const sourceUrl = item.primarySource?.baseUrl?.trim();

  const card = (
    <article className={`relative overflow-hidden rounded-[1.5rem] border bg-[color:var(--surface-strong)] p-5 transition-transform duration-200 hover:-translate-y-1 ${accentRing}`}>
      {href ? (
        <Link
          href={href}
          aria-label={`Open ${item.name} details`}
          className="absolute inset-0 z-0 rounded-[1.5rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--page-bg-bottom)]"
        />
      ) : null}

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--accent)]">
              {variant === 'anime' ? 'Anime source' : 'Manga source'}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[color:var(--text-primary)]">{item.name}</h3>
            <p className="mt-1 text-sm text-[color:var(--text-muted)]">{item.pkg}</p>
          </div>
          <span className="rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-3 py-1 text-xs text-[color:var(--text-primary)]">
            v{item.version}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-[color:var(--text-muted)]">
          <span>{item.lang}</span>
          <span>{item.sourceCount} sources</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-[color:var(--text-primary)]">
          <span className="rounded-full bg-[color:var(--surface-soft)] px-3 py-1">code {item.code}</span>
          <span className="rounded-full bg-[color:var(--surface-soft)] px-3 py-1">{item.nsfw ? 'nsfw' : 'safe'}</span>
        </div>
        <div className="mt-5 truncate rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-3 py-2 text-xs text-[color:var(--text-muted)]">
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="relative z-10 block truncate transition hover:text-[color:var(--text-primary)] hover:underline"
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
