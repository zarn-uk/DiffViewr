"use client";

import { useEffect, useId, useMemo, useState } from "react";

type ThemePref = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

function resolveTheme(pref: ThemePref): ResolvedTheme {
  if (pref === "light" || pref === "dark") return pref;
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(pref: ThemePref) {
  const resolved = resolveTheme(pref);
  const root = document.documentElement;
  root.setAttribute("data-theme", resolved);
  root.setAttribute("data-theme-pref", pref);
  root.style.colorScheme = resolved;
}

function readThemePref(): ThemePref {
  try {
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {
    // ignore
  }
  const attr = document.documentElement.getAttribute("data-theme-pref");
  if (attr === "light" || attr === "dark" || attr === "system") return attr;
  return "system";
}

export function ThemeSelector() {
  const selectId = useId();
  const [pref, setPref] = useState<ThemePref>("system");

  useEffect(() => {
    setPref(readThemePref());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pref !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const onChange = () => applyTheme("system");
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, [pref]);

  const label = useMemo(() => {
    switch (pref) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
      default:
        return "System";
    }
  }, [pref]);

  return (
    <div className="inline-flex items-center gap-2">
      <label htmlFor={selectId} className="sr-only">
        Theme
      </label>
      <select
        id={selectId}
        value={pref}
        onChange={(e) => {
          const next = e.target.value as ThemePref;
          setPref(next);
          try {
            window.localStorage.setItem("theme", next);
          } catch {
            // ignore
          }
          applyTheme(next);
        }}
        aria-label={`Theme: ${label}`}
        className="h-9 rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_90%,transparent)] px-2 text-sm text-[var(--text)] shadow-[var(--shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}

