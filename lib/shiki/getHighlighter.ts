"use client";

import { createBundledHighlighter } from "@shikijs/core";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";
import type { HighlighterGeneric } from "@shikijs/types";

export type ThemeName = "github-light" | "dark-plus";
export type ShikiLang = "json" | "yaml" | "dotenv";

export type ShikiToken = {
  content: string;
  color?: string;
};

export type ShikiTokenLine = ShikiToken[];

type ShikiHighlighterLike = HighlighterGeneric<ShikiLang, ThemeName>;

let cachedHighlighterPromise: Promise<ShikiHighlighterLike> | null = null;
let cachedThemePair: [ThemeName, ThemeName] | null = null;

const createHighlighter = createBundledHighlighter<ShikiLang, ThemeName>({
  langs: {
    json: () => import("@shikijs/langs/json"),
    yaml: () => import("@shikijs/langs/yaml"),
    dotenv: () => import("@shikijs/langs/dotenv")
  },
  themes: {
    "github-light": () => import("@shikijs/themes/github-light"),
    "dark-plus": () => import("@shikijs/themes/dark-plus")
  },
  engine: () => createJavaScriptRegexEngine()
});

export async function getShikiHighlighter(): Promise<ShikiHighlighterLike> {
  if (cachedHighlighterPromise) return cachedHighlighterPromise;

  cachedHighlighterPromise = (async () => {
    const themePair: [ThemeName, ThemeName] = ["github-light", "dark-plus"];
    const highlighter = await createHighlighter({
      themes: themePair,
      langs: ["json", "yaml", "dotenv"]
    });
    cachedThemePair = themePair;
    return highlighter;
  })();

  return cachedHighlighterPromise;
}

export function getCachedShikiThemePair(): [ThemeName, ThemeName] | null {
  return cachedThemePair;
}

function normalizeTokenLine(line: unknown): ShikiTokenLine {
  if (!Array.isArray(line)) return [{ content: String(line ?? "") }];
  return line
    .map((t) => {
      if (!t || typeof t !== "object") return { content: String(t ?? "") };
      const tok = t as Record<string, unknown>;
      const content = typeof tok.content === "string" ? tok.content : String(tok.content ?? "");
      const color = typeof tok.color === "string" ? tok.color : undefined;
      return { content, color };
    })
    .filter((t) => t.content.length > 0);
}

export async function shikiTokenizeLines(opts: {
  code: string;
  theme: ThemeName;
  lang?: ShikiLang;
}): Promise<ShikiTokenLine[]> {
  const lang = opts.lang ?? "json";
  const highlighter = await getShikiHighlighter();
  const h = highlighter as unknown as Record<string, unknown>;

  if (typeof h.codeToThemedTokens === "function") {
    const raw = (h.codeToThemedTokens as (code: string, o: { lang: string; theme: string }) => unknown)(
      opts.code,
      { lang, theme: opts.theme },
    );
    if (Array.isArray(raw)) return raw.map(normalizeTokenLine);
  }

  if (typeof h.codeToTokens === "function") {
    const raw = (h.codeToTokens as (code: string, o: { lang: string; theme?: string }) => unknown)(
      opts.code,
      { lang, theme: opts.theme },
    );
    if (Array.isArray(raw)) return raw.map(normalizeTokenLine);
    if (raw && typeof raw === "object") {
      const tokens = (raw as Record<string, unknown>).tokens;
      if (Array.isArray(tokens)) return tokens.map(normalizeTokenLine);
    }
  }

  // Fallback: no token API detected; return plain text lines.
  return opts.code.split(/\r?\n/).map((content) => [{ content }]);
}

export async function shikiTokenizeLinesForMode(opts: {
  code: string;
  mode: "light" | "dark";
  lang?: ShikiLang;
}): Promise<ShikiTokenLine[]> {
  await getShikiHighlighter();
  const pair = getCachedShikiThemePair();
  const theme: ThemeName = opts.mode === "light" ? (pair?.[0] ?? "github-light") : (pair?.[1] ?? "dark-plus");
  return shikiTokenizeLines({ code: opts.code, theme, lang: opts.lang });
}
