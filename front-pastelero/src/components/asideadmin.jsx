import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context";
import { Sofia as SofiaFont } from "next/font/google";

const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const NAV_GROUPS = [
  {
    label: "Operación",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        exact: true,
        icon: (
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 22 21">
            <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
            <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
          </svg>
        ),
      },
      {
        href: "/dashboard/cotizaciones",
        label: "Cotizaciones",
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Catálogo",
    items: [
      {
        href: "/dashboard/insumosytrabajomanual",
        label: "Insumos y Trabajo Manual",
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5.5 21h13M12 21V7m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm2-1.8c3.073.661 2.467 2.8 5 2.8M5 8c3.359 0 2.192-2.115 5.012-2.793M7 9.556V7.75m0 1.806-1.95 4.393a.773.773 0 0 0 .37.962.785.785 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.776.776 0 0 0 .09-.716L7 9.556Zm10 0V7.313m0 2.243-1.95 4.393a.773.773 0 0 0 .37.962.786.786 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.775.775 0 0 0 .09-.716L17 9.556Z" />
          </svg>
        ),
      },
      {
        href: "/dashboard/costeorecetas",
        label: "Recetas",
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2" />
          </svg>
        ),
      },
      {
        href: "/dashboard/gastosfijosymanodeobra",
        label: "Gastos Fijos y Mano de Obra",
        icon: (
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797A3.979 3.979 0 0 1 16 18.874V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 11.126 16H10v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 14 11.126V10h2Zm.406 3.578.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703 7.029 7.029 0 0 0-3.235 3.235A4 4 0 0 1 5 8Zm4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.979 6.979 0 0 1 9 15c0-.695.101-1.366.29-2Z" clipRule="evenodd" />
          </svg>
        ),
      },
      {
        href: "/dashboard/tecnicas",
        label: "Técnicas Creativas",
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.5 11.5 11 13l4-3.5M12 20a16.405 16.405 0 0 1-5.092-5.804A16.694 16.694 0 0 1 5 6.666L12 4l7 2.667a16.695 16.695 0 0 1-1.908 7.529A16.406 16.406 0 0 1 12 20Z" />
          </svg>
        ),
      },
      {
        href: "/dashboard/productos",
        label: "Productos del Home",
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        ),
      },
      {
        href: "/dashboard/galletas-ny",
        label: "Galletas NY",
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <circle cx="9" cy="10" r="1" />
            <circle cx="14" cy="9" r="1" />
            <circle cx="15" cy="14" r="1" />
            <circle cx="10" cy="15" r="1" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Pedidos",
    items: [
      {
        href: "/dashboard/pedidos-galletas",
        label: "Pedidos Galletas NY",
        icon: (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" />
            <path d="M8 12h8M8 16h5" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Configuración",
    items: [
      {
        href: "/dashboard/usuarios",
        label: "Usuarios",
        icon: (
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 18">
            <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
          </svg>
        ),
      },
    ],
  },
];

const Asideadmin = () => {
  const router = useRouter();
  const { userEmail } = useAuth();

  const isActive = (href, exact = false) =>
    exact ? router.pathname === href : router.pathname.startsWith(href);

  // Iniciales del email para el avatar
  const initials = userEmail ? userEmail[0].toUpperCase() : "A";

  return (
    <aside
      className="hidden md:flex flex-col flex-shrink-0 min-h-screen relative overflow-hidden"
      style={{
        width: 260,
        background: "var(--burdeos)",
        color: "#fff",
      }}
    >
      {/* Patrón sprinkle de fondo */}
      <div
        aria-hidden="true"
        className="ru-pattern-sprinkle absolute inset-0 pointer-events-none"
        style={{ opacity: 0.14 }}
      />

      <div className="relative flex flex-col h-full">
        {/* Brand */}
        <div
          className="flex items-center gap-3 px-5 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0 overflow-hidden"
            style={{ width: 36, height: 36, background: "var(--rosa-3)" }}
          >
            <span style={{ fontFamily: "var(--font-sofia)", fontSize: "1.1rem", color: "var(--burdeos)" }}>
              R
            </span>
          </div>
          <div>
            <div className={`${sofia.className} leading-none`} style={{ fontSize: "1.25rem" }}>
              El Ruiseñor
            </div>
            <div
              style={{
                fontSize: "0.65rem",
                color: "var(--rosa-2)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 700,
                marginTop: 2,
              }}
            >
              Panel Admin
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-4">
              {/* Grupo label */}
              <div
                className="px-3 mb-1"
                style={{
                  fontSize: "0.65rem",
                  color: "rgba(255,193,200,0.55)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 700,
                }}
              >
                {group.label}
              </div>

              {group.items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl mb-0.5 text-sm font-semibold transition-all duration-150"
                    style={{
                      color: active ? "#fff" : "#FFD8DF",
                      background: active ? "var(--rosa)" : "transparent",
                      boxShadow: active ? "var(--shadow-sm)" : "none",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span style={{ opacity: active ? 1 : 0.8, flexShrink: 0 }}>{item.icon}</span>
                    <span className="leading-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div
          className="mx-4 mb-4 flex items-center gap-3 px-3 py-3 rounded-xl"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              width: 36,
              height: 36,
              background: "var(--rosa)",
              fontFamily: "var(--font-sofia)",
              fontSize: "1.25rem",
            }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">{userEmail}</div>
            <div style={{ fontSize: "0.65rem", color: "var(--rosa-2)" }}>Administrador</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Asideadmin;
