"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const formatLinks = [
  { href: "/yaml-diff/", label: "YAML" },
  { href: "/json-diff/", label: "JSON" },
  { href: "/env-diff/", label: ".ENV" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const isToolPage = pathname === "/tool" || pathname === "/tool/";

  function handleLogoClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (pathname === "/") {
      e.preventDefault();
      window.history.pushState(null, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-[rgba(255,255,255,0.05)] bg-[#080d12]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-screen items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <Link href="/" onClick={handleLogoClick} className="inline-flex items-center no-underline">
            <Image
              src="/brand/diffviewr-mark.svg"
              alt="DiffViewr"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="hidden font-sans text-[16px] font-medium tracking-[-0.2px] text-[var(--text)] min-[360px]:inline">
              DiffViewr
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 text-[14px] leading-none md:flex">
            <Link
              href="/#features"
              className="site-menu-trigger no-underline font-mono text-[13px] text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            >
              How it works
            </Link>
            <span className="mx-1 h-4 w-px bg-[var(--border)]" aria-hidden="true" />
            {formatLinks.map((link) => {
              const isActive = pathname === link.href.slice(0, -1) || pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "rounded-md px-2 py-1 font-mono text-[12px] no-underline transition-colors",
                    isActive
                      ? "bg-cyan-400/10 text-cyan-300"
                      : "text-[var(--muted)] hover:bg-white/[0.03] hover:text-[var(--text)]"
                  ].join(" ")}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {!isToolPage ? (
          <Link
            href="/tool/"
            className="cyberpunk-button cta inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg px-3.5 py-2 font-sans text-[13px] font-medium focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] sm:px-5 sm:text-[15px]"
          >
            Open Tool
          </Link>
        ) : null}
      </div>
    </header>
  );
}
