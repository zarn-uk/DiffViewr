"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

const REPO_URL = "https://github.com/imhassanhumayun/DiffViewr";

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.51.47-3.16-.63-3.36-1.21-.11-.3-.6-1.21-1.03-1.45-.35-.19-.85-.66-.01-.67.79-.01 1.35.75 1.54 1.06.9 1.56 2.34 1.12 2.91.85.09-.67.35-1.12.64-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.28 9.28 0 0 1 12 6.99c.85 0 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.14 10.14 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

export function SiteHeader() {
  const docsRef = useRef<HTMLDetailsElement | null>(null);
  const mobileRef = useRef<HTMLDetailsElement | null>(null);

  const allMenus = useMemo(
    () => [docsRef, mobileRef],
    []
  );

  function closeAllMenus() {
    for (const ref of allMenus) {
      if (ref.current) ref.current.open = false;
    }
  }

  function closeOtherMenus(except: { current: HTMLDetailsElement | null }) {
    for (const ref of allMenus) {
      if (ref === except) continue;
      if (ref.current) ref.current.open = false;
    }
  }

  useEffect(() => {
    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      const insideAny = allMenus.some((ref) => ref.current?.contains(target));
      if (!insideAny) closeAllMenus();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAllMenus();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [allMenus]);

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-[rgba(255,255,255,0.05)] bg-[#080d12]/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-screen items-center justify-between gap-4 px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 no-underline">
            <img
              src="/brand/diffviewr-mark.svg"
              alt="DiffViewr"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="font-display text-[16px] font-semibold tracking-[-0.2px] text-[var(--text)]">
              DiffViewr
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-1 text-[14px] leading-none">
            <a
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 font-mono text-[12px] font-semibold text-[var(--text)] no-underline transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:shadow-[0_0_24px_rgba(34,211,238,0.16)]"
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
              <span>Star</span>
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] text-cyan-200">1.2k</span>
            </a>

            <details
              ref={docsRef}
              className="site-menu"
              onToggle={() => {
                if (docsRef.current?.open) closeOtherMenus(docsRef);
              }}
            >
              <summary className="site-menu-trigger">Docs</summary>
              <div className="site-menu-panel" role="menu">
                <Link
                  className="site-menu-item"
                  href="/docs/overview"
                  role="menuitem"
                  onClick={closeAllMenus}
                >
                  Overview
                </Link>
              </div>
            </details>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/tool"
            className="text-[13px] font-semibold text-[var(--muted)] transition hover:text-cyan-300 sm:text-[14px]"
          >
            Launch App
          </Link>
          <details
            ref={mobileRef}
            className="site-menu md:hidden"
            onToggle={() => {
              if (mobileRef.current?.open) closeOtherMenus(mobileRef);
            }}
          >
            <summary className="site-menu-trigger">Menu</summary>
            <div className="site-menu-panel" role="menu">
              <a
                className="site-menu-item"
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                onClick={closeAllMenus}
              >
                GitHub
              </a>
              <div className="mt-1 px-2 py-1 text-[12px] uppercase tracking-[1.8px] text-[var(--muted)]">
                Docs
              </div>
              <Link
                className="site-menu-item"
                href="/docs/overview"
                role="menuitem"
                onClick={closeAllMenus}
              >
                Overview
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
