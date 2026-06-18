"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ModelContext, WebMcpTool } from "@/types/webmcp";

export interface CatalogItem {
  title: string;
  path: string; // locale-agnostic path, e.g. "/projects/nmt"
  category?: string;
}

interface WebMCPProps {
  locale: string;
  sections: string[]; // e.g. ["projects","blog","learning","games","services","about","contact"]
  projects: CatalogItem[];
  posts: CatalogItem[];
  topics: CatalogItem[];
  contact: { email: string; phone: string; github: string; linkedin: string; kaggle: string };
}

/**
 * Registers WebMCP tools so in-browser AI agents can navigate, search and read
 * this portfolio reliably. Mounted once in the locale layout, so the tools are
 * available on every page. https://developer.chrome.com/docs/ai/webmcp
 */
export default function WebMCP({ locale, sections, projects, posts, topics, contact }: WebMCPProps) {
  const router = useRouter();

  useEffect(() => {
    const mc: ModelContext | undefined =
      (typeof document !== "undefined" && document.modelContext) ||
      (typeof navigator !== "undefined" && navigator.modelContext) ||
      undefined;
    if (!mc?.registerTool) return; // API not supported — no-op on unsupported browsers.

    const href = (path: string) => `/${locale}${path === "/" ? "" : path}`;
    const all: CatalogItem[] = [...projects, ...posts, ...topics];

    const tools: WebMcpTool[] = [
      {
        name: "navigate_to_section",
        description:
          "Navigate to a top-level section of Ossama Elhakki's portfolio (home, projects, blog, learning, games, services, about, contact).",
        inputSchema: {
          type: "object",
          properties: {
            section: { type: "string", enum: ["home", ...sections], description: "The section to open." },
          },
          required: ["section"],
        },
        execute: ({ section }) => {
          const s = String(section);
          router.push(href(s === "home" ? "/" : `/${s}`));
          return `Navigating to the ${s} section.`;
        },
      },
      {
        name: "search_portfolio",
        description:
          "Search across all projects, blog posts, and ML learning topics by keyword. Returns matching titles and their URLs.",
        annotations: { readOnlyHint: true },
        inputSchema: {
          type: "object",
          properties: { query: { type: "string", description: "Keywords to search for." } },
          required: ["query"],
        },
        execute: ({ query }) => {
          const q = String(query).toLowerCase().trim();
          const hits = all
            .filter((i) => i.title.toLowerCase().includes(q) || (i.category ?? "").toLowerCase().includes(q))
            .slice(0, 12)
            .map((i) => ({ title: i.title, url: href(i.path) }));
          return hits.length
            ? JSON.stringify(hits)
            : `No results found for "${query}".`;
        },
      },
      {
        name: "list_projects",
        description: "List Ossama Elhakki's AI/ML projects with their titles and URLs.",
        annotations: { readOnlyHint: true },
        inputSchema: { type: "object", properties: {} },
        execute: () => JSON.stringify(projects.map((p) => ({ title: p.title, url: href(p.path) }))),
      },
      {
        name: "open_item",
        description:
          "Open a specific project, blog post, or learning topic by its exact title (use search_portfolio first to find titles).",
        inputSchema: {
          type: "object",
          properties: { title: { type: "string", description: "Exact title of the item to open." } },
          required: ["title"],
        },
        execute: ({ title }) => {
          const t = String(title).toLowerCase().trim();
          const item = all.find((i) => i.title.toLowerCase() === t) ?? all.find((i) => i.title.toLowerCase().includes(t));
          if (!item) return `No item found matching "${title}".`;
          router.push(href(item.path));
          return `Opening "${item.title}".`;
        },
      },
      {
        name: "get_contact_info",
        description: "Get Ossama Elhakki's contact details: email, phone/WhatsApp, GitHub, LinkedIn, and Kaggle.",
        annotations: { readOnlyHint: true },
        inputSchema: { type: "object", properties: {} },
        execute: () => JSON.stringify(contact),
      },
      {
        name: "get_page_summary",
        description: "Summarize the page the user is currently viewing: its title, URL, and main heading text.",
        annotations: { readOnlyHint: true },
        inputSchema: { type: "object", properties: {} },
        execute: () => {
          const heading = document.querySelector("h1")?.textContent?.trim() ?? "";
          const desc = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
          return JSON.stringify({ title: document.title, url: window.location.href, heading, description: desc });
        },
      },
      {
        name: "set_theme",
        description: "Switch the site's color theme between light and dark mode.",
        inputSchema: {
          type: "object",
          properties: { theme: { type: "string", enum: ["light", "dark"], description: "The theme to apply." } },
          required: ["theme"],
        },
        execute: ({ theme }) => {
          const t = theme === "dark" ? "dark" : "light";
          document.documentElement.setAttribute("data-theme", t);
          try { localStorage.setItem("theme", t); } catch {}
          return `Theme set to ${t} mode.`;
        },
      },
      {
        name: "set_language",
        description: "Switch the site language. Supported: en (English), fr (French), ar (Arabic).",
        inputSchema: {
          type: "object",
          properties: { language: { type: "string", enum: ["en", "fr", "ar"], description: "Target language code." } },
          required: ["language"],
        },
        execute: ({ language }) => {
          const lang = ["en", "fr", "ar"].includes(String(language)) ? String(language) : "en";
          const rest = window.location.pathname.replace(/^\/(en|fr|ar)/, "");
          router.push(`/${lang}${rest}`);
          return `Switching language to ${lang}.`;
        },
      },
    ];

    const unregisters = tools.map((t) => mc.registerTool(t)).filter(Boolean) as Array<() => void>;
    return () => {
      unregisters.forEach((u) => { try { u(); } catch {} });
      if (mc.unregisterTool) tools.forEach((t) => { try { mc.unregisterTool!(t.name); } catch {} });
    };
  }, [locale, router, sections, projects, posts, topics, contact]);

  return null;
}
