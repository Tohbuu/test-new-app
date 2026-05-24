import type { PlaylistItem, MangaItem } from '@/lib/catalog';

type MediaCardProps = {
  item: PlaylistItem | MangaItem;
  variant: 'anime' | 'manga';
};

export function MediaCard({ item, variant }: MediaCardProps) {
  if (variant === 'anime') {
    const anime = item as PlaylistItem;
    return (
      <article className="group rounded-[1.5rem] border border-white/10 bg-ink-900/60 p-5 transition-transform duration-200 hover:-translate-y-1 hover:border-aurora-300/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-ember-300">Anime playlist</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{anime.title}</h3>
            <p className="mt-1 text-sm text-ink-300">{anime.studio}</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-100">{anime.episodeCount} eps</span>
        </div>
        <p className="mt-4 text-sm text-ink-200">{anime.progress}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {anime.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-ink-100">
              {tag}
            </span>
          ))}
        </div>
      </article>
    );
  }

  const manga = item as MangaItem;
  const accentRing =
    manga.accent === 'ember' ? 'border-ember-300/30 text-ember-200' : manga.accent === 'aurora' ? 'border-aurora-300/30 text-aurora-200' : 'border-white/10 text-white';

  return (
    <article className={`rounded-[1.5rem] border bg-ink-900/60 p-5 transition-transform duration-200 hover:-translate-y-1 ${accentRing}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-aurora-300">Manga reader</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{manga.title}</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-100">{manga.volume}</span>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-ink-200">
        <span>{manga.chapter}</span>
        <span>{manga.status}</span>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-aurora-400 to-ember-400" />
      </div>
    </article>
  );
}
