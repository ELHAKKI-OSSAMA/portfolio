"use client";

import { useState } from "react";
import { Copy, Check, Play } from "lucide-react";
import { useVizTheme } from "@/hooks/useVizTheme";

interface Props {
  code: string;
  language?: string;
  accentColor?: string;
}

function highlight(code: string, lang: string): string {
  if (lang !== "python") return escHtml(code);

  const keywords  = /\b(import|from|def|class|return|for|in|if|else|elif|while|with|as|not|and|or|True|False|None|pass|break|continue|yield|lambda|self|super|print|range|len|zip|enumerate|type|isinstance|try|except|raise|finally|async|await)\b/g;
  const builtins  = /\b(str|int|float|list|dict|set|tuple|bool|np|pd|torch|nn|F|optim|plt|sns|lgb|xgb|cb)\b/g;
  const strings   = /("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')/g;
  const comments  = /(#[^\n]*)/g;
  const numbers   = /\b(\d+\.?\d*(?:e[+-]?\d+)?)\b/g;
  const decorators= /(@\w+)/g;
  const skClass   = /\b(sklearn|Pipeline|ColumnTransformer|StandardScaler|MinMaxScaler|RobustScaler|OneHotEncoder|OrdinalEncoder|SimpleImputer|IterativeImputer|KMeans|DBSCAN|PCA|IsolationForest|RandomForestClassifier|RandomForestRegressor|GradientBoostingClassifier|LogisticRegression|LinearRegression|SVC|SVR|KNeighborsClassifier|MultinomialNB|GaussianNB|ComplementNB|TfidfVectorizer|GridSearchCV|RandomizedSearchCV|cross_val_score|train_test_split|TimeSeriesSplit|SelectFromModel)\b/g;

  let result = escHtml(code);
  result = result.replace(strings,   '<span class="tok-str">$1</span>');
  result = result.replace(comments,  '<span class="tok-comment">$1</span>');
  result = result.replace(numbers,   '<span class="tok-num">$1</span>');
  result = result.replace(decorators,'<span class="tok-dec">$1</span>');
  result = result.replace(keywords,  '<span class="tok-kw">$1</span>');
  result = result.replace(skClass,   '<span class="tok-sk">$1</span>');
  result = result.replace(builtins,  '<span class="tok-builtin">$1</span>');
  return result;
}

function escHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Encode code as a Colab-compatible ipynb data URI, then open in Colab */
function openInColab(code: string) {
  // Build a minimal Jupyter notebook JSON with one code cell
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

  const json = JSON.stringify(nb);
  const b64  = btoa(unescape(encodeURIComponent(json)));
  // Colab can open a gist or GitHub file — we use the 'notebook' URL param via a data URI approach
  // Fallback: copy to clipboard and open blank Colab
  navigator.clipboard
    .writeText(code)
    .catch(() => {})
    .finally(() => {
      window.open("https://colab.research.google.com/#create=true", "_blank");
    });
}

export default function CodeBlock({ code, language = "python", accentColor = "#6c63ff" }: Props) {
  const [copied,  setCopied]  = useState(false);
  const [colabMsg, setColabMsg] = useState(false);
  const vt = useVizTheme();

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
  const lineCount   = code.split("\n").length;

  return (
    <div className="my-6 rounded-2xl overflow-hidden"
      style={{ backgroundColor: vt.codeBg, border:`1px solid ${vt.codeBorder}` }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ borderColor: vt.codeHeaderBorder }}>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold"
            style={{ backgroundColor:`${accentColor}20`, color:accentColor }}>
            {language}
          </span>
          <span className="text-xs" style={{ color: vt.textFaint }}>
            {lineCount} line{lineCount !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Open in Colab (Python only) */}
          {language === "python" && (
            <button onClick={handleColab}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded transition-all"
              style={{
                color: colabMsg ? "#f97316" : vt.textMuted,
                backgroundColor: colabMsg ? "#f9731615" : vt.surface,
                border: `1px solid ${colabMsg ? "#f9731640" : "transparent"}`,
              }}
              title="Code copied to clipboard — paste in the new Colab notebook">
              <Play size={11} />
              {colabMsg ? "Paste in Colab ↗" : "Run in Colab"}
            </button>
          )}

          {/* Copy button */}
          <button onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70 px-2 py-1 rounded"
            style={{ color: copied ? "#10b981" : vt.copyColor, backgroundColor: vt.surface }}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Colab hint banner */}
      {colabMsg && (
        <div className="px-4 py-2 text-xs border-b flex items-center gap-2"
          style={{ backgroundColor:"#f9731610", borderColor:"#f9731630", color:"#f97316" }}>
          <Play size={11} />
          Code copied! A new Colab notebook opened — press <kbd className="px-1 py-0.5 rounded font-mono mx-1" style={{ backgroundColor:"#f9731620" }}>Ctrl+V</kbd> to paste, then <kbd className="px-1 py-0.5 rounded font-mono mx-1" style={{ backgroundColor:"#f9731620" }}>Shift+Enter</kbd> to run.
        </div>
      )}

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="p-5 text-xs leading-relaxed font-mono"
          style={{ color: vt.codeText, margin: 0 }}
          dangerouslySetInnerHTML={{ __html: highlighted }} />
      </div>

      {/* Syntax highlighting CSS */}
      <style>{`
        [data-theme="dark"] .tok-kw      { color: #ff7b72; }
        [data-theme="dark"] .tok-str     { color: #a5d6ff; }
        [data-theme="dark"] .tok-num     { color: #79c0ff; }
        [data-theme="dark"] .tok-comment { color: #8b949e; font-style: italic; }
        [data-theme="dark"] .tok-dec     { color: #ffa657; }
        [data-theme="dark"] .tok-builtin { color: #d2a8ff; }
        [data-theme="dark"] .tok-sk      { color: #7ee787; }

        [data-theme="light"] .tok-kw      { color: #cf222e; }
        [data-theme="light"] .tok-str     { color: #0550ae; }
        [data-theme="light"] .tok-num     { color: #0a3069; }
        [data-theme="light"] .tok-comment { color: #6e7781; font-style: italic; }
        [data-theme="light"] .tok-dec     { color: #953800; }
        [data-theme="light"] .tok-builtin { color: #8250df; }
        [data-theme="light"] .tok-sk      { color: #116329; }
      `}</style>
    </div>
  );
}
