"use client";

type Props = {
  buttonClass: string;
  onLoadSample: () => void;
};

export function ToolIntro({ buttonClass, onLoadSample }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-3">

      {/* ── Top row: description + CTA ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">

        {/* Description — plain prose, not a heading */}
        <p className="text-[13px] text-[var(--muted)] leading-relaxed max-w-xl">
          Paste two configs —{" "}
          <span className="text-[var(--text)] font-medium">JSON, YAML, or ENV</span>
          {" "}— and instantly see what changed across environments.
        </p>

        {/* Try an example — elevated, not hidden */}
        <button
  onClick={onLoadSample}
  type="button"
  aria-label="Load an example diff"
  title="Load an example diff"
  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md
             text-[11px] font-medium tracking-wide uppercase
             text-[var(--accent)] border border-[color-mix(in_srgb,var(--accent)_30%,transparent)]
             bg-[color-mix(in_srgb,var(--accent)_6%,transparent)]
             hover:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]
             hover:border-[color-mix(in_srgb,var(--accent)_50%,transparent)]
             transition-all duration-150 cursor-pointer whitespace-nowrap"
>
  <svg
    width="10" height="10" viewBox="0 0 14 14"
    fill="none" aria-hidden="true"
    className="shrink-0"
  >
    <path
      d="M2 7h10M7 2l5 5-5 5"
      stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
  Try an example
</button>

      </div>

      {/* ── Privacy note — inline, unobtrusive ── */}
   <p className="text-[11.5px] text-[var(--muted)] opacity-70 flex items-center gap-1.5">
  <svg
    width="14" height="14" viewBox="0 0 12 12"
    fill="none" aria-hidden="true"
    className="shrink-0 text-[var(--accent)]" 
  >
    <path
      d="M6 1L1.5 3v3.5C1.5 9.1 3.5 11 6 11s4.5-1.9 4.5-4.5V3L6 1z"
      fill="currentColor"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M4.2 6l1.2 1.2 2.4-2.4"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  Processed entirely in your browser — no server, no uploads, no data collected.
</p>

    </div>
  );
}