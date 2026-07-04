import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cookies } from 'next/headers';

import './globals.css';
import { resolveTheme } from '@/lib/theme';

export const metadata: Metadata = {
  title: 'AniTail Forge',
  description: 'A base shell for anime playlists and manga reading.',
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const initialTheme = resolveTheme(cookieStore.get('animetail-forge-theme')?.value);

  return (
    <html lang="en" data-scroll-behavior="smooth" data-theme={initialTheme}>
      <body>{children}</body>
    </html>
  );
}
