import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const copy = searchParams.get("copy") || "DataCore — Tus datos, tu claridad.";
  const hashtags = searchParams.get("hashtags") || "";
  const variant = searchParams.get("variant") || "dark";

  const isDark = variant === "dark";
  const bgColor = isDark ? "#0F172A" : "#F8FAFC";
  const textColor = isDark ? "#FFFFFF" : "#1E293B";
  const accentColor = "#1D4ED8";
  const orangeColor = "#F97316";

  // Split copy into lines for layout
  const lines = copy.split("\n").filter(Boolean);
  const hookLine = lines[0] || "";
  const bodyLines = lines.slice(1);
  const hashtagList = hashtags ? hashtags.split(",").map((h) => h.trim()) : [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1080px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: bgColor,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            display: "flex",
            width: "120px",
            height: "6px",
            backgroundColor: orangeColor,
            borderRadius: "3px",
          }}
        />

        {/* Hook line */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: accentColor,
              lineHeight: 1.2,
              display: "flex",
            }}
          >
            {hookLine}
          </div>

          {bodyLines.length > 0 && (
            <div
              style={{
                fontSize: "28px",
                color: textColor,
                lineHeight: 1.6,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {bodyLines.map((line, i) => (
                <div key={i} style={{ display: "flex" }}>
                  {line}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom: hashtags + brand */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          {hashtagList.length > 0 && (
            <div
              style={{
                fontSize: "18px",
                color: isDark ? "#64748B" : "#64748B",
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                maxWidth: "700px",
              }}
            >
              {hashtagList.map((tag, i) => (
                <span key={i}>{tag.startsWith("#") ? tag : `#${tag}`}</span>
              ))}
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "4px",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: accentColor,
                display: "flex",
              }}
            >
              DataCore
            </div>
            <div
              style={{
                fontSize: "14px",
                color: isDark ? "#64748B" : "#64748B",
                display: "flex",
              }}
            >
              contacto@datacore.com
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
    }
  );
}
