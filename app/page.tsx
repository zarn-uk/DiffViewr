"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { parseJsonText } from "@/lib/jsonText";
import { getNodeByPath, parseJsonPath, setNodeByPath } from "@/lib/jsonPath";
import { reorderArrayAtPath } from "@/lib/reorderArray";
import { reorderObjectKeysAtPath } from "@/lib/reorderObject";
import type { Diagnostics } from "@/lib/diagnostics";
import { detectIndentFromText, stringifyLikeInput } from "@/lib/stringifyLikeInput";
import { compareJson } from "@/lib/diff/compareJson";
import { buildSummary } from "@/lib/diff/buildSummary";
import type { CompareResult } from "@/lib/diff/types";
import { ToolIntro } from "@/components/tool/tool-intro";
import { ToolInfo } from "@/components/tool/tool-info";
import { JsonInputGrid } from "@/components/tool/json-input-grid";
import { ValidationPanel } from "@/components/tool/validation-panel";
import { OutputSection } from "@/components/tool/output-section";
import { RatingModal } from "@/components/tool/rating-modal";
import {
  isPlainObject,
  isPrimitive,
  serializePrimitiveKey,
  serializeValueKey,
  type Primitive
} from "@/lib/serialize";

type SortResult = {
  resultText: string;
  diagnostics: Diagnostics;
};

const SAMPLE = {
  path: "$.items",
  matchField: "id",
  reference: {
    items: [
      { id: "a", name: "Alpha", meta: { code: 10 } },
      { id: "b", name: "Beta", meta: { code: 20 } },
      { id: "c", name: "Gamma", meta: { code: 30 } }
    ],
    settings: { featureX: true, retries: 2 }
  },
  target: {
    items: [
      { id: "c", name: "Gamma", meta: { code: 30 } },
      { id: "x", name: "Extra", meta: { code: 999 } },
      { id: "a", name: "Alpha", meta: { code: 10 } },
      { id: "b", name: "Beta", meta: { code: 20 } }
    ],
    settings: { retries: 2, featureX: true }
  }
} as const;

export default function Page() {
  const [refText, setRefText] = useState<string>("");
  const [targetText, setTargetText] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [result, setResult] = useState<SortResult | null>(null);
  const [compare, setCompare] = useState<CompareResult | null>(null);
  const [activeTab, setActiveTab] = useState<"result" | "compare">("result");
  const [inputsCollapsed, setInputsCollapsed] = useState<boolean>(false);
  const [validationA, setValidationA] = useState<{ ok: boolean; message: string } | null>(
    null
  );
  const [validationB, setValidationB] = useState<{ ok: boolean; message: string } | null>(
    null
  );
  const [effectiveMatchField, setEffectiveMatchField] = useState<string>("");
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const resultSectionRef = useRef<HTMLElement | null>(null);
  const isOutputVisible = Boolean(result || compare);
  const [outputMaximized, setOutputMaximized] = useState<boolean>(false);

  const canCopy = useMemo(
    () => Boolean(result?.resultText?.length),
    [result?.resultText]
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    const cookie = document.cookie
      .split("; ")
      .find(
        (row) =>
          row.startsWith("diffviewr_rating=") ||
          row.startsWith("json_tool_rating=")
      );
    if (cookie) setHasRated(true);
  }, []);

  useEffect(() => {
    if (!isOutputVisible) setInputsCollapsed(false);
  }, [isOutputVisible]);

  useEffect(() => {
    if (!isOutputVisible) {
      setOutputMaximized(false);
    }
  }, [isOutputVisible]);

  function setRatingCookie(value: number) {
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    document.cookie = `diffviewr_rating=${value}; max-age=${maxAge}; path=/; samesite=lax`;
  }

  function clearMessages() {
    setError("");
    setStatus("");
  }

  function onLoadSample() {
    clearMessages();
    setRefText(JSON.stringify(SAMPLE.reference, null, 2));
    setTargetText(JSON.stringify(SAMPLE.target, null, 2));
    setResult(null);
    setCompare(null);
    setInputsCollapsed(false);
    setValidationA(null);
    setValidationB(null);
    setEffectiveMatchField("");
  }

  async function copyResult() {
    clearMessages();
    if (!result?.resultText) return;
    try {
      await navigator.clipboard.writeText(result.resultText);
      setStatus("Copied result to clipboard.");
    } catch {
      setError("Clipboard copy failed. Your browser may block clipboard access.");
    }
  }

  function sortAndCompare() {
    clearMessages();
    setResult(null);
    setCompare(null);

    let refJson: unknown;
    let targetJson: unknown;
    try {
      refJson = parseJsonText(refText, "Reference JSON (A)");
      setValidationA({ ok: true, message: "Valid JSON." });
    } catch (e) {
      setValidationA({ ok: false, message: String(e instanceof Error ? e.message : e) });
      setValidationB(null);
      setError("Fix Reference JSON (A) to continue.");
      return;
    }
    try {
      targetJson = parseJsonText(targetText, "Target JSON (B)");
      setValidationB({ ok: true, message: "Valid JSON." });
    } catch (e) {
      setValidationB({ ok: false, message: String(e instanceof Error ? e.message : e) });
      setError("Fix Target JSON (B) to continue.");
      return;
    }

    const targetPath = "$";
    const matchFieldPath = "";
    let tokens;
    try {
      tokens = parseJsonPath(targetPath);
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
      return;
    }

    let aNode: unknown;
    let bNode: unknown;
    try {
      aNode = getNodeByPath(refJson, tokens);
      bNode = getNodeByPath(targetJson, tokens);
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
      return;
    }

    if (Array.isArray(aNode) && Array.isArray(bNode)) {
      try {
        const mode = detectArrayMode(aNode, bNode);
        const detected = mode === "objects" ? detectMatchField(aNode, bNode) : "";
        let matchPathToUse = matchFieldPath.trim() || detected;
        const matchByValue = mode === "objects" && !matchPathToUse;
        const { diagnostics } = reorderArrayAtPath({
          referenceArray: aNode,
          targetArray: bNode,
          matchFieldPath: matchPathToUse,
          unmatchedHandling: "append"
        });
        const reorderedNode = reorderArrayDeep(aNode, bNode);
        const nextRoot = setNodeByPath(targetJson, tokens, reorderedNode);
        const resultText = stringifyLikeInput(nextRoot, targetText);
        const indentA = detectIndentFromText(refText) ?? 2;
        const indentB = detectIndentFromText(targetText) ?? 2;
        setResult({ resultText, diagnostics });
        setStatus(
          `Sorted array at root. ${matchByValue ? "Auto-match: by value" : matchPathToUse ? `Auto-match: ${matchPathToUse}` : ""}`.trim()
        );
        const root = compareJson(refJson, nextRoot, "$", "$", matchPathToUse);
        setCompare({
          root,
          summary: buildSummary(root),
          aRoot: refJson,
          bRoot: nextRoot,
          aIndent: indentA,
          bIndent: indentB
        });
        setEffectiveMatchField(matchPathToUse);
        setActiveTab("result");
        setInputsCollapsed(true);
        requestAnimationFrame(() => {
          resultSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        if (!hasRated) {
          setShowShareModal(true);
        }
      } catch (e) {
        setError(String(e instanceof Error ? e.message : e));
      }
      return;
    }

    const aIsObject =
      typeof aNode === "object" && aNode !== null && !Array.isArray(aNode);
    const bIsObject =
      typeof bNode === "object" && bNode !== null && !Array.isArray(bNode);
    if (aIsObject && bIsObject) {
      try {
        const { diagnostics } = reorderObjectKeysAtPath({
          referenceObject: aNode as Record<string, unknown>,
          targetObject: bNode as Record<string, unknown>
        });
        const reorderedNode = reorderObjectDeep(
          aNode as Record<string, unknown>,
          bNode as Record<string, unknown>
        );
        const nextRoot = setNodeByPath(targetJson, tokens, reorderedNode);
        const resultText = stringifyLikeInput(nextRoot, targetText);
        const indentA = detectIndentFromText(refText) ?? 2;
        const indentB = detectIndentFromText(targetText) ?? 2;
        setResult({ resultText, diagnostics });
        setStatus("Sorted object keys at root.");
        const root = compareJson(refJson, nextRoot, "$", "$", matchFieldPath.trim());
        setCompare({
          root,
          summary: buildSummary(root),
          aRoot: refJson,
          bRoot: nextRoot,
          aIndent: indentA,
          bIndent: indentB
        });
        setEffectiveMatchField(matchFieldPath.trim());
        setActiveTab("result");
        setInputsCollapsed(true);
        requestAnimationFrame(() => {
          resultSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        if (!hasRated) {
          setShowShareModal(true);
        }
      } catch (e) {
        setError(String(e instanceof Error ? e.message : e));
      }
      return;
    }

    if (Array.isArray(aNode) || Array.isArray(bNode)) {
      setError(
        "Node type mismatch at target path: one is an array and the other is not."
      );
      return;
    }

    if (aIsObject || bIsObject) {
      setError(
        "Node type mismatch at target path: one is an object and the other is not."
      );
      return;
    }

    setError(
      "Target node is a primitive value. Only arrays and objects can be reordered."
    );
  }

  function detectMatchField(refArray: unknown[], targetArray: unknown[]) {
    const candidates = ["key", "id", "name"];
    for (const candidate of candidates) {
      const okRef = refArray.every(
        (item) =>
          item &&
          typeof item === "object" &&
          !Array.isArray(item) &&
          candidate in (item as Record<string, unknown>) &&
          isPrimitive((item as Record<string, unknown>)[candidate])
      );
      if (!okRef) continue;
      const okTarget = targetArray.every(
        (item) =>
          item &&
          typeof item === "object" &&
          !Array.isArray(item) &&
          candidate in (item as Record<string, unknown>) &&
          isPrimitive((item as Record<string, unknown>)[candidate])
      );
      if (okTarget) return candidate;
    }
    return "";
  }

  function detectArrayMode(refArray: unknown[], targetArray: unknown[]) {
    const refPrimitive = refArray.every((v) => isPrimitive(v));
    const targetPrimitive = targetArray.every((v) => isPrimitive(v));
    if (refPrimitive && targetPrimitive) return "primitives";
    return "objects";
  }

  function reorderArrayDeep(referenceArray: unknown[], targetArray: unknown[]) {
    const mode = detectArrayMode(referenceArray, targetArray);
    if (mode === "primitives") {
      const { reorderedNode } = reorderArrayAtPath({
        referenceArray,
        targetArray,
        matchFieldPath: "",
        unmatchedHandling: "append"
      });
      return reorderedNode;
    }

    const matchField = detectMatchField(referenceArray, targetArray);
    const fieldTokens = matchField
      ? parseJsonPath(
        matchField.startsWith("[") || matchField.startsWith(".")
          ? `$${matchField}`
          : `$.${matchField}`
      )
      : null;

    const bKeyToIndices = new Map<string, number[]>();
    for (let i = 0; i < targetArray.length; i += 1) {
      const item = targetArray[i];
      const key = fieldTokens
        ? serializePrimitiveKey(getNodeByPath(item, fieldTokens) as Primitive)
        : serializeValueKey(item);
      const queue = bKeyToIndices.get(key);
      if (queue) queue.push(i);
      else bKeyToIndices.set(key, [i]);
    }

    const used = new Array<boolean>(targetArray.length).fill(false);
    const matched: unknown[] = [];

    for (const refItem of referenceArray) {
      const key = fieldTokens
        ? serializePrimitiveKey(getNodeByPath(refItem, fieldTokens) as Primitive)
        : serializeValueKey(refItem);
      const queue = bKeyToIndices.get(key);
      if (!queue || queue.length === 0) continue;
      const idx = queue.shift() as number;
      used[idx] = true;
      matched.push(reorderDeep(refItem, targetArray[idx]));
    }

    const extras: unknown[] = [];
    for (let i = 0; i < targetArray.length; i += 1) {
      if (!used[i]) extras.push(reorderDeep(targetArray[i], targetArray[i]));
    }

    return matched.concat(extras);
  }

  function reorderObjectDeep(
    referenceObject: Record<string, unknown>,
    targetObject: Record<string, unknown>
  ) {
    const next: Record<string, unknown> = {};
    const keys = [
      ...Object.keys(referenceObject),
      ...Object.keys(targetObject).filter((k) => !(k in referenceObject))
    ];

    for (const key of keys) {
      if (!(key in targetObject)) continue;
      const aVal = referenceObject[key];
      const bVal = targetObject[key];
      if (Array.isArray(aVal) && Array.isArray(bVal)) {
        next[key] = reorderArrayDeep(aVal, bVal);
      } else if (isPlainObject(aVal) && isPlainObject(bVal)) {
        next[key] = reorderObjectDeep(aVal, bVal);
      } else {
        next[key] = bVal;
      }
    }

    return next;
  }

  function reorderDeep(aVal: unknown, bVal: unknown): unknown {
    if (Array.isArray(aVal) && Array.isArray(bVal)) {
      return reorderArrayDeep(aVal, bVal);
    }
    if (isPlainObject(aVal) && isPlainObject(bVal)) {
      return reorderObjectDeep(aVal, bVal);
    }
    return bVal;
  }

  const panelClass =
    "rounded-xl border border-[var(--border)] bg-[linear-gradient(180deg,var(--panel),var(--panel2))] shadow-[var(--shadow)] p-4";
  const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_85%,transparent)] text-[var(--text)] font-mono text-[12.5px] leading-relaxed p-3 focus:outline-none focus:border-[var(--accent)]";
  const jsonInputSizeClass =
    activeTab === "compare" || isOutputVisible
      ? "min-h-[160px] max-h-[220px]"
      : "min-h-[520px]";
  const buttonBase =
    "px-3 py-2 rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_80%,transparent)] text-sm hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]";
  const buttonPrimary =
    "px-3 py-2 rounded-lg border border-[var(--accent)] bg-[var(--accent-weak)] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]";

  return (
    <main id="main" className="py-8 flex flex-col">
      <a
        href="#results"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[var(--panel)] focus:px-3 focus:py-2 focus:text-sm focus:text-[var(--text)] focus:shadow-[var(--shadow)]"
      >
        Skip to results
      </a>

      <ToolIntro buttonClass={buttonBase} onLoadSample={onLoadSample} />
      <ToolInfo panelClass={panelClass} />
      <JsonInputGrid
        panelClass={panelClass}
        inputClass={inputClass}
        jsonInputSizeClass={jsonInputSizeClass}
        buttonBase={buttonBase}
        isOutputVisible={isOutputVisible}
        inputsCollapsed={inputsCollapsed}
        onToggleInputsCollapsed={() => setInputsCollapsed((v) => !v)}
        refText={refText}
        setRefText={setRefText}
        targetText={targetText}
        setTargetText={setTargetText}
        validationA={validationA}
        validationB={validationB}
      />
      <ValidationPanel panelClass={panelClass} validationA={validationA} validationB={validationB} />

      <section id="results" ref={resultSectionRef} className="mt-4">
        <div className="flex flex-wrap gap-2 justify-center">
          <button className={buttonPrimary} onClick={sortAndCompare} type="button">
            Sort & Compare
          </button>
          {result ? (
            <button
              className={buttonBase}
              onClick={copyResult}
              type="button"
              disabled={!canCopy}
            >
              Copy Result
            </button>
          ) : null}
          {effectiveMatchField ? (
            <span className="text-xs px-2 py-1 rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_70%,transparent)]">
              Auto-match: <strong>{effectiveMatchField}</strong>
            </span>
          ) : null}
        </div>

        {error ? (
          <div
            role="alert"
            aria-live="assertive"
            className="mt-2 rounded-xl border border-[color-mix(in_srgb,var(--danger)_45%,transparent)] bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] p-2 text-[13px]"
          >
            {error}
          </div>
        ) : null}
        {status ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-2 rounded-xl border border-[color-mix(in_srgb,var(--ok)_45%,transparent)] bg-[color-mix(in_srgb,var(--ok)_12%,transparent)] p-2 text-[13px]"
          >
            {status}
          </div>
        ) : null}
      </section>

      <OutputSection
        panelClass={panelClass}
        inputClass={inputClass}
        buttonBase={buttonBase}
        buttonPrimary={buttonPrimary}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        resultText={result?.resultText ?? null}
        compare={compare}
        outputMaximized={outputMaximized}
        setOutputMaximized={setOutputMaximized}
        onMaximize={() => {
          setInputsCollapsed(true);
          setOutputMaximized(true);
        }}
      />


      <RatingModal
        open={showShareModal}
        rating={rating}
        onRate={setRating}
        onClose={() => setShowShareModal(false)}
        onConfirm={() => {
          if (rating > 0) {
            setRatingCookie(rating);
            setHasRated(true);
          }
          setShowShareModal(false);
        }}
        confirmDisabled={rating === 0}
        buttonBase={buttonBase}
        buttonPrimary={buttonPrimary}
      />

    </main>
  );
}
