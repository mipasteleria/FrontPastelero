import Link from "next/link";
import { useRouter } from "next/router";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    exact: true,
    label: "Inicio",
    icon: (
      <svg width="22" height="22" fill="currentColor" viewBox="0 0 22 21">
        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/cotizaciones",
    label: "Cotizaciones",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3" />
      </svg>
    ),
  },
  {
    href: "/dashboard/costeorecetas",
    label: "Recetas",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2" />
      </svg>
    ),
  },
  {
    href: "/dashboard/insumosytrabajomanual",
    label: "Insumos",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.5 21h13M12 21V7m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm2-1.8c3.073.661 2.467 2.8 5 2.8M5 8c3.359 0 2.192-2.115 5.012-2.793M7 9.556V7.75m0 1.806-1.95 4.393a.773.773 0 0 0 .37.962.785.785 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.776.776 0 0 0 .09-.716L7 9.556Zm10 0V7.313m0 2.243-1.95 4.393a.773.773 0 0 0 .37.962.786.786 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.775.775 0 0 0 .09-.716L17 9.556Z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/usuarios",
    label: "Usuarios",
    icon: (
      <svg width="22" height="22" fill="currentColor" viewBox="0 0 20 18">
        <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
      </svg>
    ),
  },
];

const FooterDashboard = () => {
  const router = useRouter();

  const isActive = (href, exact = false) =>
    exact ? router.pathname === href : router.pathname.startsWith(href);

  return (
    <nav
      className="fixed bottom-0 left-0 w-full block md:hidden z-50"
      style={{
        background: "rgba(255,243,245,0.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid var(--border-color)",
        boxShadow: "0 -4px 12px rgba(84,0,39,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: 58,
          maxWidth: 480,
          margin: "0 auto",
          padding: "0 8px",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: "none", flex: 1 }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  padding: "6px 4px",
                  borderRadius: "var(--r-md)",
                  color: active ? "var(--burdeos)" : "var(--text-muted)",
                  background: active ? "var(--rosa-4)" : "transparent",
                  transition: "all 150ms",
                }}
              >
                {item.icon}
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: active ? 800 : 600,
                    fontFamily: "var(--font-nunito)",
                    lineHeight: 1,
                  }}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default FooterDashboard;
