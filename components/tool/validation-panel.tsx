"use client";

type Validation = { ok: boolean; message: string } | null;

type Props = {
  panelClass: string;
  validationA: Validation;
  validationB: Validation;
};

export function ValidationPanel({ panelClass, validationA, validationB }: Props) {
  if (!validationA && !validationB) return null;
  return (
    <div className={`${panelClass} mt-4`}>
      <h2 className="text-sm text-[var(--muted)] font-semibold mb-2">
        Validation
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[13px]">
        <div
          className={`rounded-xl border p-2 ${
            validationA?.ok
              ? "border-[color-mix(in_srgb,var(--ok)_45%,transparent)] bg-[color-mix(in_srgb,var(--ok)_12%,transparent)]"
              : "border-[color-mix(in_srgb,var(--danger)_45%,transparent)] bg-[color-mix(in_srgb,var(--danger)_12%,transparent)]"
          }`}
        >
          <strong>Reference (A):</strong>{" "}
          {validationA ? (validationA.ok ? "Valid JSON." : validationA.message) : "Not checked yet."}
        </div>
        <div
          className={`rounded-xl border p-2 ${
            validationB?.ok
              ? "border-[color-mix(in_srgb,var(--ok)_45%,transparent)] bg-[color-mix(in_srgb,var(--ok)_12%,transparent)]"
              : "border-[color-mix(in_srgb,var(--danger)_45%,transparent)] bg-[color-mix(in_srgb,var(--danger)_12%,transparent)]"
          }`}
        >
          <strong>Target (B):</strong>{" "}
          {validationB ? (validationB.ok ? "Valid JSON." : validationB.message) : "Not checked yet."}
        </div>
      </div>
    </div>
  );
}

