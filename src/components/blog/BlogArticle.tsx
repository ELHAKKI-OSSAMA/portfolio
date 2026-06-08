"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { slugify } from "@/lib/slug";

interface Props {
  content: string;
  /** Direction of the prose body. Code and tables stay LTR via CSS. */
  rtl?: boolean;
}

/** Flatten React children to a plain string (for heading anchor ids). */
function textOf(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  // React element with children
  const el = node as { props?: { children?: React.ReactNode } };
  if (el.props?.children) return textOf(el.props.children);
  return "";
}

const components: Components = {
  h2: ({ children }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
  h3: ({ children }) => <h3 id={slugify(textOf(children))}>{children}</h3>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="table-wrap">
      <table>{children}</table>
    </div>
  ),
  code: (({ className, children, ...props }) => {
    const isBlock = Boolean(className);
    return (
      <code className={className} {...props} data-block={isBlock || undefined}>
        {children}
      </code>
    );
  }) as Components["code"],
};

export default function BlogArticle({ content, rtl = false }: Props) {
  return (
    <article
      className="prose-blog"
      dir={rtl ? "rtl" : "ltr"}
      style={{ textAlign: rtl ? "right" : "left" }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
