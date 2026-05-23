import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Ossama Elhakki";
  const subtitle = searchParams.get("subtitle") || "AI Engineer & ML Systems Builder";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          background: "linear-gradient(135deg, #0d0d1f 0%, #1a1a3e 50%, #0d0d1f 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(108, 99, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0, 212, 170, 0.1) 0%, transparent 50%)",
          }}
        />

        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            border: "1px solid rgba(108, 99, 255, 0.2)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            right: "100px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            border: "1px solid rgba(0, 212, 170, 0.15)",
          }}
        />

        {/* Avatar */}
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
            fontWeight: "bold",
            color: "white",
            marginBottom: "32px",
          }}
        >
          OE
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "800px" }}>
          <div
            style={{
              fontSize: "48px",
              fontWeight: "800",
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-1px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: "48px",
            marginTop: "48px",
          }}
        >
          {[
            { value: "36+", label: "ML Projects" },
            { value: "0.9973", label: "Best AUC" },
            { value: "8", label: "n8n Workflows" },
          ].map((stat) => (
            <div key={stat.label} style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{ fontSize: "28px", fontWeight: "700", color: "#6c63ff" }}
              >
                {stat.value}
              </span>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom badge */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "80px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(108, 99, 255, 0.2)",
            border: "1px solid rgba(108, 99, 255, 0.4)",
            borderRadius: "100px",
            padding: "8px 20px",
          }}
        >
          <span style={{ color: "#6c63ff", fontSize: "14px", fontWeight: "600" }}>
            ismmax.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
