# DataCore — Documento Maestro de Contexto
### Versión 1.0 · Asunción, Paraguay · Abril 2026
### Para uso con Claude, GPT-4o o cualquier LLM con ventana de contexto extendida

---

> **Cómo usar este documento:** Pegá el contenido completo al inicio de cualquier conversación con un LLM.
> El modelo tendrá contexto total sobre DataCore, sus servicios, identidad visual, estrategia de marketing,
> arquitectura del agente y las decisiones técnicas ya tomadas. No será necesario re-explicar nada desde cero.

---

## BLOQUE 1 — IDENTIDAD DE LA EMPRESA

### 1.1 Datos Fundamentales

| Campo | Valor |
|---|---|
| **Nombre** | DataCore |
| **Tipo** | Consultora de Datos / IT / Desarrollo a Medida |
| **Sede** | Asunción, Paraguay |
| **Año de inicio** | 2026 |
| **Landing (temporal)** | https://landing-datacore.vercel.app/ |
| **Repositorio** | https://github.com/Oruemat/datacore-web |
| **Email** | contacto@datacore.com |
| **Teléfono** | +595 971 850 259 |
| **Stack técnico** | Next.js + Tailwind CSS + Supabase (formulario de leads) |

### 1.2 Equipo Fundador

| Persona | Rol | Foco |
|---|---|---|
| **Mathias Orue** | CEO | Business Intelligence, Marketing CRM, Transformación Digital |
| **Luis Duarte** | CTO | Automatización, Desarrollo empresarial |

### 1.3 Propuesta de Valor Central

> *"Automatizamos tus reportes manuales y te ayudamos a entender tu negocio con datos claros,
> sin depender de la persona que sabe de Excel."*

**Pain point principal:** Empresas en crecimiento que sienten que ya no controlan su información:
reportes que llegan tarde, datos inconsistentes entre sucursales, y decisiones que se toman "a ojo".

**CTA principal:** *"Evaluá tu situación gratis"* — diagnóstico sin costo como entrada al funnel.

### 1.4 Servicios (Portfolio Completo)

| # | Servicio | Descripción | Cliente tipo |
|---|---|---|---|
| 1 | **Automatización de Reportes** | Reportes financieros, operativos y de ventas que se generan solos, sin intervención humana | Empresa con equipo contable/administrativo |
| 2 | **Dashboards Personalizados** | Visualización de ventas, rentabilidad, stock y operaciones en tiempo real | Gerente / Director que necesita visión general |
| 3 | **Sistema POS Multi-sucursal** | Punto de Venta con control y visibilidad centralizada de múltiples locales | Comercio con 2+ sucursales |
| 4 | **Control Operativo Multi-sucursal** | Vista unificada, alertas automáticas y KPIs por local | Cadena de negocios / franquicia |
| 5 | **CRM Analítico** | Segmentación de clientes, detección de churn, retención automática | Empresa con base de clientes activa |
| 6 | **Desarrollo a Medida** | Formularios digitales, chatbots, control de inventario, administración de empleados, RRHH | Empresa que necesita digitalizar un proceso específico |

### 1.5 Posicionamiento Competitivo

**Enemigos de la marca** (no personas, sino situaciones):
- El Excel manual al final del mes
- La "persona que es la única que sabe" de los reportes
- Los datos inconsistentes entre sucursales
- Las decisiones tomadas sin información actualizada

**Diferenciadores clave:**
- Foco 100% en empresas paraguayas — lenguaje, plazos y realidad local
- Diagnóstico gratuito como punto de entrada sin compromiso
- Entrega de valor visible desde el primer mes
- Equipo de 2 personas = acceso directo a los fundadores, sin intermediarios

---

## BLOQUE 2 — IDENTIDAD VISUAL (BRANDBOOK)

### 2.1 Paleta de Colores — Tokens con Roles Fijos

| Token CSS | Nombre | Hex | Rol semántico | Ratio de uso |
|---|---|---|---|---|
| `--dc-navy` | Navy Core | `#0F172A` | Fondos oscuros, footer, texto principal | Base |
| `--dc-electric` | DataBlue | `#1D4ED8` | Color principal, CTAs, títulos destacados | 60% |
| `--dc-sky` | Sky Blue | `#64B5F6` | Acentos secundarios, highlights de datos | Apoyo |
| `--dc-orange` | DataOrange | `#F97316` | Urgencia, diferenciación, único cálido | 10% |
| `--dc-surface` | Ice White | `#F8FAFC` | Fondos claros, tarjetas, secciones alternas | 30% |
| `--dc-muted` | Slate Gray | `#64748B` | Texto secundario, subtítulos, etiquetas | UI |

> **Regla:** Azul 60% · Blanco/Gris 30% · Naranja 10%. La triada Azul–Naranja–Verde
> está establecida en la landing y debe mantenerse consistente en todas las piezas.

**Soporte adicional:**
- `--dc-green: #16A34A` → Indicadores positivos, métricas de éxito (solo datos/charts)
- Patrón de fondo: grid de puntos en `#EFF6FF` para RRSS

### 2.2 Tipografías

| Rol | Fuente | Peso | CDN | Uso |
|---|---|---|---|---|
| **Display** | Satoshi | 700 / 800 | Fontshare | Titulares, portadas RRSS, carruseles |
| **Body** | Inter | 400 / 500 / 600 | Google Fonts | Cuerpo de texto, descripciones, captions |
| **Monospace** | JetBrains Mono | 400 | Google Fonts | Datos, números, fragmentos técnicos |

> **Regla tipográfica:** Máximo 2 familias por pieza.
> Jerarquía: Título grande Satoshi → Subtítulo Inter semibold → Cuerpo Inter regular.

### 2.3 Sistema de Logo — 4 Versiones

| Versión | Formato | Dimensiones | Uso |
|---|---|---|---|
| Horizontal Completo | SVG + PNG transparente | 400×100px | LinkedIn, emails, header web |
| Ícono Cuadrado 1:1 | SVG + PNG | 400×400px | Foto de perfil Instagram/Facebook/LinkedIn |
| Ícono Solo (núcleo/D) | SVG + PNG | 200×200px | Favicon, watermark en contenido |
| Monocromático | SVG Negro y Blanco | Todas | Documentos, presentaciones formales |

**Concepto del ícono:** Forma geométrica que evoca un núcleo de datos — hexágono o nodos
conectados con la letra "D" integrada. Líneas limpias, sin gradientes, legible desde 24px a 200px.

### 2.4 Elementos de Identidad Complementarios

- **Patrón de fondo RRSS:** Grid de puntos en `#EFF6FF`
- **Elemento decorativo:** Líneas de chart/datos abstracto en covers y carruseles
- **Frame para fotos:** Borde azul con gradiente + ícono DataCore en esquina inferior derecha
- **Overlay de fotos:** Degradado de azul marino (`#0F172A`) a transparente
- **Mockup base carruseles:** Fondo `#0F172A`, texto blanco, accents azul y naranja

---

## BLOQUE 3 — ESTRATEGIA DE REDES SOCIALES

### 3.1 Datos de Cuentas (Para Creación)

#### LinkedIn Company Page
```
Nombre:          DataCore
URL:             linkedin.com/company/datacore-py
Industria:       Technology, Information and Internet
Tamaño:          2-10 empleados
Tipo:            Privately Held
Sitio web:       landing-datacore.vercel.app
Headline:        Automatización de Reportes · BI · Desarrollo a Medida · Paraguay
```

**Descripción "About" (hasta 2000 caracteres):**
DataCore es una consultora tecnológica paraguaya especializada en automatización de reportes,
Business Intelligence y desarrollo de soluciones a medida para empresas en crecimiento.

Trabajamos con empresas que están creciendo y sienten que ya no controlan su información:
reportes que llegan tarde, datos inconsistentes entre sucursales y decisiones que se toman "a ojo".
Nuestra misión: que tu negocio tenga la información correcta, en el momento correcto.

✅ Automatización de reportes manuales · ✅ Dashboards en tiempo real
✅ Sistemas POS multi-sucursal · ✅ CRM analítico · ✅ Desarrollo a medida

📍 Asunción, Paraguay | 📧 contacto@datacore.com | 📞 +595 971 850 259

#### Instagram
```
Username:    @datacore.py
Nombre:      DataCore | Datos & BI Paraguay
Categoría:   Consultoría empresarial
Bio:         📊 Consultora de Datos · Paraguay
             Automatizamos reportes y dashboards
             Sin Excel manual. Sin depender de nadie.
             👇 Evaluación gratuita
Enlace:      landing-datacore.vercel.app
```

#### Facebook
```
Nombre:      DataCore Paraguay
Username:    @DataCorePY
Categoría:   Empresa de tecnología / Consultor de negocios
Descripción: Consultora de datos y automatización en Paraguay.
             Transformamos reportes manuales en dashboards inteligentes.
```

### 3.2 Pilares de Contenido

| Pilar | % | Formato principal | Ejemplos |
|---|---|---|---|
| **Educativo** | 35% | Carrusel, post texto LinkedIn | "3 señales de que tus reportes te frenan", "¿Qué es un dashboard?" |
| **Casos de Éxito** | 25% | Infografía, LinkedIn texto largo | Portfolio: POS, reportes financieros, dashboard ventas |
| **Pain Points** | 20% | Reel, Story encuesta | "¿Tu empresa todavía depende del Excel al final del mes?" |
| **Behind the Scenes** | 10% | Fotos, Stories | Equipo, proceso de trabajo, herramientas |
| **Promocional** | 10% | Post con CTA | "Evaluá tu situación gratis — sin compromiso" |

### 3.3 Frecuencia y Horarios (GMT-4 Paraguay)

| Plataforma | Frecuencia | Días | Horarios |
|---|---|---|---|
| **LinkedIn** | 3x/semana | Mar, Mié, Jue | 8:00 AM · 12:00 PM |
| **Instagram** | 4x/semana | Lun, Mié, Vie, Dom | 7:00 PM · 9:00 PM |
| **Facebook** | 3x/semana | Lun, Mié, Vie | 12:00 PM · 7:00 PM |

### 3.4 Hashtags Estratificados

| Nivel | Hashtags | Cuándo usar |
|---|---|---|
| **Nicho PY** | `#DataCore` `#DatosParaguay` `#EmpresaParaguay` `#AutomatizaciónParaguay` | Siempre |
| **Industria** | `#BusinessIntelligence` `#ReportesAutomáticos` `#Dashboard` `#PowerBI` | Siempre |
| **Trending** | `#TransformaciónDigital` `#DataAnalytics` `#IA` `#Automatización` | Rotar |

---

## BLOQUE 4 — ARQUITECTURA DEL AGENTE AUTOMATIZADO

### 4.1 Stack Tecnológico

| Herramienta | Rol | Costo/mes |
|---|---|---|
| **Make.com** | Orquestador principal de automatizaciones | ~$9 |
| **OpenAI GPT-4o** | Generación de contenido, clasificación de leads | ~$10-20 |
| **Supabase** | Base de datos de leads (ya instalado en la landing) | Gratis |
| **HubSpot** | CRM de contactos y pipeline de ventas | Gratis |
| **Brevo** | Email marketing y secuencias de nurturing | Gratis hasta 300/día |
| **Buffer** | Scheduling y publicación en RRSS | ~$15 |
| **Google Sheets** | Calendario editorial y control manual | Gratis |
| **Playwright** | Renderizado HTML-to-PNG para posts | Open source |

**Costo total estimado:** USD 39–60/mes en estado operativo.

### 4.2 Flujo End-to-End

```
[TRIGGER]
Formulario Supabase / DM Instagram / DM LinkedIn / Solicitud manual
         ↓
[MAKE.COM — ORQUESTADOR]
         ↓
┌────────────────────────────────────────────────────────────────┐
│  MÓDULO A: Generador de Contenido                              │
│  Google Sheets (calendario) → GPT-4o (system prompt DataCore)  │
│  → Brandbook Enforcer → Buffer (scheduling)                    │
│                                                                │
│  MÓDULO B: CRM de Leads                                        │
│  Supabase (nuevo lead) → GPT-4o (clasificador BANT)            │
│  → CALIENTE: notif WhatsApp + HubSpot deal                     │
│  → TIBIO: secuencia Brevo 7 días                               │
│  → FRÍO: secuencia Brevo 14 días                               │
│                                                                │
│  MÓDULO C: Posicionamiento                                     │
│  Keywords locales PY + hashtags estratificados                 │
│  Monitor de menciones + respuestas automáticas a DMs           │
│                                                                │
│  MÓDULO D: Reporting Semanal                                   │
│  Pull métricas (LI + IG + Brevo + HubSpot)                     │
│  → GPT-4o (resumen 3 bullets) → WhatsApp Mathias/Luis         │
└────────────────────────────────────────────────────────────────┘
         ↓
[OUTPUT]
Post publicado / Lead clasificado / Reporte ejecutivo / Respuesta enviada
```

### 4.3 Módulo A — Generación de Contenido

**Comandos disponibles:**

| Comando | Plataforma | Estructura del output |
|---|---|---|
| `POST_LINKEDIN` | LinkedIn | Pain point → historia → solución DataCore → dato → CTA |
| `POST_INSTAGRAM` | Instagram | Gancho 1 línea → 100-150 palabras → CTA → 20-25 hashtags |
| `CARRUSEL` | Ambas | Slide 1 título impactante → Slides 2-6 puntos → Slide 7 CTA |
| `REELS_SCRIPT` | Instagram | Gancho 3s + Problema 10s + Solución 15s + CTA 7s |
| `RESPUESTA_DM` | Instagram/LI | Saludo nombre + reconocer pain point + oferta evaluación gratuita |
| `STORY_ENCUESTA` | Instagram | Pregunta de pain point + 2 opciones (Sí/No o A/B) |
| `EMAIL_NURTURING` | Brevo | Asunto + cuerpo + CTA según día de la secuencia |

**Brandbook Enforcer (validación obligatoria antes de publicar):**
Cada pieza generada pasa por una verificación que controla: paleta de colores correcta, tipografías,
tono sin tecnicismos, CTA presente, hashtags estratificados incluidos. Si falla → notifica a Mathias.

### 4.4 Módulo B — Clasificación de Leads (BANT Adaptado)

| Criterio | Señales de lead CALIENTE |
|---|---|
| **Budget** | Empresa mediana, menciona sistema actual (SAP, contabilidad, etc.) |
| **Authority** | Dueño, gerente general, gerente financiero, director |
| **Need** | Menciona Excel, reportes manuales, sucursales, pérdida de tiempo, datos incorrectos |
| **Timeline** | "Necesito para fin de mes", "estamos en expansión", "tuvimos un problema reciente" |

**Secuencia de nurturing — Lead frío (14 días):**

| Día | Canal | Asunto | Objetivo |
|---|---|---|---|
| 1 | Email | "Gracias por contactar a DataCore" | Bienvenida + guía: "3 señales de que necesitás automatizar" |
| 3 | Email | "¿Te identificás con esto?" | Historia empresa similar + link a caso del portfolio |
| 7 | Email | "Lo que logramos para [industria similar]" | Caso de éxito concreto |
| 10 | DM/WhatsApp | — | "¿Tenés 20 minutos para contarnos tu situación? Sin costo." |
| 14 | Email | "Última oportunidad de evaluación gratuita" | CTA directo: agendar reunión |

### 4.5 Módulo D — KPIs y Métricas Objetivo

| Métrica | Plataforma | Mes 1 | Mes 3 | Mes 6 |
|---|---|---|---|---|
| Seguidores | LinkedIn | 100 | 500 | 1.200 |
| Seguidores | Instagram | 50 | 300 | 800 |
| Engagement rate | Todas | — | >3% | >5% |
| Leads formulario web | Supabase | 5 | 15-20 | 30-40 |
| Evaluaciones agendadas | Calendly | 2 | 8 | 15 |
| Clientes nuevos | — | 0-1 | 2-3 | 5-8 |

---

## BLOQUE 5 — ROADMAP DE IMPLEMENTACIÓN

### Fase 1 — Fundación (Semanas 1-2)
- [ ] Subir logos finales a todos los perfiles de RRSS
- [ ] Crear y completar perfiles LinkedIn, Instagram y Facebook al 100%
- [ ] Verificar que el formulario Supabase en la landing esté capturando correctamente
- [ ] Configurar Make.com escenario básico: Supabase → notificación de nuevo lead
- [ ] Configurar Buffer con calendario editorial de las primeras 2 semanas

### Fase 2 — Lanzamiento (Semanas 3-4)
- [ ] Publicar post oficial de lanzamiento simultáneo en los 3 canales
- [ ] Activar respuesta automática a DMs en Instagram
- [ ] Iniciar conexiones estratégicas en LinkedIn: 50 decisores/semana
- [ ] Activar secuencia de nurturing para primeros leads capturados
- [ ] Pedir a Mathias y Luis compartir el post de lanzamiento desde perfiles personales

### Fase 3 — Crecimiento (Mes 2-3)
- [ ] Analizar KPIs y ajustar formato/frecuencia de contenido
- [ ] Publicar primeros casos de éxito reales (anonimizados si necesario)
- [ ] Activar primera campaña LinkedIn Ads: $150-200/mes, targeting gerentes/dueños PY
- [ ] Crear perfil en Google My Business (Asunción)
- [ ] Unirse a grupos de Facebook empresariales paraguayos

### Fase 4 — Consolidación (Mes 4-6)
- [ ] Activar módulo completo de agente: contenido + CRM + reporting automático
- [ ] Publicar dominio propio y activar blog/SEO
- [ ] Sistema de referidos para clientes actuales
- [ ] Revisión de KPIs vs. objetivos y ajuste de estrategia

---

## BLOQUE 6 — DECISIONES TÉCNICAS REGISTRADAS

| # | Decisión | Alternativas descartadas | Razón |
|---|---|---|---|
| 1 | Leer repo + landing ANTES de generar assets | Generar directo con IA | Evita identidades genéricas sin coherencia con lo existente |
| 2 | Paleta de 6 tokens con roles fijos | Paleta libre | Cada color tiene razón semántica, no estética |
| 3 | HTML-to-PNG con Playwright para posts | DALL-E / Midjourney | Preserva tipografía exacta, paleta y es editable en código |
| 4 | Versionar HTML fuente en Git, no los PNG | Versionar imágenes | PNG son artefactos generados; HTML permite diff limpio |
| 5 | Make.com como orquestador | Zapier / n8n | 4-5x más barato que Zapier; n8n requiere servidor propio |
| 6 | Supabase ya instalado como CRM base | Airtable / Notion | Evita duplicación; la landing ya lo tiene integrado |
| 7 | Buffer para scheduling | Meta Business Suite / Hootsuite | Soporte multi-plataforma, API accesible desde Make.com |
| 8 | Brevo para email nurturing | Mailchimp / ActiveCampaign | Gratis hasta 300 emails/día; ideal para arranque |
| 9 | BANT adaptado a mercado paraguayo | BANT estándar | Los criterios clásicos no reflejan el contexto local de PyMEs PY |


## INSTRUCCIONES DE USO PARA EL LLM

Cuando un usuario presente este documento, el modelo debe:

1. **Asumir rol por defecto:** Sos el estratega digital y agente de marketing de DataCore.
   Conocés la empresa al nivel de un co-fundador.

2. **Nunca pedir re-explicaciones** sobre servicios, equipo, paleta o tono. Toda esa
   información está en este documento.

3. **Prioridades implícitas:**
   - LinkedIn es el canal prioritario (#1) para generación de leads B2B
   - El CTA siempre es "Evaluá tu situación gratis"
   - El tono es coloquial paraguayo, sin tecnicismos, orientado al dolor del cliente

4. **Cuando se solicite contenido**, preguntar únicamente:
   - ¿Para qué plataforma? (si no está claro)
   - ¿Alguna restricción específica de largo o formato?

5. **Cuando se solicite una automatización**, asumir el stack definido en el Bloque 4
   (Make.com + GPT-4o + Supabase + HubSpot + Brevo + Buffer) a menos que se indique lo contrario.

6. **Formato de respuesta preferido:** Directo al punto. Sin introducciones largas.
   Markdown para estructurar, tablas para comparar, código cuando corresponda.
