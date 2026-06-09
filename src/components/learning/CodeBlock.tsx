"use client";

import { useState } from "react";
import { Copy, Check, Play } from "lucide-react";

interface Props {
  code: string;
  language?: string;
  accentColor?: string;
}

function escHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const PY_KEYWORDS = new Set([
  "import","from","def","class","return","for","in","if","else","elif","while",
  "with","as","not","and","or","True","False","None","pass","break","continue",
  "yield","lambda","self","super","print","range","len","zip","enumerate","type",
  "isinstance","try","except","raise","finally","async","await",
]);
const PY_BUILTINS = new Set([
  "str","int","float","list","dict","set","tuple","bool","np","pd","torch","nn",
  "F","optim","plt","sns","lgb","xgb","cb",
]);
const PY_SK = new Set([
  "sklearn","Pipeline","ColumnTransformer","StandardScaler","MinMaxScaler",
  "RobustScaler","OneHotEncoder","OrdinalEncoder","SimpleImputer","IterativeImputer",
  "KMeans","DBSCAN","PCA","IsolationForest","RandomForestClassifier",
  "RandomForestRegressor","GradientBoostingClassifier","LogisticRegression",
  "LinearRegression","SVC","SVR","KNeighborsClassifier","MultinomialNB","GaussianNB",
  "ComplementNB","TfidfVectorizer","GridSearchCV","RandomizedSearchCV",
  "cross_val_score","train_test_split","TimeSeriesSplit","SelectFromModel",
]);

// Single-pass tokenizer. Each token is matched exactly once and its inner text is
// escaped — so keywords inside comments/strings (or "str" inside a generated class
// name) are never re-tokenized. This fixes the nested-span corruption.
const TOKEN =
  /("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')|(#[^\n]*)|(@\w+)|(\d+\.?\d*(?:[eE][+-]?\d+)?)|([A-Za-z_]\w*)/g;

function highlight(code: string, lang: string): string {
  if (lang !== "python") return escHtml(code);

  let out = "";
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(code)) !== null) {
    out += escHtml(code.slice(last, m.index));
    last = TOKEN.lastIndex;
    const [, str, comment, dec, num, word] = m;
    if (str !== undefined) out += `<span class="tok-str">${escHtml(str)}</span>`;
    else if (comment !== undefined) out += `<span class="tok-comment">${escHtml(comment)}</span>`;
    else if (dec !== undefined) out += `<span class="tok-dec">${escHtml(dec)}</span>`;
    else if (num !== undefined) out += `<span class="tok-num">${escHtml(num)}</span>`;
    else if (word !== undefined) {
      if (PY_KEYWORDS.has(word)) out += `<span class="tok-kw">${word}</span>`;
      else if (PY_SK.has(word)) out += `<span class="tok-sk">${word}</span>`;
      else if (PY_BUILTINS.has(word)) out += `<span class="tok-builtin">${word}</span>`;
      else out += escHtml(word);
    }
  }
  out += escHtml(code.slice(last));
  return out;
}

/** Encode code as a Colab-compatible ipynb data URI, then open in Colab */
function openInColab(code: string) {
  const nb = {
    nbformat: 4,
    nbformat_minor: 5,
    metadata: {
      kernelspec: { display_name: "Python 3", language: "python", name: "python3" },
      language_info: { name: "python", version: "3.10.0" },
    },
    cells: [
      {
        cell_type: "markdown",
        id: "intro",
        metadata: {},
        source: ["# ML Learning Hub — Code Snippet\n", "> Paste the code cell below and run it in Colab.\n", "\n", "Install required packages with `!pip install scikit-learn pandas numpy matplotlib seaborn lightgbm`."],
      },
      {
        cell_type: "code",
        execution_count: null,
        id: "main",
        metadata: {},
        outputs: [],
        source: code.split("\n"),
      },
    ],
  };

  void JSON.stringify(nb); // (kept for future data-URI flow)
  navigator.clipboard
    .writeText(code)
    .catch(() => {})
    .finally(() => {
      window.open("https://colab.research.google.com/#create=true", "_blank");
    });
}

export default function CodeBlock({ code, language = "python", accentColor = "#6c63ff" }: Props) {
  const [copied, setCopied] = useState(false);
  const [colabMsg, setColabMsg] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleColab = () => {
    openInColab(code);
    setColabMsg(true);
    setTimeout(() => setColabMsg(false), 4000);
  };

  const highlighted = highlight(code, language);
  const lineCount = code.split("\n").length;

  return (
    <div className="cb-card my-6 rounded-2xl overflow-hidden border">
      {/* Header */}
      <div className="cb-head flex items-center justify-between px-4 py-2.5 border-b">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
            {language}
          </span>
          <span className="cb-faint text-xs">
            {lineCount} line{lineCount !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {language === "python" && (
            <button onClick={handleColab}
              className="cb-btn flex items-center gap-1 text-xs px-2.5 py-1 rounded transition-all"
              style={colabMsg ? { color: "#f97316", backgroundColor: "#f9731615", borderColor: "#f9731640" } : undefined}
              title="Code copied to clipboard — paste in the new Colab notebook">
              <Play size={11} />
              {colabMsg ? "Paste in Colab ↗" : "Run in Colab"}
            </button>
          )}

          <button onClick={handleCopy}
            className="cb-btn flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70 px-2 py-1 rounded"
            style={copied ? { color: "#10b981" } : undefined}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Colab hint banner */}
      {colabMsg && (
        <div className="px-4 py-2 text-xs border-b flex items-center gap-2"
          style={{ backgroundColor: "#f9731610", borderColor: "#f9731630", color: "#f97316" }}>
          <Play size={11} />
          Code copied! A new Colab notebook opened — press <kbd className="px-1 py-0.5 rounded font-mono mx-1" style={{ backgroundColor: "#f9731620" }}>Ctrl+V</kbd> to paste, then <kbd className="px-1 py-0.5 rounded font-mono mx-1" style={{ backgroundColor: "#f9731620" }}>Shift+Enter</kbd> to run.
        </div>
      )}

      {/* Code — always LTR regardless of page language */}
      <div className="overflow-x-auto" dir="ltr">
        <pre className="cb-pre p-5 text-xs leading-relaxed font-mono"
          style={{ margin: 0, direction: "ltr", textAlign: "left" }}
          dangerouslySetInnerHTML={{ __html: highlighted }} />
      </div>

      {/* Theme-driven styling — keyed off [data-theme] on <html> so it matches the
          theme before React hydrates (no SSR/client mismatch). Base = dark. */}
      <style>{`
        .cb-card { background:#0d1117; border-color:rgba(255,255,255,0.08); }
        .cb-head { border-color:rgba(255,255,255,0.06); }
        .cb-faint { color:rgba(255,255,255,0.4); }
        .cb-btn { color:rgba(255,255,255,0.5); background-color:rgba(255,255,255,0.05); border:1px solid transparent; }
        .cb-pre { color:#e6edf3; }
        .tok-kw { color:#ff7b72; }
        .tok-str { color:#a5d6ff; }
        .tok-num { color:#79c0ff; }
        .tok-comment { color:#8b949e; font-style:italic; }
        .tok-dec { color:#ffa657; }
        .tok-builtin { color:#d2a8ff; }
        .tok-sk { color:#7ee787; }

        [data-theme="light"] .cb-card { background:#f6f8fa; border-color:rgba(0,0,0,0.12); }
        [data-theme="light"] .cb-head { border-color:rgba(0,0,0,0.08); }
        [data-theme="light"] .cb-faint { color:rgba(0,0,0,0.4); }
        [data-theme="light"] .cb-btn { color:rgba(0,0,0,0.5); background-color:rgba(0,0,0,0.04); }
        [data-theme="light"] .cb-pre { color:#24292f; }
        [data-theme="light"] .tok-kw { color:#cf222e; }
        [data-theme="light"] .tok-str { color:#0550ae; }
        [data-theme="light"] .tok-num { color:#0a3069; }
        [data-theme="light"] .tok-comment { color:#6e7781; font-style:italic; }
        [data-theme="light"] .tok-dec { color:#953800; }
        [data-theme="light"] .tok-builtin { color:#8250df; }
        [data-theme="light"] .tok-sk { color:#116329; }
      `}</style>
    </div>
  );
}
