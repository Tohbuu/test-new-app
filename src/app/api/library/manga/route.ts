import { NextResponse } from 'next/server';

import { loadMangaLibrary } from '@/lib/library';

export const dynamic = 'force-dynamic';

export async function GET() {
  const manga = await loadMangaLibrary();

  return NextResponse.json({ provider: 'manga-repo', manga });
}