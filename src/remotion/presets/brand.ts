/**
 * DataCore brand identity — aligned with landing-datacore.vercel.app
 *
 * DESIGN PHILOSOPHY:
 * - Clean, light, professional — white/light backgrounds, not dark
 * - Rounded corners (rounded-2xl, rounded-3xl) — soft, approachable
 * - Generous padding and whitespace
 * - Blue-600 as primary action color (#2563EB)
 * - Orange-500 as warm accent (#F97316)
 * - Green-600 for positive/results (#16A34A)
 * - Gradient buttons: blue-600→blue-700, green-600→green-700, orange-500→orange-600
 * - Hero gradient: from-blue-50 via-white to-orange-50
 * - Cards: white bg, border-gray-200, rounded-2xl, shadow-lg
 * - Typography: system sans-serif (Inter), bold headings, gray-900 for text
 * - Badges: colored bg (blue-100, orange-100, green-100) with rounded-full
 * - Tone: direct Paraguayan Spanish, "vos" form, relatable business pain points
 */

export const DC_BRAND = {
  name: "DataCorePY",
  handle: "@datacore",
  tagline: "Transformamos datos en decisiones inteligentes",
  slogan: "Dejá de decidir por intuición",

  colors: {
    // Primary palette (from landing)
    blue600: "#2563EB",   // Primary CTA, buttons, links, accents
    blue700: "#1D4ED8",   // Hover states, gradient endpoint
    blue100: "#DBEAFE",   // Light blue badges/backgrounds
    blue50: "#EFF6FF",    // Very light blue sections

    // Secondary warm accent
    orange500: "#F97316",  // Warm accent, highlights, max 20%
    orange600: "#EA580C",  // Gradient endpoint
    orange100: "#FFEDD5",  // Light orange badges
    orange50: "#FFF7ED",   // Very light orange sections

    // Success/Results
    green600: "#16A34A",   // Positive results, growth, success
    green700: "#15803D",   // Gradient endpoint
    green100: "#DCFCE7",   // Light green badges
    green50: "#F0FDF4",    // Light green backgrounds

    // Neutrals
    white: "#FFFFFF",
    gray50: "#F9FAFB",    // Light section backgrounds
    gray100: "#F3F4F6",   // Borders, dividers light
    gray200: "#E5E7EB",   // Card borders
    gray300: "#D1D5DB",   // Input borders, muted elements
    gray400: "#9CA3AF",   // Placeholder text
    gray600: "#4B5563",   // Body text
    gray700: "#374151",   // Secondary headings
    gray900: "#111827",   // Primary headings, nav text
    black50: "rgba(0,0,0,0.5)", // Overlay

    // Dark mode (for contrast variants)
    navy: "#0F172A",
    navyLight: "#1E293B",
  },

  gradients: {
    // Hero background
    hero: ["#EFF6FF", "#FFFFFF", "#FFF7ED"],        // from-blue-50 via-white to-orange-50
    // CTA buttons
    primaryBtn: ["#2563EB", "#1D4ED8"],             // from-blue-600 to-blue-700
    successBtn: ["#16A34A", "#15803D"],             // from-green-600 to-green-700
    warmBtn: ["#F97316", "#EA580C"],                // from-orange-500 to-orange-600
    specialBtn: ["#9333EA", "#DB2777"],             // from-purple-600 to-pink-600
    // Section backgrounds
    lightSection: ["#F9FAFB", "#FFFFFF", "#EFF6FF"], // from-gray-50 via-white to-blue-50
    // Dark variant
    dark: ["#0F172A", "#1E293B"],
  },

  // Card styles (from landing)
  cards: {
    borderRadius: 16,     // rounded-2xl
    borderColor: "#E5E7EB",
    shadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
    shadowHover: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
    padding: 32,
  },

  // Badge styles (from landing)
  badges: {
    blue: { bg: "#DBEAFE", text: "#1D4ED8" },
    orange: { bg: "#FFEDD5", text: "#C2410C" },
    green: { bg: "#DCFCE7", text: "#15803D" },
  },

  watermark: {
    text: "DataCorePY",
    opacity: 0.4,
    fontSize: 13,
  },

  cta: {
    primary: "Evaluá tu situación gratis",
    secondary: "Conocer más",
    phone: "+595 971 850 259",
    email: "contacto@datacore.com",
  },

  // Key messaging (from landing)
  messaging: {
    hero: "Transformamos datos en decisiones inteligentes",
    subhero: "Automatización de reportes empresariales",
    painPoint: "Reportes inconsistentes, datos dispersos y decisiones basadas en intuición",
    solution: "Te ayudamos a automatizar tus reportes manuales y a entender tu negocio con datos claros",
    mission: "Que tu negocio tenga la información correcta, en el momento correcto",
  },

  founders: {
    ceo: { name: "Mathias Orue", title: "CEO & Co-fundador" },
    cto: { name: "Luis Duarte", title: "CTO & Co-fundador" },
  },

  services: [
    "Automatización de Reportes",
    "Dashboards Personalizados",
    "Consultoría en Datos",
    "Control Operativo Multi-Sucursal",
    "Desarrollo a Medida",
    "Sistema POS",
  ],
} as const;
