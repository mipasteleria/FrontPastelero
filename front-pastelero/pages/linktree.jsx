import Link from "next/link";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

const LINKS = [
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

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.12z"/>
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/5215500000000",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
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
        .lt-pill:hover{background:var(--rosa)!important;transform:translateY(-2px)}
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

        {/* Social pills */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginBottom: "2rem" }}>
          {SOCIALS.map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="lt-pill"
              style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", textDecoration: "none", backdropFilter: "blur(8px)", transition: "all 150ms" }}
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {LINKS.map(l => (
            <Link key={l.href + l.label} href={l.href}>
              <div
                className="lt-link"
                style={{
                  display: "flex", alignItems: "center", gap: "0.875rem",
                  padding: "1rem 1.25rem",
                  background: l.featured ? "linear-gradient(135deg,#FFC3C9,#FF6F7D)" : "rgba(255,255,255,.92)",
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
                <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0 pointer-events-none" style={{ opacity: l.featured ? 0.2 : 0.15 }} />
                {/* Icon */}
                <div style={{ width: 46, height: 46, borderRadius: "var(--r-md)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.5rem", lineHeight: 1, position: "relative", zIndex: 1, background: l.featured ? "rgba(255,255,255,.3)" : l.emojiStyle.background || "transparent", color: l.featured ? "#fff" : l.emojiStyle.color || "var(--burdeos)" }}>
                  {l.emoji}
                </div>
                {/* Text */}
                <div style={{ flex: 1, textAlign: "left", position: "relative", zIndex: 1 }}>
                  <div style={{ fontWeight: 800, color: l.featured ? "#fff" : "var(--burdeos)" }}>{l.label}</div>
                  <small style={{ display: "block", fontWeight: 500, color: l.featured ? "rgba(255,255,255,.85)" : "var(--text-muted)", fontSize: "0.75rem" }}>{l.sub}</small>
                </div>
                {/* Arrow */}
                <span style={{ color: l.featured ? "#fff" : "var(--rosa)", position: "relative", zIndex: 1, fontSize: "1.1rem", fontWeight: 700 }}>→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <p style={{ marginTop: "2.5rem", color: "rgba(255,216,223,.65)", fontSize: "0.7rem" }}>
          © 2026 El Ruiseñor · Hecho con cariño en Guadalajara
        </p>
      </div>
    </div>
  );
}
