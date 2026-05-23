"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface Props {
  content: string;
  accentColor?: string;
}

export default function ProjectMarkdown({ content, accentColor = "#6c63ff" }: Props) {
  return (
    <div className="project-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1
              className="text-2xl font-bold mt-8 mb-4 first:mt-0"
              style={{ color: "var(--text-primary)" }}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className="text-xl font-bold mt-6 mb-3 first:mt-0"
              style={{ color: "var(--text-primary)" }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className="text-lg font-semibold mt-5 mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p
              className="mb-4 leading-relaxed text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {children}
            </strong>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 space-y-1.5 ml-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 space-y-1.5 ml-4 list-decimal">{children}</ol>
          ),
          li: ({ children }) => (
            <li
              className="flex items-start gap-2 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <span style={{ color: accentColor }} className="mt-1 flex-shrink-0 text-xs">▸</span>
              <span>{children}</span>
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className="border-l-4 pl-4 py-1 mb-4 italic rounded-r text-sm"
              style={{
                borderColor: accentColor,
                backgroundColor: `${accentColor}10`,
                color: "var(--text-secondary)",
              }}
            >
              {children}
            </blockquote>
          ),
          code: (({ node: _node, children, className, ...props }) => {
            const isInline = !className;
            return isInline ? (
              <code
                className="px-1.5 py-0.5 rounded text-xs font-mono"
                style={{
                  backgroundColor: `${accentColor}15`,
                  color: accentColor,
                }}
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className={`block p-4 rounded-xl text-xs font-mono overflow-x-auto mb-4 leading-relaxed ${className || ""}`}
                style={{
                  backgroundColor: "var(--bg-elevated, #0d1117)",
                  color: "#e6edf3",
                  border: "1px solid var(--border)",
                }}
                {...props}
              >
                {children}
              </code>
            );
          }) as Components["code"],
          pre: ({ children }) => (
            <pre className="mb-4 overflow-x-auto rounded-xl">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-6 rounded-xl border" style={{ borderColor: "var(--border)" }}>
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead
              style={{
                backgroundColor: `${accentColor}15`,
              }}
            >
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th
              className="px-4 py-2.5 text-left text-xs font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              className="px-4 py-2.5 text-xs border-t"
              style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}
            >
              {children}
            </td>
          ),
          hr: () => (
            <hr className="my-6" style={{ borderColor: "var(--border)" }} />
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-opacity hover:opacity-70"
              style={{ color: accentColor }}
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
