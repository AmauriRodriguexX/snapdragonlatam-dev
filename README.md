# Snapdragon Latam — Nueva Plataforma Moderna (SvelteKit + Tailwind CSS)

Plataforma digital moderna, accesible y de alto rendimiento para **Snapdragon Latinoamérica**, desarrollada en **SvelteKit (Svelte 5 Runes)** y **Tailwind CSS v4**, respondiendo directamente a todas las soluciones identificadas en el documento [`ANALIS-UX-SNAPDRAGON.MD`](../ANALIS-UX-SNAPDRAGON.MD).

---

## 🚀 Inicio Rápido

Desde la raíz del proyecto (`web/app`):

```bash
# Instalar dependencias (con pnpm)
pnpm install

# Iniciar servidor de desarrollo en caliente (HMR)
pnpm dev

# Compilar para producción
pnpm build

# Previsualizar el bundle de producción
pnpm preview
```

El servidor estará disponible en 👉 **[http://localhost:5173](http://localhost:5173)** (dev) o **[http://localhost:4173](http://localhost:4173)** (preview).

---

## 🌐 Publicación en GitHub Pages

Cada push a `main` ejecuta `.github/workflows/deploy.yml`: construye el sitio estático (`@sveltejs/adapter-static`) con `BASE_PATH=/<repo>` y lo publica en Pages. Requisito único: en el repo, **Settings → Pages → Source: GitHub Actions**.

Para probar el build de Pages en local (Git Bash): `MSYS_NO_PATHCONV=1 BASE_PATH=/snapdragonlatam-dev pnpm build`. En el código, rutas internas con `resolve('/ruta')` y archivos de `static/` con `asset('/media/...')` (de `$app/paths`).

## 🛠️ Stack Tecnológico
- **Framework:** SvelteKit / Svelte 5 (runes).
- **Diseño "Papel técnico" (tema blanco):** Tailwind CSS v4, tokens en `src/app.css` (paper, ink, mute, line, red). Tipografías Geist (UI), Geist Mono (etiquetas y cifras); los acentos de los títulos también usan Geist Mono.
- **Fig. 01 · Anatomía del Snapdragon X Elite** (`HeroAnatomy.svelte` + `ChipFigure.svelte` + `lib/iso/`): figura isométrica en SVG con la técnica de la skill [anatomy](https://github.com/wheresryan22/anatomy) (sólidos rellenos, tono por cara, pintado de atrás hacia adelante, lámina con Fig., lectura en vivo). Al hacer scroll se separan las capas: CPU, GPU, NPU, memoria y batería. Las cifras salen de `chipFacts` (Qualcomm X1E-84-100). La distribución del die es ilustrativa.
- **Movimiento:** scroll suave con Lenis, rail horizontal fijado (`ProductRail`), texto que se revela con el scroll (`ScrollText`), revelado de líneas e imágenes, View Transitions. Todo respeta `prefers-reduced-motion`.
- **Optimización multimedia:** Sharp (WebP).
- **Gestor de paquetes:** `pnpm`.

---

## 📋 Soluciones Implementadas según el Análisis UX

| Hallazgo en el Análisis UX | Solución Implementada en el Nuevo Sitio |
| :--- | :--- |
| **§4.1 Fuga masiva de Portugués** | Erradicación total del portugués en validaciones, títulos (`/promociones` en vez de `Promoções`) y listados de países (ortografía correcta: Colombia, Ecuador, Paraguay, Uruguay, Nicaragua). |
| **§3.2 Centralismo en México** | Selector regional interactivo con **19 países de Latinoamérica** (`CountryModal`). Si el usuario es de Colombia, Chile, Argentina, etc., el botón de compra le ofrece tiendas y distribuidores de su fabricante en lugar de forzarlo a tiendas departamentales mexicanas. |
| **§7.2 Fuga de tráfico a YouTube** | Reproductor modal integrado (`VideoModal`) que permite ver los reviews y videos oficiales dentro de la plataforma sin expulsar al usuario. |
| **§2.2 Ausencia de Footer & Legal** | Footer corporativo completo con navegación secundaria, redes oficiales de **Snapdragon Latam** (eliminando enlaces a Brasil), copyright y enlaces a **Aviso de Privacidad** y **Términos de Uso**. |
| **§9.1 Infracción de Privacidad (PII)** | Formulario con consentimiento expreso, enlace visible al Aviso de Privacidad y cumplimiento con leyes de protección de datos (LFPDPPP en México, Ley 1581 en Colombia, etc.). |
| **§7.1 Pérdida silenciosa de Leads** | Flujo en un solo paso con validaciones en español amigables y registro inmediato del lead, con selección opcional de temas de interés. |
| **§3.3 Omisión de chips móviles** | La sección `/procesadores` ahora cubre tanto la familia **Snapdragon X Series** (PC) como la familia **Snapdragon 8 Series** (móvil: 8 Elite, 8 Gen 3, etc.). |
| **§8.1 Exceso de peso en medios** | Conversión de PNGs de 1 MB a WebP de menos de 80 KB. Carga diferida de videos bajo demanda (`click-to-play`). |
| **§8.2 Metadatos SEO inexistentes** | Componente `<Seo />` en cada página con títulos únicos, descripciones, OpenGraph, Twitter Cards, `sitemap.xml` y `robots.txt`. |
| **§2.1 Confusión Insiders vs Loterías** | Distinción clara: Snapdragon Insiders es la comunidad de creadores y fans, mientras que SnapPremios se presenta como un sorteo mensual externo debidamente señalizado. |

---

## 📁 Estructura del Código Fuente

```
web/app/
├── scripts/
│   └── optimize-media.mjs           # Script de Sharp para transcodificar uploads a WebP
├── src/
│   ├── app.css                      # Design tokens, animaciones y temas
│   ├── app.html                     # HTML shell con meta viewport y branding
│   ├── lib/
│   │   ├── actions/motion.ts        # Acciones Svelte: reveal, spotlight, tilt, countUp
│   │   ├── components/              # Componentes de interfaz
│   │   │   ├── CountryModal.svelte  # Selector de 19 países de Latam
│   │   │   ├── Footer.svelte        # Footer corporativo y legal completo
│   │   │   ├── Header.svelte        # Barra de navegación con país y menú móvil
│   │   │   ├── NewsletterForm.svelte# Formulario de registro seguro en español
│   │   │   ├── ProductCard.svelte   # Ficha de producto con compra según país
│   │   │   ├── ReviewsCarousel.svelte # Carrusel de reviews con lightbox
│   │   │   ├── Seo.svelte           # Metadatos OpenGraph, Twitter y JSON-LD
│   │   │   └── VideoModal.svelte    # Reproductor modal in-site
│   │   ├── data/content.ts          # Contenido estructurado y corregido
│   │   ├── site.ts                  # Configuración de sitio y navegación
│   │   └── state/                   # Tiendas reactivas Svelte 5 ($state)
│   │       ├── country.svelte.ts    # Persistencia del país y detección
│   │       └── modal.svelte.ts      # Estado de modales y video player
│   └── routes/
│       ├── +layout.svelte           # Layout raíz con transiciones de vista
│       ├── +page.svelte             # Página de Inicio
│       ├── laptops/+page.svelte     # Catálogo de Laptops Copilot+ PC
│       ├── smartphones/+page.svelte # Catálogo de Smartphones Insignia
│       ├── procesadores/+page.svelte# Procesadores PC y Móviles
│       ├── insiders/+page.svelte    # Comunidad y galería #ShotOnSnapdragon
│       ├── promociones/+page.svelte # Campañas y dinámicas oficiales
│       ├── privacidad/+page.svelte  # Aviso de Privacidad
│       ├── terminos/+page.svelte    # Términos de Uso
│       └── compute, chips, promo    # Redirecciones automáticas (301)
└── static/
    ├── media/                       # Imágenes WebP optimizadas y marcas
    ├── robots.txt                   # Robots estándar
    └── sitemap.xml                  # Mapa del sitio completo
```
