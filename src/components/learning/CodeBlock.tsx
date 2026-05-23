"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useVizTheme } from "@/hooks/useVizTheme";

interface Props {
  code: string;
  language?: string;
  accentColor?: string;
}

function highlight(code: string, lang: string): string {
  if (lang !== "python") return escHtml(code);

  const keywords = /\b(import|from|def|class|return|for|in|if|else|elif|while|with|as|not|and|or|True|False|None|pass|break|continue|yield|lambda|self|super|print|range|len|zip|enumerate|type|isinstance|try|except|raise|finally|async|await)\b/g;
  const builtins = /\b(str|int|float|list|dict|set|tuple|bool|np|pd|torch|nn|F|optim|plt|sns)\b/g;
  const strings = /("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')/g;
  const comments = /(#[^\n]*)/g;
  const numbers = /\b(\d+\.?\d*)\b/g;
  const decorators = /(@\w+)/g;

  let result = escHtml(code);
  result = result.replace(strings, '<span class="tok-str">$1</span>');
  result = result.replace(comments, '<span class="tok-comment">$1</span>');
  result = result.replace(numbers, '<span class="tok-num">$1</span>');
  result = result.replace(decorators, '<span class="tok-dec">$1</span>');
  result = result.replace(keywords, '<span class="tok-kw">$1</span>');
  result = result.replace(builtins, '<span class="tok-builtin">$1</span>');
  return result;
}

function escHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function CodeBlock({ code, language = "python", accentColor = "#6c63ff" }: Props) {
  const [copied, setCopied] = useState(false);
  const vt = useVizTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const highlighted = highlight(code, language);

  return (
    <div
      className="my-6 rounded-2xl overflow-hidden"
      style={{
        backgroundColor: vt.codeBg,
        border: `1px solid ${vt.codeBorder}`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ borderColor: vt.codeHeaderBorder }}
      >
        <div className="flex items-center gap-2">
          <span
            className="px-2 py-0.5 rounded text-xs font-mono font-semibold"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70 px-2 py-1 rounded"
          style={{
            color: copied ? "#10b981" : vt.copyColor,
            backgroundColor: vt.surface,
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre
          className="p-5 text-xs leading-relaxed font-mono"
          style={{ color: vt.codeText, margin: 0 }}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>

      {/* Theme-aware syntax colors via data-theme CSS */}
      <style>{`
        [data-theme="dark"] .tok-kw      { color: #ff7b72; }
        [data-theme="dark"] .tok-str     { color: #a5d6ff; }
        [data-theme="dark"] .tok-num     { color: #79c0ff; }
        [data-theme="dark"] .tok-comment { color: #8b949e; font-style: italic; }
        [data-theme="dark"] .tok-dec     { color: #ffa657; }
        [data-theme="dark"] .tok-builtin { color: #d2a8ff; }

        [data-theme="light"] .tok-kw      { color: #cf222e; }
        [data-theme="light"] .tok-str     { color: #0550ae; }
        [data-theme="light"] .tok-num     { color: #0a3069; }
        [data-theme="light"] .tok-comment { color: #6e7781; font-style: italic; }
        [data-theme="light"] .tok-dec     { color: #953800; }
        [data-theme="light"] .tok-builtin { color: #8250df; }
      `}</style>
    </div>
  );
}
