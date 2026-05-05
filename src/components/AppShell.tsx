import type { CSSProperties, ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  reducedMotion: boolean;
  style: CSSProperties;
}

export function AppShell({ children, reducedMotion, style }: AppShellProps) {
  return (
    <div
      className="relative min-h-screen overflow-hidden px-4 py-5 sm:px-6 lg:px-8"
      data-reduced-motion={reducedMotion}
      style={style}
    >
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-1 bg-gradient-to-r from-[var(--game-primary)] via-[var(--game-accent)] to-[var(--game-secondary)] opacity-80" />
      <div className="pointer-events-none fixed left-1/2 top-0 z-0 h-64 w-[min(68rem,90vw)] -translate-x-1/2 rounded-full bg-[color-mix(in_srgb,var(--game-primary)_14%,transparent)] blur-3xl" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5">{children}</div>
    </div>
  );
}
