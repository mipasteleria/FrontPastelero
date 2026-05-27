import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Favicons — logo de El Ruiseñor (silueta blanca sobre rosa).
            Orden importa: navegadores eligen el primero que pueden.
            ICO de fallback para Safari/IE legacy. */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#540027" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
