"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackage: (pkg: string | string[]) => Promise<void>;
}

const PYODIDE_VERSION = "0.26.2";
const CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

type Status = "idle" | "loading-pyodide" | "loading-pkg" | "running" | "done" | "error";

interface Props {
  initialCode?: string;
  accentColor?: string;
  packages?: string[];
}

export default function PythonSandbox({
  initialCode = "print('Hello from Python!')",
  accentColor = "#22c55e",
  packages = [],
}: Props) {
  const t = useTranslations("learning");
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const pyodideRef = useRef<PyodideInterface | null>(null);
  const scriptLoadedRef = useRef(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  async function ensurePyodide(): Promise<PyodideInterface> {
    if (pyodideRef.current) return pyodideRef.current;

    setStatus("loading-pyodide");
    setOutput(o => [...o, "⏳ Loading Python runtime…"]);

    if (!scriptLoadedRef.current) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `${CDN}pyodide.js`;
        script.onload = () => { scriptLoadedRef.current = true; resolve(); };
        script.onerror = () => reject(new Error("Failed to load Pyodide script"));
        document.head.appendChild(script);
      });
    }

    const pyodide = await window.loadPyodide!({ indexURL: CDN });

    // Redirect stdout
    await pyodide.runPythonAsync(`
import sys, io
class _Capture(io.StringIO):
    pass
sys.stdout = _Capture()
sys.stderr = _Capture()
`);

    if (packages.length) {
      setStatus("loading-pkg");
      setOutput(o => [...o, `📦 Loading ${packages.join(", ")}…`]);
      await pyodide.loadPackage(packages);
    }

    pyodideRef.current = pyodide;
    return pyodide;
  }

  async function run() {
    if (status === "running" || status === "loading-pyodide" || status === "loading-pkg") return;
    setOutput([]);
    try {
      const pyodide = await ensurePyodide();
      setStatus("running");

      // Reset captured output
      await pyodide.runPythonAsync("sys.stdout = _Capture(); sys.stderr = _Capture()");

      await pyodide.runPythonAsync(code);

      const stdout = String(await pyodide.runPythonAsync("sys.stdout.getvalue()"));
      const stderr = String(await pyodide.runPythonAsync("sys.stderr.getvalue()"));

      const lines: string[] = [];
      if (stdout.trim()) lines.push(...stdout.trimEnd().split("\n"));
      if (stderr.trim()) lines.push(...stderr.trimEnd().split("\n").map(l => `⚠ ${l}`));
      if (!lines.length) lines.push("(no output)");

      setOutput(lines);
      setStatus("done");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setOutput([`❌ ${msg}`]);
      setStatus("error");
    }
  }

  const statusLabel: Record<Status, string> = {
    idle: "Run",
    "loading-pyodide": "Loading…",
    "loading-pkg": "Loading packages…",
    running: "Running…",
    done: "Run again",
    error: "Retry",
  };

  const isLoading = status === "loading-pyodide" || status === "loading-pkg" || status === "running";

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}>
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {t("python_sandbox")}
          </span>
          {packages.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-mono"
              style={{ backgroundColor: `${accentColor}22`, color: accentColor }}>
              {packages.join(" · ")}
            </span>
          )}
        </div>
        <button onClick={run} disabled={isLoading}
          className="px-3 py-1 rounded-lg text-xs font-semibold transition-opacity disabled:opacity-50"
          style={{ backgroundColor: accentColor, color: "#fff" }}>
          {isLoading ? (
            <span className="flex items-center gap-1.5">
              <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="inline-block w-3 h-3 border-2 border-white/40 border-t-white rounded-full" />
              {statusLabel[status]}
            </span>
          ) : statusLabel[status]}
        </button>
      </div>

      {/* code editor */}
      <div className="relative">
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck={false}
          className="w-full px-5 py-4 text-sm font-mono resize-none outline-none min-h-[120px]"
          style={{
            backgroundColor: "var(--bg-subtle)",
            color: "var(--text-primary)",
            caretColor: accentColor,
          }}
          onKeyDown={e => {
            // Tab inserts spaces
            if (e.key === "Tab") {
              e.preventDefault();
              const el = e.currentTarget;
              const start = el.selectionStart;
              const end = el.selectionEnd;
              const next = code.substring(0, start) + "    " + code.substring(end);
              setCode(next);
              requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + 4; });
            }
            // Ctrl+Enter / Cmd+Enter runs
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") run();
          }}
        />
        <div className="absolute bottom-2 right-3 text-xs" style={{ color: "var(--text-secondary)" }}>
          {t("ctrl_enter_hint")}
        </div>
      </div>

      {/* output */}
      <AnimatePresence>
        {(output.length > 0 || isLoading) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t overflow-hidden"
            style={{ borderColor: "var(--border)" }}>
            <div ref={outputRef}
              className="px-5 py-3 max-h-48 overflow-y-auto text-xs font-mono space-y-0.5"
              style={{ backgroundColor: "var(--bg-subtle)", color: "var(--text-secondary)" }}>
              {output.map((line, i) => (
                <div key={i} style={{ color: line.startsWith("❌") || line.startsWith("⚠") ? "#f97316" : undefined }}>
                  {line}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
