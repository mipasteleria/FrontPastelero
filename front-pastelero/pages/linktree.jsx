import Link from "next/link";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

const LINKS = [
  {
    href: "https://wa.me/523329295129",
    externo: true,
    emoji: "\ud83d\udcac",
    emojiStyle: {},
    label: "Escríbenos por WhatsApp",
    sub: "Pedidos y dudas · Respondemos el mismo día",
    contacto: true,
  },
  {
    href: "/enduser/pastel-vintage",
    emoji: "🎂",
    emojiStyle: {},
    label: "Arma tu pastel vintage",
    sub: "El más popular · Configurador",
    featured: true,
  },
  {
    href: "/enduser/galletas-ny",
    emoji: "🍪",
    emojiStyle: { background: "#FFE99B", color: "#6B4F1A" },
    label: "Galletas NY a domicilio",
    sub: "Caja de 6 o 12 sabores",
    featured: false,
  },
  {
    href: "/cursos",
    emoji: "✨",
    emojiStyle: { background: "#B8E6D3", color: "#1D5A45" },
    label: "Cursos del mes",
    sub: "12 fechas · Cupos limitados",
    featured: false,
  },
  {
    href: "/cotizacion",
    emoji: "💌",
    emojiStyle: { background: "#D9C4E8", color: "#5A3578" },
    label: "Cotizar evento",
    sub: "Bodas, corporativos, XV",
    featured: false,
  },
  {
    href: "/",
    emoji: "🏠",
    emojiStyle: { background: "#FFC9A5", color: "#7A3A1A" },
    label: "Tienda en línea",
    sub: "Catálogo completo",
    featured: false,
  },
  {
    href: "/enduser/conocenuestrosproductos",
    emoji: "?",
    emojiStyle: { background: "#FFC3C9", color: "#7A1F44" },
    label: "Nuestros productos",
    sub: "Sabores, postres, pasteles",
    featured: false,
  },
];

const WHATSAPP = "https://wa.me/523329295129";

// `destacado` marca el canal de contacto: se pinta con su color de marca y
// lleva halo, porque el feedback fue que nadie encontraba cómo escribirnos.
const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/pasteleria.ruisenor/",
    color: "#E1306C",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100051129925064",
    color: "#1877F2",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94z"/>
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@pasteleria_el_ruisenor",
    color: "#000000",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.12z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@pasteleriaruisenor1032",
    color: "#FF0000",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.5a3 3 0 0 0-2.11-2.12C19.5 3.87 12 3.87 12 3.87s-7.5 0-9.39.51A3 3 0 0 0 .5 6.5 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.5 3 3 0 0 0 2.11 2.12c1.89.51 9.39.51 9.39.51s7.5 0 9.39-.51a3 3 0 0 0 2.11-2.12A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.5zM9.6 15.6V8.4l6.2 3.6z"/>
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: WHATSAPP,
    color: "#25D366",
    destacado: true,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.6 6.32A8.78 8.78 0 0 0 12 4a8.92 8.92 0 0 0-7.5 13.6L3 22l4.5-1.4A8.92 8.92 0 0 0 12 21.78a8.85 8.85 0 0 0 5.6-15.46zM12 20.13a7.5 7.5 0 0 1-3.83-1.05l-.27-.16-2.84.74.76-2.78-.18-.28A7.4 7.4 0 0 1 4.5 12.9a7.5 7.5 0 1 1 7.5 7.23z"/>
      </svg>
    ),
  },
];

export default function Linktree() {
  return (
    <div
      className={nunito.className}
      style={{ background: "var(--burdeos)", minHeight: "100vh", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "1.5rem" }}
    >
      <style>{`
        .lt-link:hover{transform:translateY(-3px);box-shadow:0 10px 24px rgba(0,0,0,.25)!important}
        .lt-social:hover .lt-ic{transform:translateY(-3px);background:var(--mc)!important;color:#fff!important}
        .lt-social:hover .lt-lb{color:#fff}
        /* El halo del contacto late despacio para que la vista se vaya ahí. */
        @keyframes ltGlow{0%,100%{box-shadow:0 0 0 0 rgba(37,211,102,.55)}50%{box-shadow:0 0 0 12px rgba(37,211,102,0)}}
        .lt-ic--wa{animation:ltGlow 2.4s ease-out infinite}
        .lt-social{width:66px}
        .lt-ic{width:58px;height:58px}
        .lt-ic--wa{width:66px;height:66px}
        .lt-lb{font-size:.68rem}
        /* En pantallas angostas los 5 iconos deben caber en una sola línea. */
        @media (max-width:430px){
          .lt-social{width:58px}
          .lt-ic{width:50px;height:50px}
          .lt-ic--wa{width:58px;height:58px}
          .lt-lb{font-size:.6rem}
          .lt-row{gap:.5rem!important}
        }
        @media (prefers-reduced-motion: reduce){.lt-ic--wa{animation:none}}
        body{background:var(--burdeos)!important}
      `}</style>

      {/* Background patterns */}
      <div aria-hidden="true" className="ru-pattern-branches fixed inset-0 pointer-events-none" style={{ opacity: 0.16 }} />
      <div aria-hidden="true" className="ru-pattern-sprinkle fixed inset-0 pointer-events-none" style={{ opacity: 0.18 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 460, width: "100%", padding: "3rem 0 4rem", textAlign: "center", color: "#fff" }}>

        {/* Logo circle */}
        <div style={{ width: 120, height: 120, margin: "0 auto 1.25rem", borderRadius: "50%", background: "var(--crema)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 36px rgba(0,0,0,.3)", position: "relative" }}>
          <div style={{ position: "absolute", inset: -8, border: "2px dashed rgba(255,193,200,.4)", borderRadius: "50%" }} />
          <span style={{ fontSize: "3.5rem" }}>🎂</span>
        </div>

        {/* Brand name */}
        <h1 className={sofia.className} style={{ fontSize: "3.5rem", color: "var(--rosa-2)", lineHeight: 1, marginBottom: "0.5rem" }}>El Ruiseñor</h1>
        <p style={{ fontFamily: "var(--font-nunito)", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.5rem" }}>Pastelería artesanal · Guadalajara</p>
        <p style={{ color: "#FFD8DF", fontSize: "0.875rem", margin: "0.75rem auto 1.5rem", maxWidth: "33ch", lineHeight: 1.7 }}>
          Hornea recuerdos dulces. Pasteles vintage, galletas NY, cursos y eventos. Reservas con 72h de anticipación.
        </p>

        {/* Redes sociales — con etiqueta para que se lean como acciones,
            no como adorno. El de WhatsApp va resaltado. */}
        <div className="lt-row" style={{ display: "flex", gap: "0.9rem", justifyContent: "center", alignItems: "flex-end", marginBottom: "2rem" }}>
          {SOCIALS.map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="lt-social"
              style={{ "--mc": s.color, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textDecoration: "none" }}
            >
              <span
                className={`lt-ic${s.destacado ? " lt-ic--wa" : ""}`}
                style={{
                  borderRadius: "50%",
                  background: s.destacado ? s.color : "rgba(255,255,255,.14)",
                  border: s.destacado ? "2.5px solid rgba(255,255,255,.9)" : "1.5px solid rgba(255,255,255,.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", backdropFilter: "blur(8px)", transition: "all 160ms",
                }}
              >
                {s.icon}
              </span>
              <span
                className="lt-lb"
                style={{ fontWeight: s.destacado ? 800 : 600, color: s.destacado ? "#fff" : "rgba(255,216,223,.85)", transition: "color 160ms", whiteSpace: "nowrap" }}
              >
                {s.destacado ? "Escríbenos" : s.label}
              </span>
            </a>
          ))}
        </div>

        {/* Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {LINKS.map(l => {
            // La tarjeta de contacto abre WhatsApp, así que es enlace externo.
            const Envoltura = l.externo
              ? ({ children }) => <a href={l.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>{children}</a>
              : ({ children }) => <Link href={l.href}>{children}</Link>;
            return (
            <Envoltura key={l.href + l.label}>
              <div
                className="lt-link"
                style={{
                  display: "flex", alignItems: "center", gap: "0.875rem",
                  padding: l.contacto ? "1.15rem 1.25rem" : "1rem 1.25rem",
                  background: l.contacto
                    ? "linear-gradient(135deg,#25D366,#128C7E)"
                    : l.featured ? "linear-gradient(135deg,#FFC3C9,#FF6F7D)" : "rgba(255,255,255,.92)",
                  borderRadius: "var(--r-xl)",
                  textDecoration: "none",
                  color: "var(--burdeos)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 16px rgba(0,0,0,.15)",
                  transition: "all 150ms",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                {/* Sprinkle overlay on card */}
                <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0 pointer-events-none" style={{ opacity: (l.featured || l.contacto) ? 0.2 : 0.15 }} />
                {/* Icon */}
                <div style={{ width: 46, height: 46, borderRadius: "var(--r-md)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.5rem", lineHeight: 1, position: "relative", zIndex: 1, background: (l.featured || l.contacto) ? "rgba(255,255,255,.3)" : l.emojiStyle.background || "transparent", color: (l.featured || l.contacto) ? "#fff" : l.emojiStyle.color || "var(--burdeos)" }}>
                  {l.emoji}
                </div>
                {/* Text */}
                <div style={{ flex: 1, textAlign: "left", position: "relative", zIndex: 1 }}>
                  <div style={{ fontWeight: 800, color: (l.featured || l.contacto) ? "#fff" : "var(--burdeos)" }}>{l.label}</div>
                  <small style={{ display: "block", fontWeight: 500, color: (l.featured || l.contacto) ? "rgba(255,255,255,.85)" : "var(--text-muted)", fontSize: "0.75rem" }}>{l.sub}</small>
                </div>
                {/* Arrow */}
                <span style={{ color: (l.featured || l.contacto) ? "#fff" : "var(--rosa)", position: "relative", zIndex: 1, fontSize: "1.1rem", fontWeight: 700 }}>→</span>
              </div>
            </Envoltura>
            );
          })}
        </div>

        {/* Footer */}
        <p style={{ marginTop: "2.5rem", color: "rgba(255,216,223,.65)", fontSize: "0.7rem" }}>
          © 2026 El Ruiseñor · Hecho con cariño en Guadalajara
        </p>
      </div>
    </div>
  );
}
