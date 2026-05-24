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
    <section className={`rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl ${className}`.trim()}>
      <div className="mb-6 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-aurora-300">{eyebrow}</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-ink-200">{description}</p>
      </div>
      {children}
    </section>
  );
}
