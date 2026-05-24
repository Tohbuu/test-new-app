import { NextResponse } from 'next/server';

import { loadLibrarySnapshot } from '@/lib/library';
import type { LibraryProviderName } from '@/lib/library';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const provider = (new URL(request.url).searchParams.get('provider') as LibraryProviderName | null) ?? undefined;
  const snapshot = await loadLibrarySnapshot(provider);

  return NextResponse.json(snapshot);
}