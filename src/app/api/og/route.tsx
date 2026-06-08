import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Load a Google font (Cairo — covers Latin + Arabic) as TTF for satori.
// Requesting with an old UA makes Google serve TTF instead of WOFF2.
async function loadFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const api = `https://fonts.googleapis.com/css2?family=Cairo:wght@700&text=${encodeURIComponent(
      text
    )}`;
    const css = await (
      await fetch(api, { headers: { "User-Agent": "Mozilla/5.0 (compatible)" } })
    ).text();
    const url = css.match(/src:\s*url\(([^)]+)\)\s*format/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

const isArabic = (s: string) => /[؀-ۿ]/.test(s);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "Ossama Elhakki").slice(0, 110);
  const subtitle = (searchParams.get("subtitle") || "AI Engineer & Data Scientist").slice(0, 120);

  const rtl = isArabic(title) || isArabic(subtitle);
  const fontData = await loadFont(`${title} ${subtitle} ossamaelhakki.com OE`);
  const fonts = fontData
    ? [{ name: "Cairo", data: fontData, weight: 700 as const, style: "normal" as const }]
    : [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: rtl ? "flex-end" : "flex-start",
          padding: "80px",
          background: "linear-gradient(135deg, #0d0d1f 0%, #1a1a3e 50%, #0d0d1f 100%)",
          fontFamily: fonts.length ? "Cairo, sans-serif" : "sans-serif",
          position: "relative",
          overflow: "hidden",
          direction: rtl ? "rtl" : "ltr",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(108, 99, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0, 212, 170, 0.1) 0%, transparent 50%)",
          }}
        />
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #6c63ff, #00d4aa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            fontWeight: 700,
            color: "white",
            marginBottom: "32px",
          }}
        >
          OE
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "1040px",
            textAlign: rtl ? "right" : "left",
          }}
        >
          <div
            style={{
              fontSize: "56px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.15,
              letterSpacing: rtl ? "0" : "-1px",
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: "26px", color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>
            {subtitle}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            [rtl ? "left" : "right"]: "80px",
            display: "flex",
            alignItems: "center",
            background: "rgba(108, 99, 255, 0.2)",
            border: "1px solid rgba(108, 99, 255, 0.4)",
            borderRadius: "100px",
            padding: "8px 20px",
          }}
        >
          <span style={{ color: "#6c63ff", fontSize: "16px", fontWeight: 600 }}>
            ossamaelhakki.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fonts.length ? fonts : undefined,
    }
  );
}
