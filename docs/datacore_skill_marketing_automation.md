# Skill: DataCore — Automatización de Branding, RRSS y Posicionamiento

---

**Nombre:** `datacore-marketing-automation`  
**Versión:** 1.0  
**Autor:** Mathias Orue — DataCore  
**Fecha:** Abril 2026  
**Propósito:** Documentar con precisión el proceso, las decisiones técnicas, las herramientas utilizadas y los métodos aplicados para automatizar el ciclo completo de branding, comunicación en redes sociales y posicionamiento de una consultora de datos B2B en Paraguay.

---

## Resumen Ejecutivo

Este documento funciona como una "skill" reutilizable: un manual de decisiones y procedimientos que puede ser ejecutado por un agente de IA, un operador humano, o un sistema híbrido, para reproducir —o continuar— el ciclo de marketing de DataCore desde cero o en iteraciones periódicas.

El proceso cubre tres macro-tareas:

1. **Branding:** Definición de identidad visual, generación de logos en múltiples formatos y variantes, definición de tipografías y tokens de color.
2. **Comunicación en RRSS:** Arquitectura de cuentas, bios, pilares de contenido, posts de lanzamiento y calendario editorial.
3. **Agente Automatizado:** Diseño de arquitectura de un agente de IA con módulos de contenido, CRM, posicionamiento y KPIs.

---

## Fase 1 — Reconocimiento del Contexto (Input Gathering)

### Método aplicado

El primer paso fue extraer toda la información disponible de fuentes primarias antes de tomar ninguna decisión creativa. Esto garantiza que la identidad generada sea coherente con lo que la empresa ya construyó, en lugar de imponerse sobre ella.

**Fuentes consultadas:**

| Fuente | URL / Ubicación | Información extraída |
|---|---|---|
| Landing page en producción | `https://landing-datacore.vercel.app/` | Hero copy, tagline, lista de servicios, paleta visual, tipografías en uso, nombre del equipo, propuesta de valor |
| Repositorio GitHub | `https://github.com/Oruemat/datacore-web` | Estructura del proyecto Next.js, componentes, clases de Tailwind con colores exactos, archivos SVG existentes |
| Conversación del usuario | Contexto de sesión | Nombre de fundadores, mercado objetivo (Paraguay, empresas locales), servicios priorizados, tono deseado |

### Decisión clave #1 — No inventar, extraer

El error más frecuente al automatizar branding es que el agente genera una identidad visual genérica sin anclarla en los activos reales del cliente. La decisión fue: **leer el repositorio y la landing antes de generar cualquier asset**. Esto permitió identificar que DataCore ya usaba `#1E3A5F` (azul oscuro), `#FF6B35` (naranja) y `#64B5F6` (azul claro) como paleta base, y que el stack era Next.js + Tailwind.

---

## Fase 2 — Definición del Sistema de Branding

### Método aplicado

Con el contexto extraído, se construyó un sistema de diseño coherente. El criterio fue: **todo token debe tener una razón semántica**, no ser un capricho estético.

### Decisión clave #2 — Paleta de 6 tokens con roles fijos

En lugar de una paleta libre con múltiples colores intercambiables, se definieron exactamente 6 tokens con roles no negociables:

```
--dc-navy:    #1E3A5F   → Fundamento, autoridad, fondo oscuro
--dc-electric:#2563EB   → Acción primaria, links, CTAs
--dc-sky:     #64B5F6   → Accentos secundarios, highlights de datos
--dc-orange:  #FF6B35   → Urgencia, diferenciación, único elemento cálido
--dc-surface: #F8FAFC   → Fondo claro, superficies de cards
--dc-text:    #1E293B   → Texto principal en modo claro
```

**Por qué esta estructura y no otra:** Los fondos oscuros con acento azul + naranja son una combinación de alto reconocimiento en el sector tech/datos. El naranja se restringe a un 10% de la composición para evitar que perciba como una marca de consumo masivo. El azul eléctrico actúa como el color de "datos en movimiento", asociando la marca con acción e inteligencia.

### Decisión clave #3 — Sistema tipográfico de 3 niveles

```
Display:  Satoshi Bold        → Títulos, números grandes, hero
Body:     Inter Regular/Medium → Párrafos, labels, interfaz
Mono:     JetBrains Mono      → Código, métricas, outputs de datos
```

La tipografía mono es el diferenciador de DataCore frente a consultoras generales: comunica "somos gente de datos" sin necesidad de decirlo explícitamente. Satoshi (Fontshare) fue elegida sobre Inter para display porque es menos ubícua y da más personalidad a los títulos.

### Decisión clave #4 — 4 variantes del logo obligatorias

Para garantizar que el logo funcione en todos los contextos reales de uso se definieron exactamente estas 4 variantes, ni más ni menos:

| Variante | Dimensiones | Uso |
|---|---|---|
| Horizontal color | 320×80px | Web, LinkedIn header, firmas de email, presentaciones |
| Cuadrado color | 400×400px | Foto de perfil en todas las RRSS |
| Ícono solo | 200×200px | Favicon, ícono de app, watermark en posts |
| Monocromático negro | 320×80px | Documentos legales, contratos, impresos, fondos blancos |

**Lo que NO se generó y por qué:** No se generó una variante "monocromático blanco" como archivo independiente porque el ícono solo sobre fondo oscuro cumple esa función y duplicar assets genera inconsistencias en el uso.

### Construcción del logo en SVG

El logo se construyó como SVG inline puro, sin dependencias externas, usando geometría básica:

- **Elemento gráfico:** hexágono (referencia a data nodes, grafos, estructuras de red) con un acento de línea diagonal que sugiere upward trend / gráfica de crecimiento.
- **Tipografía del logotipo:** texto renderizado como paths para garantizar que se vea idéntico en cualquier sistema sin importar si la fuente está instalada.
- **Principio aplicado:** el logo debe ser reconocible a 24px (favicon) y a 200px (banner). Se validó visualmente en ambos extremos antes de cerrar el diseño.

```svg
<!-- Estructura del logo — componentes -->
<g id="icon">
  <!-- Hexágono base en navy -->
  <polygon points="..." fill="#1E3A5F"/>
  <!-- Línea de tendencia en naranja -->
  <polyline points="..." stroke="#FF6B35" stroke-width="2.5"/>
  <!-- Nodos de datos en azul claro -->
  <circle cx="..." cy="..." r="3" fill="#64B5F6"/>
</g>
<g id="wordmark">
  <!-- "Data" en bold, "Core" en regular -->
  <text font-family="Satoshi, sans-serif" font-weight="700">Data</text>
  <text font-family="Satoshi, sans-serif" font-weight="400">Core</text>
</g>
```

---

## Fase 3 — Posts para Redes Sociales

### Método aplicado

Cada post se diseñó como un archivo HTML autónomo (con CSS inline) renderizado a PNG mediante `playwright` o `html2image` en Python. Esto permite:

1. Editar el contenido del post modificando solo el HTML (texto, colores, datos)
2. Regenerar el PNG instantáneamente sin abrir ningún software de diseño
3. Versionar los diseños en Git igual que el código

### Decisión clave #5 — HTML-to-PNG en lugar de generación de imágenes por IA

Dos opciones fueron evaluadas:

| Opción | Pros | Contras |
|---|---|---|
| Generar imagen con modelo de imagen (DALL-E, Midjourney) | Rápido para conceptos visuales | No respeta paleta exacta, tipografía inconsistente, difícil de iterar, texto frecuentemente deformado |
| Renderizar HTML como PNG | Control total del diseño, brandbook respetado, editable, versionable | Requiere entorno Python con Playwright o similar |

**Decisión:** HTML-to-PNG. El resultado es pixel-perfect con la guía de marca y el sistema de diseño definido. Cualquier cambio de copy o dato se hace en una línea de código.

### Dimensiones y plataformas

```
Instagram feed:  1080 × 1080 px (cuadrado, ratio 1:1)
LinkedIn post:   1200 × 628 px  (landscape, ratio 1.91:1)
LinkedIn banner: 1584 × 396 px  (banner de perfil, ratio 4:1)
```

### Arquitectura de los 6 posts de Instagram

Cada post sigue la misma grilla base pero con una jerarquía de comunicación diferente:

**Grilla base:**
```
┌─────────────────────────────────────┐
│  Logo + tagline (esquina sup. izq.) │  → 80px alto
├─────────────────────────────────────┤
│                                     │
│         ZONA HERO (60%)             │  → 648px alto
│    Titular + elemento visual        │
│                                     │
├─────────────────────────────────────┤
│  Copy secundario + CTA              │  → 200px alto
├─────────────────────────────────────┤
│  Website + ícono                    │  → 80px alto
└─────────────────────────────────────┘
```

**Secuencia editorial de los 6 posts (orden de publicación):**

| # | Tipo | Objetivo | Copy principal |
|---|---|---|---|
| 1 | Lanzamiento oficial | Awareness | "DataCore ya está en Paraguay" |
| 2 | Pain point | Identificación | "¿Cuánto tiempo perdés en reportes manuales?" |
| 3 | Solución / producto | Consideración | "Dashboards en tiempo real, sin código" |
| 4 | Estadística | Credibilidad | "El 73% de las empresas decide sin datos actualizados" |
| 5 | Antes vs. Después | Conversión | Comparativa visual: Excel manual vs. dashboard |
| 6 | CTA directo | Acción | "Evaluación gratuita de tu infraestructura de datos" |

**Por qué este orden:** Los posts siguen el framework AIDA (Awareness → Interest → Desire → Action) adaptado para redes: los primeros dos crean contexto y resonancia emocional, los del medio construyen credibilidad con datos, y el último convierte. Publicar el CTA primero es el error más común de marcas nuevas.

### Decisión clave #6 — Fondo oscuro para Instagram, claro para LinkedIn

Instagram: fondo `#1E3A5F` (navy) porque el feed de datos/tech tiene más impacto visual con paletas oscuras. El naranja `#FF6B35` actúa como único elemento de calor y detiene el scroll.

LinkedIn: fondo `#F8FAFC` (surface claro) porque el contexto de lectura profesional favorece fondos claros que se perciben como más formales y confiables. El texto oscuro sobre fondo claro tiene mayor legibilidad en pantallas de escritorio donde LinkedIn se consume principalmente.

---

## Fase 4 — Arquitectura del Agente Automatizado

### Método aplicado

El agente se diseñó como un sistema modular de 4 capas independientes que pueden activarse en conjunto o por separado. El principio fue **separación de responsabilidades**: cada módulo tiene un único trabajo, sus propias APIs y su propio ciclo de ejecución.

### Stack tecnológico seleccionado

| Módulo | Herramienta | Por qué esta y no otra |
|---|---|---|
| Orquestador de flujos | Make.com (ex-Integromat) | No requiere código, visual, tiene conectores nativos para todas las apps del stack, tiene plan gratuito para empezar |
| Modelo de lenguaje | GPT-4o (OpenAI API) | Mejor relación calidad/costo para generación de copy en español. Claude fue evaluado pero la API de OpenAI tiene mejor integración con Make |
| CRM | HubSpot (plan gratuito) | Tiene API robusta, registro de contactos, pipeline de deals y tracking de interacciones. Alternativa evaluada: Notion Database, descartada por falta de pipeline visual |
| Email marketing | Brevo (ex-Sendinblue) | Plan gratuito hasta 300 emails/día, soporte nativo para español, mejor entregabilidad que Mailchimp para dominios nuevos en LATAM |
| Scheduling de posts | Buffer | La mejor relación costo/funcionalidad para startups. Alternativa: Hootsuite (más cara), Later (mejor para Instagram pero más cara) |
| Scraping / monitoreo | Apify o Browse.ai | Para monitorear menciones de competidores y palabras clave sin Brandwatch (demasiado caro para una PYME) |

**Por qué Make.com y no Zapier:** Make.com tiene un modelo de ejecución basado en "operaciones" que es 4-5x más barato que Zapier para flujos complejos con múltiples pasos. Además, su editor visual permite construir flujos con condicionales y loops que Zapier maneja peor.

**Por qué no n8n self-hosted:** n8n es gratuito y potente, pero requiere un servidor propio configurado y mantenido. Para el arranque de DataCore, reducir la carga operativa es más importante que reducir el costo marginal.

### Los 4 módulos del agente

#### Módulo 1 — Generador de Contenido

**Flujo:**
```
Trigger (lunes 8am) 
  → Leer Google Sheets con calendario editorial
  → Extraer: tipo de post, pilar, plataforma, fecha
  → Construir prompt con contexto DataCore (system prompt)
  → Llamar GPT-4o → generar copy
  → Guardar en Google Sheets (borrador)
  → Notificar en Slack/WhatsApp para aprobación humana
  → [Si aprobado] → enviar a Buffer para scheduling
```

**System prompt base (inyectado en cada llamada):**
```
Sos el redactor de contenido de DataCore, una consultora de datos B2B 
en Paraguay fundada por Mathias Orue (CEO/BI) y Luis Duarte (CTO).

Servicios: automatización de reportes, dashboards en tiempo real, 
integración de sistemas, insights de datos, agentes IA empresariales.

Mercado: empresas medianas en Paraguay (retail, finanzas, manufactura, 
salud). Decisores: gerentes y dueños de empresa, no necesariamente técnicos.

Tono: experto pero accesible, nunca condescendiente, nunca genérico.
Nunca usar jerga técnica sin explicarla.
Idioma: español rioplatense suave (Paraguay).
CTA siempre: landing-datacore.vercel.app

Formato para Instagram: máximo 150 palabras, 3-5 hashtags relevantes.
Formato para LinkedIn: 200-400 palabras, estilo reflexivo, sin hashtags masivos.
```

#### Módulo 2 — CRM y Nurturing de Leads

**Flujo de clasificación:**
```
Lead entra (formulario web / DM Instagram / LinkedIn)
  → Make.com captura el lead
  → GPT-4o clasifica: frío / tibio / caliente
    Criterios:
      Caliente: menciona proyecto específico + empresa + urgencia
      Tibio: menciona interés pero sin detalles o timeline
      Frío: solo curiosidad, estudiante, o sin empresa
  → HubSpot: crear contacto + asignar etapa del pipeline
  → Brevo: iniciar secuencia de emails según clasificación
```

**Secuencia de nurturing a 14 días:**
```
Día 0:  Email bienvenida + recurso gratuito (mini-guía PDF)
Día 2:  Caso de uso relevante al sector del lead (si está disponible)
Día 5:  Estadística de impacto + link a landing
Día 8:  Pregunta directa: "¿Cuál es tu mayor desafío con datos hoy?"
Día 12: Prueba social (testimonio o caso de éxito)
Día 14: CTA directo: agendar llamada de 20 min
```

#### Módulo 3 — Posicionamiento y SEO Local

**Tácticas aplicadas:**

- **Keywords primarias:** "consultora de datos Paraguay", "dashboards empresariales Paraguay", "automatización de reportes Asunción", "BI Paraguay", "inteligencia de negocios Paraguay"
- **Keywords de long tail:** "cómo implementar un dashboard en mi empresa Paraguay", "cuanto cuesta un sistema de reportes automatizado"
- **Estrategia de hashtags Instagram** (en 3 tiers):
  ```
  Tier 1 (500K-2M posts):  #datos #BI #inteligenciadenegocios
  Tier 2 (50K-500K posts): #datosparaguay #transformaciondigital #dashboards
  Tier 3 (<50K posts):     #datacorepy #consultoriadatos #paraguaytech
  ```
  La mezcla de tiers garantiza visibilidad inmediata (Tier 1) + posicionamiento en nichos (Tier 3).

- **Google Business Profile:** registrar "DataCore — Consultoría de Datos" en Asunción. Es gratuito, aparece en búsquedas locales y Maps.

#### Módulo 4 — KPIs y Reporting

**Métricas semanales automatizadas:**

```
Cada lunes 9am:
  → Pull de métricas LinkedIn (API) + Instagram (API Graph)
  → Pull de leads nuevos en HubSpot
  → Pull de opens/clicks de Brevo
  → GPT-4o genera resumen ejecutivo en 3 bullets
  → Enviar por WhatsApp/email a Mathias y Luis
```

**KPIs objetivo para los primeros 90 días:**

| Métrica | Meta Mes 1 | Meta Mes 2 | Meta Mes 3 |
|---|---|---|---|
| Seguidores LinkedIn | 200 | 500 | 1.000 |
| Seguidores Instagram | 100 | 300 | 700 |
| Leads capturados/mes | 5 | 15 | 30 |
| Tasa apertura email | >35% | >40% | >45% |
| Visitas landing/mes | 200 | 600 | 1.500 |

---

## Fase 5 — Proceso de Generación de Assets (Reproducción Manual o Automática)

Este proceso puede ser ejecutado por un agente de IA que tenga acceso a Python + un navegador headless.

### Dependencias del entorno

```bash
pip install playwright pillow cairosvg
playwright install chromium
```

### Script base para renderizar posts HTML a PNG

```python
import asyncio
from playwright.async_api import async_playwright
from pathlib import Path

async def render_post(html_path: str, output_path: str, width: int, height: int):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": width, "height": height})
        await page.goto(f"file://{Path(html_path).resolve()}")
        await page.wait_for_timeout(500)  # esperar fuentes web
        await page.screenshot(path=output_path, full_page=False)
        await browser.close()

# Instagram 1080x1080
asyncio.run(render_post("posts/ig_lanzamiento.html", "exports/ig_lanzamiento.png", 1080, 1080))

# LinkedIn 1200x628
asyncio.run(render_post("posts/li_presentacion.html", "exports/li_presentacion.png", 1200, 628))
```

### Script para exportar SVG a PNG (logos)

```python
import cairosvg

def export_logo(svg_path: str, output_path: str, width: int):
    cairosvg.svg2png(
        url=svg_path,
        write_to=output_path,
        output_width=width
    )

# Generar todas las variantes
variants = [
    ("logos/datacore_horizontal_color.svg", "exports/logo_horizontal_color.png", 640),
    ("logos/datacore_icono_cuadrado.svg", "exports/logo_icono_cuadrado.png", 400),
    ("logos/datacore_favicon.svg", "exports/favicon.png", 64),
    ("logos/datacore_monocromatico.svg", "exports/logo_monocromatico.png", 640),
]

for svg, png, width in variants:
    export_logo(svg, png, width)
    print(f"✓ Exportado: {png}")
```

---

## Fase 6 — Integración con el Repositorio GitHub

### Estructura de carpetas propuesta para el repositorio `datacore-web`

```
datacore-web/
├── public/
│   ├── favicon.ico          ← logo ícono exportado
│   └── og-image.png         ← imagen Open Graph 1200×628 para compartir en RRSS
├── brand/
│   ├── logos/               ← SVG originales de todas las variantes
│   ├── posts/               ← HTML fuente de cada post
│   ├── exports/             ← PNG finales (gitignored en producción)
│   ├── brandbook.md         ← tokens de color, tipografía, reglas de uso
│   └── scripts/
│       ├── render_posts.py  ← script Playwright
│       └── export_logos.py  ← script cairoSVG
└── ...
```

### Decisión clave #7 — Versionar los HTML fuente, no los PNG

Los PNG son artefactos generados, no fuente de verdad. Guardando los HTML en Git:
- Cualquier cambio de copy se hace en el HTML y se re-renderiza en segundos
- Se puede ver el diff exacto de qué cambió entre versiones
- El agente de IA puede editar el HTML directamente via GitHub API sin necesidad de abrir Photoshop o Canva

---

## Decisiones Resumidas

| # | Decisión | Alternativa descartada | Razón |
|---|---|---|---|
| 1 | Leer repositorio y landing antes de generar | Crear identidad desde cero | Coherencia con activos existentes |
| 2 | Paleta de 6 tokens con roles fijos | Paleta libre de múltiples colores | Consistencia de marca y restricción semántica |
| 3 | Satoshi (Fontshare) para display | Inter en todo | Diferenciación visual, menos ubícua |
| 4 | 4 variantes de logo específicas | Más variantes | Evitar inconsistencias de uso |
| 5 | HTML-to-PNG para posts | Generación por modelo de imagen | Control total, brandbook respetado, editable |
| 6 | Fondo oscuro Instagram, claro LinkedIn | Coherencia entre plataformas | Optimización por contexto de consumo |
| 7 | Make.com como orquestador | Zapier / n8n self-hosted | Precio y facilidad de mantenimiento |
| 8 | GPT-4o con system prompt contextual | Prompts genéricos | Contenido que solo podría ser de DataCore |
| 9 | Versionar HTML fuente, no PNG | Versionar PNG | Editabilidad, diff claro, re-generación fácil |

---

## Cómo Reutilizar Esta Skill para Otro Cliente

Para aplicar este mismo proceso a otra empresa, reemplazar:

1. **Fase 1:** URLs de la landing y el repositorio del nuevo cliente
2. **Colores extraídos** → actualizar los 6 tokens de la paleta
3. **System prompt del Módulo 1** → reescribir con el contexto del nuevo cliente (servicios, mercado, tono, idioma)
4. **Secuencia de nurturing** → ajustar recursos gratuitos y casos de uso al sector del cliente
5. **Keywords de posicionamiento** → investigar términos locales del nuevo mercado

El resto del proceso (grilla de posts, scripts de exportación, arquitectura de Make.com) se reutiliza sin modificaciones.

---

## Stack Completo Resumido

```
Reconocimiento:     Fetch de URL + lectura de repositorio GitHub
Branding:           SVG manual + tokens CSS + Python cairoSVG
Posts:              HTML + CSS inline + Playwright headless → PNG
Orquestación:       Make.com
Contenido IA:       OpenAI GPT-4o (API)
CRM:                HubSpot (plan gratuito)
Email:              Brevo (ex-Sendinblue)
Scheduling:         Buffer
Monitoreo:          Apify / Browse.ai
Reporting:          Google Sheets + WhatsApp Business API
Costo estimado:     USD 39–60/mes en estado operativo completo
```

---

*Skill documentada en el contexto del proyecto DataCore — Asunción, Paraguay, Abril 2026.*
