import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

/* ── Brand Tokens ─────────────────────────────────────────────── */
const C = {
  navy: "#0F172A",
  navyLight: "#1E293B",
  navyMid: "#162644",
  electric: "#1D4ED8",
  electricGlow: "rgba(29, 78, 216, 0.35)",
  sky: "#64B5F6",
  skyGlow: "rgba(100, 181, 246, 0.2)",
  orange: "#F97316",
  orangeGlow: "rgba(249, 115, 22, 0.4)",
  surface: "#F8FAFC",
  muted: "#64748B",
  textDark: "#1E293B",
  white: "#FFFFFF",
  redPanel: "#1A1525",
  bluePanel: "#0F1A2F",
} as const;

const GRAD = {
  dark: "linear-gradient(145deg, #0F172A 0%, #0F1F3D 45%, #152A4A 100%)",
  darkRadial: "radial-gradient(ellipse at 30% 20%, #162644 0%, #0F172A 70%)",
  darkBottom: "linear-gradient(180deg, #0F172A 0%, #0D1B2E 100%)",
  light: "linear-gradient(145deg, #F8FAFC 0%, #EFF6FF 100%)",
  accent: "linear-gradient(90deg, #F97316, #1D4ED8)",
  accentReverse: "linear-gradient(90deg, #1D4ED8, #64B5F6)",
  redPanel: "linear-gradient(180deg, #1A1525 0%, #1C1020 100%)",
  bluePanel: "linear-gradient(180deg, #0F1A2F 0%, #0D1F3A 100%)",
} as const;

/* ── Shared helpers ───────────────────────────────────────────── */

function BrandFooter({ hashtags, isDark }: { hashtags: string[]; isDark: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          maxWidth: "620px",
        }}
      >
        {hashtags.map((tag, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              fontSize: "17px",
              color: isDark ? "#475569" : C.muted,
              marginRight: "12px",
              marginBottom: "4px",
            }}
          >
            {tag.startsWith("#") ? tag : `#${tag}`}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "28px",
            fontWeight: 900,
            color: C.electric,
            letterSpacing: "4px",
          }}
        >
          {"DATACORE"}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "13px",
            color: isDark ? "#475569" : C.muted,
            marginTop: "4px",
            letterSpacing: "1px",
          }}
        >
          {"Tus datos, tu claridad"}
        </div>
      </div>
    </div>
  );
}

function AccentLine({ width = 100 }: { width?: number }) {
  return (
    <div
      style={{
        display: "flex",
        width: `${width}px`,
        height: "5px",
        borderRadius: "3px",
        backgroundImage: GRAD.accent,
        boxShadow: `0 0 16px ${C.orangeGlow}`,
      }}
    />
  );
}

function LogoMark() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          backgroundImage: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
          boxShadow: `0 4px 20px ${C.electricGlow}`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "18px",
            fontWeight: 900,
            color: C.white,
            letterSpacing: "1px",
          }}
        >
          {"DC"}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: "22px",
          fontWeight: 800,
          color: C.electric,
          letterSpacing: "3px",
          marginLeft: "12px",
        }}
      >
        {"DATACORE"}
      </div>
    </div>
  );
}

/** SVG data-network decoration — nodes + connection lines */
function NetworkSVG({ opacity = 0.12 }: { opacity?: number }) {
  const nodes = [
    { x: 120, y: 140, r: 5 }, { x: 300, y: 80, r: 4 }, { x: 500, y: 160, r: 6 },
    { x: 700, y: 100, r: 4 }, { x: 900, y: 180, r: 5 }, { x: 200, y: 350, r: 4 },
    { x: 450, y: 400, r: 5 }, { x: 750, y: 320, r: 6 }, { x: 950, y: 400, r: 4 },
    { x: 100, y: 600, r: 4 }, { x: 350, y: 550, r: 5 }, { x: 600, y: 620, r: 4 },
    { x: 850, y: 560, r: 5 }, { x: 150, y: 800, r: 5 }, { x: 400, y: 750, r: 4 },
    { x: 650, y: 820, r: 6 }, { x: 900, y: 760, r: 4 }, { x: 250, y: 950, r: 4 },
    { x: 550, y: 900, r: 5 }, { x: 800, y: 950, r: 4 },
  ];
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8],
    [1, 6], [2, 7], [5, 10], [6, 11], [7, 12], [9, 10], [10, 11],
    [11, 12], [13, 14], [14, 15], [15, 16], [10, 14], [11, 15],
    [17, 18], [18, 19], [14, 18], [13, 9],
  ];

  return (
    <svg
      width="1080"
      height="1080"
      viewBox="0 0 1080 1080"
      style={{ display: "flex", position: "absolute" as never, top: 0, left: 0, opacity }}
    >
      {connections.map(([a, b], i) => (
        <line
          key={`l${i}`}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke={C.sky}
          strokeWidth="1"
          opacity="0.5"
        />
      ))}
      {nodes.map((n, i) => (
        <circle key={`n${i}`} cx={n.x} cy={n.y} r={n.r} fill={i % 3 === 0 ? C.electric : C.sky} opacity="0.7" />
      ))}
      {/* Highlight nodes with glow rings */}
      {[2, 7, 15].map((idx) => (
        <circle
          key={`g${idx}`}
          cx={nodes[idx].x}
          cy={nodes[idx].y}
          r="18"
          fill="none"
          stroke={C.electric}
          strokeWidth="1.5"
          opacity="0.3"
        />
      ))}
    </svg>
  );
}

/** Hexagonal grid SVG for tech/data feel */
function HexGridSVG({ opacity = 0.06 }: { opacity?: number }) {
  const hexagons: string[] = [];
  const size = 60;
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 8; col++) {
      const x = col * size * 1.75 + (row % 2 === 0 ? 0 : size * 0.875);
      const y = row * size * 1.5;
      const points = Array.from({ length: 6 })
        .map((_, i) => {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          return `${x + size * Math.cos(angle)},${y + size * Math.sin(angle)}`;
        })
        .join(" ");
      hexagons.push(points);
    }
  }
  return (
    <svg
      width="1080"
      height="1080"
      viewBox="0 0 1080 1080"
      style={{ display: "flex", position: "absolute" as never, top: 0, left: 0, opacity }}
    >
      {hexagons.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke={C.sky} strokeWidth="0.8" />
      ))}
    </svg>
  );
}

/* ── 1. HERO Template ─────────────────────────────────────────── */

function HeroTemplate({
  copy,
  subtitle,
  hashtags,
  isDark,
}: {
  copy: string;
  subtitle: string;
  hashtags: string[];
  isDark: boolean;
}) {
  const textMain = isDark ? C.white : C.textDark;

  return (
    <div
      style={{
        width: "1080px",
        height: "1080px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "70px",
        backgroundImage: isDark ? GRAD.dark : GRAD.light,
        fontFamily: "sans-serif",
      }}
    >
      <NetworkSVG opacity={0.1} />

      {/* Top bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <AccentLine width={120} />
        <LogoMark />
      </div>

      {/* Center content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          paddingTop: "40px",
          paddingBottom: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: copy.length > 120 ? "40px" : copy.length > 80 ? "48px" : "56px",
            fontWeight: 800,
            color: textMain,
            lineHeight: 1.2,
            textShadow: isDark ? "0 2px 40px rgba(0,0,0,0.3)" : "none",
          }}
        >
          {copy}
        </div>
        {subtitle && (
          <div
            style={{
              display: "flex",
              fontSize: "26px",
              color: C.sky,
              marginTop: "24px",
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </div>
        )}
        {/* Glowing accent bar */}
        <div
          style={{
            display: "flex",
            width: "80px",
            height: "4px",
            backgroundImage: GRAD.accentReverse,
            borderRadius: "2px",
            marginTop: "32px",
            boxShadow: `0 0 24px ${C.electricGlow}`,
          }}
        />
      </div>

      <BrandFooter hashtags={hashtags} isDark={isDark} />
    </div>
  );
}

/* ── 2. METRIC Template ───────────────────────────────────────── */

function MetricTemplate({
  title,
  copy,
  subtitle,
  hashtags,
  isDark,
}: {
  title: string;
  copy: string;
  subtitle: string;
  hashtags: string[];
  isDark: boolean;
}) {
  const metric = title || "73%";
  const textCol = isDark ? C.white : C.textDark;

  return (
    <div
      style={{
        width: "1080px",
        height: "1080px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "70px",
        backgroundImage: isDark ? GRAD.darkRadial : GRAD.light,
        fontFamily: "sans-serif",
      }}
    >
      <HexGridSVG opacity={0.05} />

      {/* Top row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <AccentLine />
        <LogoMark />
      </div>

      {/* Center metric */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        {/* Decorative rings */}
        <svg
          width="480"
          height="480"
          viewBox="0 0 480 480"
          style={{ display: "flex" }}
        >
          {/* Outer ring - gradient effect with segments */}
          <circle cx="240" cy="240" r="230" fill="none" stroke={C.navyLight} strokeWidth="2" opacity="0.3" />
          <circle cx="240" cy="240" r="200" fill="none" stroke={C.navyLight} strokeWidth="1.5" opacity="0.2" />
          <circle cx="240" cy="240" r="170" fill="none" stroke={C.navyLight} strokeWidth="1" opacity="0.15" />
          {/* Colored arc segments */}
          <path d="M 240 10 A 230 230 0 0 1 470 240" fill="none" stroke={C.orange} strokeWidth="4" opacity="0.8" />
          <path d="M 470 240 A 230 230 0 0 1 240 470" fill="none" stroke={C.electric} strokeWidth="4" opacity="0.7" />
          <path d="M 240 470 A 230 230 0 0 1 10 240" fill="none" stroke={C.sky} strokeWidth="3" opacity="0.5" />
          {/* Inner highlight arc */}
          <path d="M 240 40 A 200 200 0 0 1 440 240" fill="none" stroke={C.electric} strokeWidth="2" opacity="0.4" />
          {/* Tick marks */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (Math.PI * 2 * i) / 24;
            const x1 = 240 + 220 * Math.cos(angle);
            const y1 = 240 + 220 * Math.sin(angle);
            const x2 = 240 + 230 * Math.cos(angle);
            const y2 = 240 + 230 * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={i < 12 ? C.electric : C.sky}
                strokeWidth={i % 3 === 0 ? "2" : "1"}
                opacity="0.4"
              />
            );
          })}
          {/* Glow dots at key positions */}
          <circle cx="240" cy="10" r="5" fill={C.orange} opacity="0.9" />
          <circle cx="470" cy="240" r="5" fill={C.electric} opacity="0.9" />
          <circle cx="240" cy="470" r="4" fill={C.sky} opacity="0.7" />
        </svg>

        {/* Metric number overlaid */}
        <div
          style={{
            display: "flex",
            fontSize: metric.length > 6 ? "90px" : "130px",
            fontWeight: 900,
            color: C.electric,
            marginTop: "-340px",
            letterSpacing: "-3px",
            textShadow: `0 0 60px ${C.electricGlow}`,
          }}
        >
          {metric}
        </div>

        {/* Description */}
        <div
          style={{
            display: "flex",
            fontSize: "28px",
            color: textCol,
            marginTop: "80px",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.4,
            justifyContent: "center",
          }}
        >
          {copy}
        </div>
        {subtitle && (
          <div
            style={{
              display: "flex",
              fontSize: "20px",
              color: C.muted,
              marginTop: "14px",
              textAlign: "center",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      <BrandFooter hashtags={hashtags} isDark={isDark} />
    </div>
  );
}

/* ── 3. COMPARISON Template ───────────────────────────────────── */

function ComparisonTemplate({
  copy,
  hashtags,
}: {
  copy: string;
  hashtags: string[];
  isDark: boolean;
}) {
  const lines = copy.split("\n").filter(Boolean);
  const beforeItems: string[] = [];
  const afterItems: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.includes("❌")) {
      beforeItems.push(trimmed.replace("❌", "").trim());
    } else if (trimmed.includes("✅")) {
      afterItems.push(trimmed.replace("✅", "").trim());
    } else if (trimmed.startsWith("-")) {
      beforeItems.push(trimmed.slice(1).trim());
    } else {
      afterItems.push(trimmed);
    }
  }

  const maxItems = Math.max(beforeItems.length, afterItems.length, 1);

  return (
    <div
      style={{
        width: "1080px",
        height: "1080px",
        display: "flex",
        flexDirection: "column",
        backgroundImage: GRAD.darkBottom,
        fontFamily: "sans-serif",
      }}
    >
      {/* Top brand bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "30px 50px",
        }}
      >
        <AccentLine width={80} />
        <LogoMark />
      </div>

      {/* Split columns */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
        }}
      >
        {/* LEFT - ANTES */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "540px",
            backgroundImage: GRAD.redPanel,
            padding: "40px 45px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div style={{ display: "flex", fontSize: "32px", marginRight: "12px" }}>{"❌"}</div>
            <div
              style={{
                display: "flex",
                fontSize: "28px",
                fontWeight: 800,
                color: "#EF4444",
                letterSpacing: "3px",
              }}
            >
              {"ANTES"}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "2px",
              backgroundImage: "linear-gradient(90deg, #EF4444, transparent)",
              marginBottom: "24px",
            }}
          />
          {beforeItems.slice(0, 5).map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "8px",
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor: "#EF4444",
                  marginTop: "10px",
                  marginRight: "14px",
                  flexShrink: 0,
                  boxShadow: "0 0 8px rgba(239, 68, 68, 0.5)",
                }}
              />
              <div
                style={{
                  display: "flex",
                  fontSize: maxItems > 4 ? "20px" : "23px",
                  color: "#CBD5E1",
                  lineHeight: 1.5,
                }}
              >
                {item}
              </div>
            </div>
          ))}
        </div>

        {/* CENTER divider glow */}
        <div
          style={{
            display: "flex",
            width: "2px",
            backgroundImage: "linear-gradient(180deg, transparent, rgba(100,181,246,0.4), transparent)",
          }}
        />

        {/* RIGHT - AHORA */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "538px",
            backgroundImage: GRAD.bluePanel,
            padding: "40px 45px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div style={{ display: "flex", fontSize: "32px", marginRight: "12px" }}>{"✅"}</div>
            <div
              style={{
                display: "flex",
                fontSize: "28px",
                fontWeight: 800,
                color: "#22C55E",
                letterSpacing: "3px",
              }}
            >
              {"AHORA"}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "2px",
              backgroundImage: "linear-gradient(90deg, #22C55E, transparent)",
              marginBottom: "24px",
            }}
          />
          {afterItems.slice(0, 5).map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "8px",
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor: "#22C55E",
                  marginTop: "10px",
                  marginRight: "14px",
                  flexShrink: 0,
                  boxShadow: "0 0 8px rgba(34, 197, 94, 0.5)",
                }}
              />
              <div
                style={{
                  display: "flex",
                  fontSize: maxItems > 4 ? "20px" : "23px",
                  color: C.white,
                  lineHeight: 1.5,
                }}
              >
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom brand bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          padding: "24px 50px",
          backgroundImage: "linear-gradient(180deg, #1E293B, #0F172A)",
        }}
      >
        <BrandFooter hashtags={hashtags} isDark={true} />
      </div>
    </div>
  );
}

/* ── 4. TIPS Template ─────────────────────────────────────────── */

function TipsTemplate({
  title,
  copy,
  hashtags,
  isDark,
}: {
  title: string;
  copy: string;
  hashtags: string[];
  isDark: boolean;
}) {
  const textCol = isDark ? C.white : C.textDark;
  const cardBg = isDark ? C.navyLight : "#EFF6FF";

  const lines = copy.split("\n").filter(Boolean);
  const tips: { num: string; text: string }[] = [];
  for (const line of lines) {
    const match = line.match(/^(\d+)[.)]\s*(.+)/);
    if (match) {
      tips.push({ num: match[1], text: match[2] });
    } else {
      tips.push({ num: String(tips.length + 1), text: line.trim() });
    }
  }

  const fontSize = tips.length > 4 ? "20px" : "24px";
  const cardPadY = tips.length > 4 ? "14px" : "20px";
  const cardColors = [C.electric, C.sky, C.orange, "#8B5CF6", "#10B981", "#EC4899"];

  return (
    <div
      style={{
        width: "1080px",
        height: "1080px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 70px",
        backgroundImage: isDark ? GRAD.dark : GRAD.light,
        fontFamily: "sans-serif",
      }}
    >
      <HexGridSVG opacity={0.04} />

      {/* Top */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <AccentLine width={80} />
          <LogoMark />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "42px",
            fontWeight: 800,
            color: textCol,
            lineHeight: 1.2,
            marginTop: "20px",
          }}
        >
          {title || "Tips"}
        </div>
        <div
          style={{
            display: "flex",
            width: "60px",
            height: "4px",
            backgroundImage: GRAD.accentReverse,
            borderRadius: "2px",
            marginTop: "16px",
            boxShadow: `0 0 16px ${C.electricGlow}`,
          }}
        />
      </div>

      {/* Tips list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          marginTop: "24px",
          marginBottom: "24px",
        }}
      >
        {tips.slice(0, 6).map((tip, i) => {
          const accentColor = cardColors[i % cardColors.length];
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: cardBg,
                borderRadius: "16px",
                paddingTop: cardPadY,
                paddingBottom: cardPadY,
                paddingLeft: "0px",
                paddingRight: "28px",
                marginBottom: "12px",
                borderLeft: `5px solid ${accentColor}`,
              }}
            >
              {/* Number circle */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "44px",
                  height: "44px",
                  borderRadius: "22px",
                  backgroundColor: accentColor,
                  marginRight: "18px",
                  marginLeft: "20px",
                  flexShrink: 0,
                  boxShadow: `0 4px 16px ${accentColor}44`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: "20px",
                    fontWeight: 800,
                    color: C.white,
                  }}
                >
                  {tip.num}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: fontSize,
                  color: textCol,
                  lineHeight: 1.4,
                  flex: 1,
                }}
              >
                {tip.text}
              </div>
            </div>
          );
        })}
      </div>

      <BrandFooter hashtags={hashtags} isDark={isDark} />
    </div>
  );
}

/* ── 5. DASHBOARD Template ────────────────────────────────────── */

function DashboardTemplate({
  copy,
  subtitle,
  hashtags,
  isDark,
}: {
  copy: string;
  subtitle: string;
  hashtags: string[];
  isDark: boolean;
}) {
  const textCol = isDark ? C.white : C.textDark;
  const cardBg = isDark ? C.navyLight : "#EFF6FF";

  const miniMetrics = [
    { label: "Leads", value: "1,248", pct: 72, color: C.electric, trend: "+24%" },
    { label: "Conversiones", value: "340", pct: 45, color: C.sky, trend: "+18%" },
    { label: "ROI", value: "4.2x", pct: 88, color: C.orange, trend: "+31%" },
  ];

  return (
    <div
      style={{
        width: "1080px",
        height: "1080px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 70px",
        backgroundImage: isDark ? GRAD.dark : GRAD.light,
        fontFamily: "sans-serif",
      }}
    >
      <HexGridSVG opacity={0.03} />

      {/* Top bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <AccentLine width={80} />
        <LogoMark />
      </div>

      {/* Metric cards row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "32px",
        }}
      >
        {miniMetrics.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: cardBg,
              borderRadius: "16px",
              padding: "24px 28px",
              width: "285px",
              borderTop: `3px solid ${m.color}`,
              boxShadow: isDark ? `0 4px 20px rgba(0,0,0,0.3)` : `0 2px 10px rgba(0,0,0,0.05)`,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div style={{ display: "flex", fontSize: "14px", color: C.muted }}>{m.label}</div>
              <div
                style={{
                  display: "flex",
                  fontSize: "13px",
                  color: "#22C55E",
                  fontWeight: 700,
                }}
              >
                {m.trend}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "36px",
                fontWeight: 800,
                color: m.color,
                marginBottom: "14px",
                textShadow: `0 0 30px ${m.color}33`,
              }}
            >
              {m.value}
            </div>
            {/* Mini bar chart */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
                height: "40px",
              }}
            >
              {[35, 55, 45, 70, m.pct, 50, 65].map((h, j) => (
                <div
                  key={j}
                  style={{
                    display: "flex",
                    width: "26px",
                    height: `${(h / 100) * 40}px`,
                    backgroundColor: j === 4 ? m.color : isDark ? "#334155" : "#CBD5E1",
                    borderRadius: "3px",
                    marginRight: "5px",
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sparkline SVG */}
      <svg
        width="940"
        height="70"
        viewBox="0 0 940 70"
        style={{ display: "flex", marginTop: "16px" }}
      >
        {/* Area fill */}
        <path
          d="M 0,65 80,50 160,55 240,35 320,40 400,20 480,25 560,12 640,16 720,8 800,10 940,4 940,70 0,70 Z"
          fill={C.electric}
          opacity="0.08"
        />
        <polyline
          points="0,65 80,50 160,55 240,35 320,40 400,20 480,25 560,12 640,16 720,8 800,10 940,4"
          fill="none"
          stroke={C.sky}
          strokeWidth="2.5"
          opacity="0.5"
        />
        <polyline
          points="0,68 80,60 160,62 240,50 320,55 400,42 480,46 560,38 640,40 720,34 800,30 940,26"
          fill="none"
          stroke={C.electric}
          strokeWidth="1.5"
          opacity="0.3"
        />
        {/* End dot */}
        <circle cx="940" cy="4" r="4" fill={C.sky} opacity="0.9" />
        <circle cx="940" cy="4" r="8" fill={C.sky} opacity="0.2" />
      </svg>

      {/* Main text */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: copy.length > 120 ? "34px" : "42px",
            fontWeight: 800,
            color: textCol,
            lineHeight: 1.3,
          }}
        >
          {copy}
        </div>
        {subtitle && (
          <div
            style={{
              display: "flex",
              fontSize: "22px",
              color: C.muted,
              marginTop: "16px",
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Horizontal bars */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "20px",
        }}
      >
        {[
          { w: "85%", color: C.electric, label: "Automatizacion" },
          { w: "62%", color: C.sky, label: "Integraciones" },
          { w: "48%", color: C.orange, label: "Manual" },
        ].map((bar, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <div style={{ display: "flex", fontSize: "13px", color: C.muted, width: "130px" }}>
              {bar.label}
            </div>
            <div
              style={{
                display: "flex",
                height: "10px",
                width: bar.w,
                borderRadius: "5px",
                backgroundImage: `linear-gradient(90deg, ${bar.color}, ${bar.color}88)`,
                boxShadow: `0 0 12px ${bar.color}33`,
              }}
            />
          </div>
        ))}
      </div>

      <BrandFooter hashtags={hashtags} isDark={isDark} />
    </div>
  );
}

/* ── 6. STATEMENT Template (NEW — bold text-centric) ──────────── */

function StatementTemplate({
  copy,
  subtitle,
  hashtags,
  isDark,
}: {
  copy: string;
  subtitle: string;
  hashtags: string[];
  isDark: boolean;
}) {
  const textCol = isDark ? C.white : C.textDark;

  return (
    <div
      style={{
        width: "1080px",
        height: "1080px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        backgroundImage: isDark
          ? "linear-gradient(160deg, #0F172A 0%, #1a1e3a 40%, #0F172A 100%)"
          : GRAD.light,
        fontFamily: "sans-serif",
      }}
    >
      {/* Subtle decorative quote mark */}
      <svg
        width="300"
        height="250"
        viewBox="0 0 300 250"
        style={{
          display: "flex",
          position: "absolute" as never,
          top: "60px",
          left: "60px",
          opacity: 0.04,
        }}
      >
        <text x="0" y="220" fontSize="300" fontWeight="900" fill={C.electric}>
          {"\u201C"}
        </text>
      </svg>

      <NetworkSVG opacity={0.05} />

      {/* Top: logo */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <AccentLine width={60} />
        <LogoMark />
      </div>

      {/* Center: big bold statement */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        {/* Vertical accent line */}
        <div
          style={{
            display: "flex",
            width: "4px",
            height: "60px",
            backgroundImage: GRAD.accent,
            borderRadius: "2px",
            marginBottom: "40px",
            boxShadow: `0 0 20px ${C.orangeGlow}`,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: copy.length > 100 ? "42px" : copy.length > 60 ? "52px" : "62px",
            fontWeight: 900,
            color: textCol,
            lineHeight: 1.15,
            textAlign: "center",
            justifyContent: "center",
            textShadow: isDark ? `0 4px 40px rgba(0,0,0,0.4)` : "none",
          }}
        >
          {copy}
        </div>
        {subtitle && (
          <div
            style={{
              display: "flex",
              fontSize: "24px",
              color: C.sky,
              marginTop: "28px",
              textAlign: "center",
              justifyContent: "center",
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </div>
        )}
        {/* Bottom accent */}
        <div
          style={{
            display: "flex",
            width: "4px",
            height: "60px",
            backgroundImage: GRAD.accentReverse,
            borderRadius: "2px",
            marginTop: "40px",
            boxShadow: `0 0 20px ${C.electricGlow}`,
          }}
        />
      </div>

      <BrandFooter hashtags={hashtags} isDark={isDark} />
    </div>
  );
}

/* ── Route Handler ────────────────────────────────────────────── */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const copy = searchParams.get("copy") || "DataCore — Tus datos, tu claridad.";
  const hashtags = searchParams.get("hashtags") || "";
  const variant = searchParams.get("variant") || "dark";
  const template = searchParams.get("template") || "hero";
  const title = searchParams.get("title") || "";
  const subtitle = searchParams.get("subtitle") || "";

  const isDark = variant === "dark";
  const hashtagList = hashtags ? hashtags.split(",").map((h) => h.trim()) : [];

  let element: JSX.Element;

  switch (template) {
    case "metric":
      element = <MetricTemplate title={title} copy={copy} subtitle={subtitle} hashtags={hashtagList} isDark={isDark} />;
      break;
    case "comparison":
      element = <ComparisonTemplate copy={copy} hashtags={hashtagList} isDark={isDark} />;
      break;
    case "tips":
      element = <TipsTemplate title={title} copy={copy} hashtags={hashtagList} isDark={isDark} />;
      break;
    case "dashboard":
      element = <DashboardTemplate copy={copy} subtitle={subtitle} hashtags={hashtagList} isDark={isDark} />;
      break;
    case "statement":
      element = <StatementTemplate copy={copy} subtitle={subtitle} hashtags={hashtagList} isDark={isDark} />;
      break;
    case "hero":
    default:
      element = <HeroTemplate copy={copy} subtitle={subtitle} hashtags={hashtagList} isDark={isDark} />;
      break;
  }

  return new ImageResponse(element, {
    width: 1080,
    height: 1080,
  });
}
