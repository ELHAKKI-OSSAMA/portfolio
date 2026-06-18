// Type definitions for the WebMCP browser API + declarative form annotations.
// Spec: https://developer.chrome.com/docs/ai/webmcp
// `document.modelContext` is the current surface (Chrome 150+); `navigator.modelContext`
// is the older alias kept for back-compat.

export interface WebMcpToolAnnotations {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
}

export interface WebMcpJsonSchema {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
}

export interface WebMcpTool {
  name: string;
  description: string;
  inputSchema: WebMcpJsonSchema;
  execute: (input: Record<string, unknown>) => unknown | Promise<unknown>;
  annotations?: WebMcpToolAnnotations;
}

export interface ModelContext {
  /** Registers a tool. May return an unregister callback. */
  registerTool(tool: WebMcpTool): undefined | (() => void);
  unregisterTool?(name: string): void;
}

declare global {
  interface Document {
    modelContext?: ModelContext;
  }
  interface Navigator {
    modelContext?: ModelContext;
  }
}

// Declarative WebMCP form-annotation attributes (lowercase HTML attributes).
declare module "react" {
  interface HTMLAttributes<T> {
    toolname?: string;
    tooldescription?: string;
    toolparamdescription?: string;
    toolautosubmit?: boolean | "true" | "false";
  }
}
