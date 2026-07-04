"use client";

import type { ReactNode } from 'react';

type SectionPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
};

export function SectionPanel({ eyebrow, title, description, children, className = '' }: SectionPanelProps) {
  return (
    <section className={`flex min-h-0 flex-col overflow-hidden rounded-[2rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface)] p-6 shadow-glow backdrop-blur-xl ${className}`.trim()}>
      <div className="mb-6 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--accent)]">{eyebrow}</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-3xl">{title}</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--text-muted)]">{description}</p>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  );
}
