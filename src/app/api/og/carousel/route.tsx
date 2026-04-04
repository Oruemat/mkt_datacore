import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Brand colors
const NAVY = "#0F172A";
const ELECTRIC = "#1D4ED8";
const SKY = "#64B5F6";
const ORANGE = "#F97316";
const SURFACE = "#F8FAFC";
const MUTED = "#64748B";

function SlideProgressDots({
  current,
  total,
  variant,
}: {
  current: number;
  total: number;
  variant: string;
}) {
  const dots = [];
  for (let i = 1; i <= total; i++) {
    dots.push(
      <div
        key={i}
        style={{
          display: "flex",
          width: i === current ? "28px" : "12px",
          height: "12px",
          borderRadius: "6px",
          backgroundColor: i === current ? ORANGE : variant === "dark" ? "#334155" : "#CBD5E1",
          marginRight: i < total ? "8px" : "0px",
        }}
      />
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      {dots}
    </div>
  );
}


function CoverSlide({
  title,
  body,
  total,
}: {
  title: string;
  body: string;
  total: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "1080px",
        height: "1080px",
        backgroundColor: NAVY,
        color: SURFACE,
      }}
    >
      {/* Geometric accent shapes */}
      <div
        style={{
          display: "flex",
          position: "absolute" as never,
          top: "0px",
          right: "0px",
          width: "400px",
          height: "400px",
          backgroundColor: ELECTRIC,
          opacity: 0.08,
          borderRadius: "0px 0px 0px 400px",
        }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute" as never,
          bottom: "0px",
          left: "0px",
          width: "300px",
          height: "300px",
          backgroundColor: SKY,
          opacity: 0.06,
          borderRadius: "0px 300px 0px 0px",
        }}
      />

      {/* Top branding bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: "64px",
          paddingRight: "64px",
          paddingTop: "56px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "48px",
            height: "48px",
            backgroundColor: ELECTRIC,
            borderRadius: "12px",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "16px",
          }}
        >
          <span style={{ fontSize: "24px", fontWeight: 800, color: "white" }}>D</span>
        </div>
        <span
          style={{
            fontSize: "24px",
            fontWeight: 700,
            letterSpacing: "4px",
            color: SURFACE,
          }}
        >
          DATACORE
        </span>
      </div>

      {/* Main title area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
          paddingLeft: "64px",
          paddingRight: "64px",
        }}
      >
        {/* Orange accent bar */}
        <div
          style={{
            display: "flex",
            width: "80px",
            height: "6px",
            backgroundColor: ORANGE,
            borderRadius: "3px",
            marginBottom: "32px",
          }}
        />
        <span
          style={{
            fontSize: "64px",
            fontWeight: 800,
            lineHeight: 1.1,
            color: SURFACE,
            marginBottom: "24px",
          }}
        >
          {title}
        </span>
        {body && (
          <span
            style={{
              fontSize: "28px",
              fontWeight: 400,
              color: MUTED,
              lineHeight: 1.5,
            }}
          >
            {body}
          </span>
        )}
      </div>

      {/* Bottom bar with dots */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "64px",
          paddingRight: "64px",
          paddingBottom: "56px",
        }}
      >
        <SlideProgressDots current={1} total={total} variant="dark" />
        <span style={{ fontSize: "18px", color: MUTED }}>Desliza para ver mas</span>
      </div>
    </div>
  );
}

function ContentSlide({
  slideNumber,
  total,
  title,
  body,
  variant,
}: {
  slideNumber: number;
  total: number;
  title: string;
  body: string;
  variant: string;
}) {
  const isDark = variant === "dark";
  const bg = isDark ? NAVY : SURFACE;
  const textColor = isDark ? SURFACE : NAVY;
  const bodyColor = isDark ? "#CBD5E1" : "#475569";

  // Split body by newlines or semicolons for bullet-style rendering
  const bodyLines = body
    .split(/[;\n]/)
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "1080px",
        height: "1080px",
        backgroundColor: bg,
        color: textColor,
      }}
    >
      {/* Left accent border */}
      <div
        style={{
          display: "flex",
          width: "8px",
          height: "1080px",
          backgroundColor: SKY,
        }}
      />

      {/* Content area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          paddingLeft: "56px",
          paddingRight: "64px",
          paddingTop: "56px",
          paddingBottom: "56px",
        }}
      >
        {/* Top: slide counter */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "48px",
          }}
        >
          <span style={{ fontSize: "20px", fontWeight: 600, color: MUTED }}>
            {String(slideNumber).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <SlideProgressDots current={slideNumber} total={total} variant={variant} />
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "40px",
          }}
        >
          <span
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: ELECTRIC,
              lineHeight: 1.2,
            }}
          >
            {title}
          </span>
          <div
            style={{
              display: "flex",
              width: "60px",
              height: "4px",
              backgroundColor: ORANGE,
              borderRadius: "2px",
              marginTop: "20px",
            }}
          />
        </div>

        {/* Body content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          {bodyLines.length > 1
            ? bodyLines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "10px",
                      height: "10px",
                      borderRadius: "5px",
                      backgroundColor: SKY,
                      marginTop: "12px",
                      marginRight: "16px",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "28px",
                      fontWeight: 400,
                      color: bodyColor,
                      lineHeight: 1.6,
                    }}
                  >
                    {line}
                  </span>
                </div>
              ))
            : (
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 400,
                  color: bodyColor,
                  lineHeight: 1.7,
                }}
              >
                {body}
              </span>
            )}
        </div>

        {/* Watermark */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "5px",
              color: isDark ? "#1E293B" : "#E2E8F0",
            }}
          >
            DATACORE
          </span>
        </div>
      </div>
    </div>
  );
}

function SummarySlide({
  slideNumber,
  total,
  title,
  body,
  variant,
}: {
  slideNumber: number;
  total: number;
  title: string;
  body: string;
  variant: string;
}) {
  const isDark = variant === "dark";
  const bg = isDark ? NAVY : SURFACE;
  const textColor = isDark ? SURFACE : NAVY;

  const items = body
    .split(/[;\n]/)
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "1080px",
        height: "1080px",
        backgroundColor: bg,
        color: textColor,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "64px",
          paddingRight: "64px",
          paddingTop: "56px",
        }}
      >
        <span style={{ fontSize: "20px", fontWeight: 600, color: MUTED }}>
          {String(slideNumber).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <SlideProgressDots current={slideNumber} total={total} variant={variant} />
      </div>

      {/* Header with highlight bg */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "64px",
          marginRight: "64px",
          marginTop: "40px",
          backgroundColor: ELECTRIC,
          borderRadius: "16px",
          paddingLeft: "36px",
          paddingRight: "36px",
          paddingTop: "28px",
          paddingBottom: "28px",
        }}
      >
        <span
          style={{
            fontSize: "40px",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.2,
          }}
        >
          {title}
        </span>
      </div>

      {/* Items */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          paddingLeft: "64px",
          paddingRight: "64px",
          paddingTop: "36px",
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isDark ? "#1E293B" : "#F1F5F9",
              borderRadius: "12px",
              paddingLeft: "24px",
              paddingRight: "24px",
              paddingTop: "20px",
              paddingBottom: "20px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "36px",
                height: "36px",
                borderRadius: "18px",
                backgroundColor: ORANGE,
                alignItems: "center",
                justifyContent: "center",
                marginRight: "20px",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: 700, color: "white" }}>
                {i + 1}
              </span>
            </div>
            <span
              style={{
                fontSize: "26px",
                fontWeight: 500,
                color: isDark ? "#CBD5E1" : "#334155",
                lineHeight: 1.4,
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* Watermark */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingRight: "64px",
          paddingBottom: "48px",
        }}
      >
        <span
          style={{
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "5px",
            color: isDark ? "#1E293B" : "#E2E8F0",
          }}
        >
          DATACORE
        </span>
      </div>
    </div>
  );
}

function CTASlide({
  total,
  title,
}: {
  total: number;
  title: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "1080px",
        height: "1080px",
        backgroundColor: ELECTRIC,
        color: "white",
      }}
    >
      {/* Decorative shapes */}
      <div
        style={{
          display: "flex",
          position: "absolute" as never,
          top: "0px",
          left: "0px",
          width: "350px",
          height: "350px",
          backgroundColor: "#2563EB",
          opacity: 0.5,
          borderRadius: "0px 0px 350px 0px",
        }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute" as never,
          bottom: "0px",
          right: "0px",
          width: "280px",
          height: "280px",
          backgroundColor: "#1E40AF",
          opacity: 0.5,
          borderRadius: "280px 0px 0px 0px",
        }}
      />

      {/* Top dots */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          paddingTop: "56px",
        }}
      >
        <SlideProgressDots current={total} total={total} variant="dark" />
      </div>

      {/* Center content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: "80px",
          paddingRight: "80px",
        }}
      >
        {/* Orange accent */}
        <div
          style={{
            display: "flex",
            width: "60px",
            height: "6px",
            backgroundColor: ORANGE,
            borderRadius: "3px",
            marginBottom: "32px",
          }}
        />

        <span
          style={{
            fontSize: "52px",
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "16px",
          }}
        >
          {title || "Evalua tu situacion gratis"}
        </span>

        <span
          style={{
            fontSize: "24px",
            fontWeight: 400,
            color: "#BFDBFE",
            textAlign: "center",
            marginBottom: "56px",
          }}
        >
          Agenda una consulta sin compromiso
        </span>

        {/* Contact info cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Phone */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: "16px",
              paddingLeft: "32px",
              paddingRight: "32px",
              paddingTop: "22px",
              paddingBottom: "22px",
              marginBottom: "16px",
              width: "600px",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "28px", marginRight: "16px" }}>📞</span>
            <span style={{ fontSize: "28px", fontWeight: 600, color: "white" }}>
              +595 971 850 259
            </span>
          </div>

          {/* Email */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: "16px",
              paddingLeft: "32px",
              paddingRight: "32px",
              paddingTop: "22px",
              paddingBottom: "22px",
              width: "600px",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "28px", marginRight: "16px" }}>✉️</span>
            <span style={{ fontSize: "28px", fontWeight: 600, color: "white" }}>
              contacto@datacore.com
            </span>
          </div>
        </div>
      </div>

      {/* Bottom branding */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: "56px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "40px",
            height: "40px",
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: "10px",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "12px",
          }}
        >
          <span style={{ fontSize: "20px", fontWeight: 800, color: "white" }}>D</span>
        </div>
        <span
          style={{
            fontSize: "22px",
            fontWeight: 700,
            letterSpacing: "4px",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          DATACORE
        </span>
      </div>
    </div>
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const slideNumber = parseInt(searchParams.get("slideNumber") || "1", 10);
  const totalSlides = parseInt(searchParams.get("totalSlides") || "7", 10);
  const title = searchParams.get("title") || "";
  const body = searchParams.get("body") || "";
  const variant = searchParams.get("variant") || "dark";

  // Determine which slide layout to render
  let slideContent: JSX.Element;

  if (slideNumber === 1) {
    // Cover slide
    slideContent = (
      <CoverSlide title={title} body={body} total={totalSlides} />
    );
  } else if (slideNumber === totalSlides) {
    // CTA slide (last)
    slideContent = (
      <CTASlide total={totalSlides} title={title} />
    );
  } else if (slideNumber === totalSlides - 1) {
    // Summary/tips slide (second to last)
    slideContent = (
      <SummarySlide
        slideNumber={slideNumber}
        total={totalSlides}
        title={title}
        body={body}
        variant={variant}
      />
    );
  } else {
    // Content slides (2 through totalSlides-2)
    slideContent = (
      <ContentSlide
        slideNumber={slideNumber}
        total={totalSlides}
        title={title}
        body={body}
        variant={variant}
      />
    );
  }

  return new ImageResponse(slideContent, {
    width: 1080,
    height: 1080,
  });
}
