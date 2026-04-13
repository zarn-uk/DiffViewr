"use client";

import { useEffect, useRef } from "react";
import type { CompareResult } from "@/lib/diff/types";
import { VisualComparePanel } from "@/components/compare/visual-compare-panel";

type Props = {
  panelClass: string;
  inputClass: string;
  buttonBase: string;
  buttonPrimary: string;
  activeTab: "result" | "compare";
  setActiveTab: (tab: "result" | "compare") => void;
  resultText: string | null;
  compare: CompareResult | null;
  outputMaximized: boolean;
  setOutputMaximized: (v: boolean) => void;
  onMaximize: () => void;
};

export function OutputSection({
  panelClass,
  inputClass,
  buttonBase,
  buttonPrimary,
  activeTab,
  setActiveTab,
  resultText,
  compare,
  outputMaximized,
  setOutputMaximized,
  onMaximize
}: Props) {
  const outputPanelRef = useRef<HTMLElement | null>(null);

  const isOutputVisible = Boolean(resultText || compare);

  useEffect(() => {
    if (!outputMaximized) return;
    if (typeof document === "undefined") return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOutputMaximized(false);
    };

    document.addEventListener("keydown", onKeyDown);
    requestAnimationFrame(() => {
      outputPanelRef.current?.focus?.();
    });

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [outputMaximized, setOutputMaximized]);

  if (!isOutputVisible) return null;

  const content = (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex flex-wrap gap-2">
          <button
            className={activeTab === "result" ? buttonPrimary : buttonBase}
            onClick={() => setActiveTab("result")}
            type="button"
          >
            Reordered Result
          </button>
          <button
            className={activeTab === "compare" ? buttonPrimary : buttonBase}
            onClick={() => setActiveTab("compare")}
            type="button"
          >
            Visual Compare
          </button>
        </div>
        {outputMaximized ? (
          <button className={buttonBase} type="button" onClick={() => setOutputMaximized(false)}>
            Exit
          </button>
        ) : (
          <button className={buttonBase} type="button" onClick={onMaximize} aria-label="Maximize output panel">
            Maximize
          </button>
        )}
      </div>

      {activeTab === "result" ? (
        <>
          <h2 className="text-sm text-[var(--muted)] font-semibold mb-2">4) Reordered Result</h2>
          <div className="mb-2 text-[13px] text-[var(--muted)] leading-relaxed">
            This is <strong>Target JSON (B)</strong> with only the <strong>ordering</strong>{" "}
            adjusted to match <strong>Reference JSON (A)</strong> (diff-friendly). No data is merged from A into B.
          </div>
          <textarea
            className={`${inputClass} ${outputMaximized ? "min-h-[60vh]" : "min-h-[260px]"}`}
            value={resultText ?? ""}
            readOnly
            placeholder="Reordered JSON appears here."
            spellCheck={false}
          />
        </>
      ) : (
        <>
          <h2 className="text-sm text-[var(--muted)] font-semibold mb-2">4) Visual Compare</h2>
          {compare ? (
            <VisualComparePanel result={compare} />
          ) : (
            <div className="text-[13px] text-[var(--muted)]">
              Run <strong>Sort & Compare</strong> to see differences.
            </div>
          )}
        </>
      )}
    </>
  );

  if (outputMaximized) {
    return (
      <div
        className="fixed inset-0 z-40 bg-black/40 p-4 md:p-6"
        role="presentation"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) setOutputMaximized(false);
        }}
      >
        <section
          ref={outputPanelRef}
          tabIndex={-1}
          aria-label="Output panel"
          className={`${panelClass} h-full overflow-auto`}
        >
          {content}
        </section>
      </div>
    );
  }

  return <section className={`${panelClass} mt-4`}>{content}</section>;
}

