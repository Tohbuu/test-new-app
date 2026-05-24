import { NextResponse } from 'next/server';

import { loadAnimeLibrary } from '@/lib/library';

export const dynamic = 'force-dynamic';

export async function GET() {
  const anime = await loadAnimeLibrary();

  return NextResponse.json({ provider: 'anime-repo', anime });
}