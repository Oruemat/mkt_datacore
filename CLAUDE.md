# DataCore Studio — Contexto de Proyecto

> Este archivo complementa el `CLAUDE.md` raíz. No repite reglas globales.

## Stack
- Next.js + TypeScript
- Remotion (renderizado de imágenes/video)
- Supabase (auth + storage)
- Anthropic API (generación de contenido)

## Sistema de composición visual

### Dos sistemas (en migración)
1. **Legacy — `imageTemplate`**: 6 templates rígidos. **DEPRECADO, no usar.**
2. **Nuevo — `composition` (DCComposition)**: JSON con `background` + `layout` + `elements[]`.
   14 tipos de bloque renderizados por `ELEMENT_REGISTRY`.

Tipos de elemento: `richText, badge, checklist, ctaBar, metric, card, spacer, logo, quote, comparison, divider, sparkline, icon, image`.

### Dos prompts paralelos — AMBOS deben estar sincronizados
| Archivo | Función | Qué debe pedir |
|---------|---------|----------------|
| `src/lib/agent/handlers.ts` | Generación **inicial** (Instagram + LinkedIn) | `composition` obligatorio |
| `src/lib/agent/design-prompt.ts` | Chat de **edición** de diseño | `composition` obligatorio |

**Si solo se actualiza uno, el agente vuelve a producir templates rígidos.**

## Archivos críticos
- `src/app/studio/page.tsx` — UI principal, `extractContent`, `remotionPostProps`
- `src/remotion/mapAgentToProps.ts` — Mapper agente → props Remotion
- `src/remotion/compositions/DCPostVisual.tsx` — Composition principal
- `src/remotion/compositions/DCCompositionRenderer.tsx` — Renderer bloques
- `src/remotion/components/elements/` — Element renderers individuales
- `src/remotion/types/` — Tipos `DCComposition`
- `src/remotion/presets/` — Templates y spacing tokens

## Estado último fix
- Reescritos handlers Instagram/LinkedIn: eliminado `imageTemplate`, `composition` obligatorio
- `extractContent` detecta `json.composition`
- Build limpio

## Pendiente
- Verificar que generación inicial produce composición por bloques
