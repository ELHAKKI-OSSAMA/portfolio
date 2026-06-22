import type { Metadata } from "next";

// OAuth redirect target for the TikTok Content Posting integration.
// TikTok requires an https redirect URI, so we register
// https://ossamaelhakki.com/tiktok/callback and surface the authorization
// `code` here for the local token-exchange script to consume.
export const metadata: Metadata = {
  title: "TikTok OAuth Callback",
  robots: { index: false, follow: false },
};

export default async function TikTokCallback({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const val = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) ?? "";
  const code = val("code");
  const state = val("state");
  const error = val("error");
  const errorDesc = val("error_description");

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        background: "#06060e",
        color: "#e6e6f0",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          border: "1px solid #2a2a3e",
          borderRadius: 16,
          padding: 28,
          background: "#0d0d1f",
        }}
      >
        <div style={{ fontSize: 13, letterSpacing: 2, color: "#6c63ff", marginBottom: 8 }}>
          TIKTOK · OAUTH CALLBACK
        </div>

        {error ? (
          <>
            <h1 style={{ fontSize: 20, margin: "0 0 12px", color: "#ff6b6b" }}>
              Authorization failed
            </h1>
            <p style={{ fontSize: 14, color: "#b8b8c8", margin: "0 0 8px" }}>error: {error}</p>
            {errorDesc && (
              <p style={{ fontSize: 14, color: "#b8b8c8", margin: 0 }}>{errorDesc}</p>
            )}
          </>
        ) : code ? (
          <>
            <h1 style={{ fontSize: 20, margin: "0 0 8px", color: "#00d4aa" }}>
              Authorized ✓
            </h1>
            <p style={{ fontSize: 14, color: "#b8b8c8", margin: "0 0 16px" }}>
              Copy this authorization code into the local token-exchange script
              (it expires fast — use it within a minute):
            </p>
            <div
              style={{
                userSelect: "all",
                wordBreak: "break-all",
                background: "#06060e",
                border: "1px solid #6c63ff55",
                borderRadius: 10,
                padding: "14px 16px",
                fontSize: 15,
                color: "#fff",
              }}
            >
              {code}
            </div>
            {state && (
              <p style={{ fontSize: 12, color: "#7a7a8c", marginTop: 14 }}>
                state: <span style={{ userSelect: "all" }}>{state}</span>
              </p>
            )}
          </>
        ) : (
          <>
            <h1 style={{ fontSize: 20, margin: "0 0 12px" }}>Waiting for authorization</h1>
            <p style={{ fontSize: 14, color: "#b8b8c8", margin: 0 }}>
              No <code>code</code> in the URL. Start the OAuth flow from the
              integration script, authorize on TikTok, and you will be redirected
              back here with your code.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
