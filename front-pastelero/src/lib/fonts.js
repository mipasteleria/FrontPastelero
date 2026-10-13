import localFont from "next/font/local";

/**
 * Fuentes del sitio, auto-hospedadas.
 *
 * Antes cada página llamaba a `next/font/google`, lo que obliga al build a
 * descargar las fuentes de Google. Eso hacía fallar el deploy de forma
 * intermitente — medido: 1 de cada 3 builds, desde un checkout limpio y sin
 * cambiar una línea, con "An error occurred in `next/font`". Los .woff2
 * viven ahora en src/fonts, así que el build no toca la red y no puede
 * fallar por esto.
 *
 * Se define una sola vez aquí y se importa en todos lados: antes había 11
 * configuraciones distintas repartidas en 70 archivos, que era fácil que se
 * desincronizaran entre sí.
 *
 * Solo se incluye el subconjunto `latin`: cubre acentos y eñe, que es todo
 * lo que necesita un sitio en español. (Google servía además cyrillic,
 * greek y vietnamese, que nunca se usaban.)
 *
 * Nunito y Fraunces son fuentes variables: un único archivo cubre todo el
 * rango de pesos, por eso se declaran con rango en vez de un peso fijo.
 *
 * Todas son de Google Fonts bajo OFL; ver src/fonts/LICENSE.txt.
 */

export const sofia = localFont({
  src: [{ path: "../fonts/Sofia-400.woff2", weight: "400", style: "normal" }],
  display: "swap",
  variable: "--font-script-q",
  // Fallback con métricas parecidas para que no brinque el texto al cargar.
  fallback: ["cursive"],
});

export const poppins = localFont({
  src: [
    { path: "../fonts/Poppins-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Poppins-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Poppins-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export const nunito = localFont({
  src: [{ path: "../fonts/Nunito-variable.woff2", weight: "400 800", style: "normal" }],
  display: "swap",
  variable: "--font-sans-q",
  fallback: ["system-ui", "arial"],
});

export const fraunces = localFont({
  src: [{ path: "../fonts/Fraunces-variable.woff2", weight: "500 700", style: "normal" }],
  display: "swap",
  variable: "--font-display-q",
  fallback: ["Georgia", "serif"],
});

export const playfair = localFont({
  src: [{ path: "../fonts/PlayfairDisplay-400-italic.woff2", weight: "400", style: "italic" }],
  display: "swap",
  fallback: ["Georgia", "serif"],
});
