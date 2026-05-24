A Next.js base for an anime and manga library app powered by the Yuzōnō extension index.

## What is in place

- App Router structure in `src/app`
- Shared UI primitives in `src/components`
- Live catalog parser for `https://raw.githubusercontent.com/yuzono/anime-repo/repo/index.min.json`
- Shared library source and API layer in `src/lib/library.ts` and `src/app/api/library`
- Tailwind v4 styling with a custom visual theme

## API endpoints

- `GET /api/library`
- `GET /api/library/anime`
- `GET /api/library/manga`

Set `LIBRARY_PROVIDER=mock` to keep using the local fallback data source, or `ANIME_REPO_INDEX_URL` to point at a different index JSON.

## Run it

```bash
npm run dev
```

## Next steps

Wire in search, filters, provider switching, and richer detail views for the live source catalog.
