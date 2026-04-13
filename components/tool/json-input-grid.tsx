"use client";

type Validation = { ok: boolean; message: string } | null;

type Props = {
  panelClass: string;
  inputClass: string;
  jsonInputSizeClass: string;
  buttonBase: string;
  isOutputVisible: boolean;
  inputsCollapsed: boolean;
  onToggleInputsCollapsed: () => void;
  refText: string;
  setRefText: (v: string) => void;
  targetText: string;
  setTargetText: (v: string) => void;
  validationA: Validation;
  validationB: Validation;
};

export function JsonInputGrid({
  panelClass,
  inputClass,
  jsonInputSizeClass,
  buttonBase,
  isOutputVisible,
  inputsCollapsed,
  onToggleInputsCollapsed,
  refText,
  setRefText,
  targetText,
  setTargetText,
  validationA,
  validationB
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <section className={panelClass}>
        <div className="flex items-center justify-between gap-2 mb-2">
          <label htmlFor="reference-json" className="text-sm text-[var(--muted)] font-semibold">
            1) Reference JSON (A)
          </label>
          {isOutputVisible ? (
            <button
              className={buttonBase}
              type="button"
              aria-expanded={!inputsCollapsed}
              onClick={onToggleInputsCollapsed}
            >
              {inputsCollapsed ? "Expand inputs" : "Collapse inputs"}
            </button>
          ) : null}
        </div>

        {isOutputVisible && inputsCollapsed ? (
          <div className="text-[13px] text-[var(--muted)]">
            Collapsed. Reference has <strong>{refText.length.toLocaleString()}</strong>{" "}
            characters.
          </div>
        ) : (
          <>
            <div id="reference-help" className="mb-2 text-[12.5px] text-[var(--muted)]">
              Used as the ordering template only. Its values are never copied into Target (B).
            </div>
            <textarea
              id="reference-json"
              className={`${inputClass} ${jsonInputSizeClass}`}
              value={refText}
              onChange={(e) => setRefText(e.target.value)}
              placeholder='Paste JSON here. Example: {"items":[{"id":"a"},{"id":"b"}]}'
              spellCheck={false}
              aria-describedby="reference-help"
              aria-invalid={validationA ? !validationA.ok : undefined}
            />
            {validationA ? (
              <div className="mt-2 text-[13px] text-[var(--muted)]">
                {validationA.ok ? "Valid JSON." : validationA.message}
              </div>
            ) : null}
          </>
        )}
      </section>

      <section className={panelClass}>
        <label
          htmlFor="target-json"
          className="text-sm text-[var(--muted)] font-semibold mb-2 block"
        >
          2) Target JSON (B)
        </label>
        {isOutputVisible && inputsCollapsed ? (
          <div className="text-[13px] text-[var(--muted)]">
            Collapsed. Target has <strong>{targetText.length.toLocaleString()}</strong>{" "}
            characters.
          </div>
        ) : (
          <>
            <div id="target-help" className="mb-2 text-[12.5px] text-[var(--muted)]">
              This JSON is reordered to produce the result. Your data stays in B; only ordering
              changes.
            </div>
            <textarea
              id="target-json"
              className={`${inputClass} ${jsonInputSizeClass}`}
              value={targetText}
              onChange={(e) => setTargetText(e.target.value)}
              placeholder='Paste JSON here. Example: {"items":[{"id":"b"},{"id":"a"}]}'
              spellCheck={false}
              aria-describedby="target-help"
              aria-invalid={validationB ? !validationB.ok : undefined}
            />
            {validationB ? (
              <div className="mt-2 text-[13px] text-[var(--muted)]">
                {validationB.ok ? "Valid JSON." : validationB.message}
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}

