import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

/* ── Status badge helper ─────────────────────────────────────── */
const STATUS_MAP = {
  nuevo:      { label: "Nuevo",      bg: "var(--mantequilla)", color: "#6B4F1A" },
  new:        { label: "Nuevo",      bg: "var(--mantequilla)", color: "#6B4F1A" },
  pendiente:  { label: "Pendiente",  bg: "var(--mantequilla)", color: "#6B4F1A" },
  cotizado:   { label: "Cotizado",   bg: "var(--rosa-3)",      color: "var(--burdeos)" },
  quoted:     { label: "Cotizado",   bg: "var(--rosa-3)",      color: "var(--burdeos)" },
  preparando: { label: "Preparando", bg: "var(--rosa-3)",      color: "var(--burdeos)" },
  prep:       { label: "Preparando", bg: "var(--rosa-3)",      color: "var(--burdeos)" },
  "en ruta":  { label: "En ruta",    bg: "var(--lavanda)",     color: "#5A3578" },
  entregado:  { label: "Entregado",  bg: "var(--menta)",       color: "#1D5A45" },
  done:       { label: "Entregado",  bg: "var(--menta)",       color: "#1D5A45" },
  confirmado: { label: "Confirmado", bg: "var(--menta)",       color: "#1D5A45" },
  cancelado:  { label: "Cancelado",  bg: "#FFE2E2",            color: "#7A1F1F" },
};

const StatusBadge = ({ status }) => {
  const key = (status || "").toLowerCase();
  const cfg = STATUS_MAP[key] || { label: status || "—", bg: "var(--border-color)", color: "var(--text-soft)" };
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: "var(--r-pill)",
        background: cfg.bg,
        color: cfg.color,
        fontWeight: 700,
        fontSize: "0.72rem",
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      {cfg.label}
    </span>
  );
};

/* ── Icon helpers ────────────────────────────────────────────── */
const EyeIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
    <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);
const EditIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z" clipRule="evenodd" />
  </svg>
);
const CalcIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const TrashIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
  </svg>
);

/* ── Action icon button ──────────────────────────────────────── */
const ActionBtn = ({ onClick, href, title, color = "var(--burdeos)", children }) => {
  const style = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: "var(--r-sm)",
    background: "transparent",
    border: "1.5px solid var(--border-color)",
    color,
    cursor: "pointer",
    transition: "all 150ms",
  };
  const handleHover = (e, enter) => {
    e.currentTarget.style.background = enter ? "var(--rosa-4)" : "transparent";
    e.currentTarget.style.borderColor = enter ? color : "var(--border-color)";
  };
  if (href) {
    return (
      <Link href={href} title={title}>
        <span
          style={style}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          {children}
        </span>
      </Link>
    );
  }
  return (
    <button
      onClick={onClick}
      title={title}
      style={style}
      onMouseEnter={(e) => handleHover(e, true)}
      onMouseLeave={(e) => handleHover(e, false)}
    >
      {children}
    </button>
  );
};

/* ── Main component ──────────────────────────────────────────── */
export default function CotizacionesIndex() {
  const [userCotizacion, setUserCotizacion] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchData = async () => {
        try {
          const [cakeRes, cupcakeRes, snackRes] = await Promise.all([
            fetch(`${API_BASE}/pricecake`, {
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE}/pricecupcake`, {
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE}/pricesnack`, {
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            }),
          ]);

          if (cakeRes.ok && cupcakeRes.ok && snackRes.ok) {
            const [cakeData, cupcakeData, snackData] = await Promise.all([
              cakeRes.json(), cupcakeRes.json(), snackRes.json(),
            ]);
            setUserCotizacion([
              ...cakeData.data.map((item) => ({ ...item, type: "Pastel" })),
              ...cupcakeData.data.map((item) => ({ ...item, type: "Cupcake" })),
              ...snackData.data.map((item) => ({ ...item, type: "Snack" })),
            ]);
          } else {
            throw new Error("Failed to fetch data");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsAuthenticated(false);
        }
      };
      fetchData();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (!isAuthenticated) {
    router.push("/");
    return null;
  }

  const deleteCotizacion = async (id, source) => {
    try {
      const result = await Swal.fire({
        title: "¿Eliminar cotización?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FF6F7D",
        cancelButtonColor: "#D6A7BC",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        background: "#fff1f2",
        color: "#540027",
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        const endpoints = { pastel: "pricecake", cupcake: "pricecupcake", snack: "pricesnack" };
        const endpoint = endpoints[source];
        if (!endpoint) return;

        const response = await fetch(`${API_BASE}/${endpoint}/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          Swal.fire({
            title: "Eliminado",
            text: "Cotización eliminada con éxito.",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            background: "#fff1f2",
            color: "#540027",
          }).then(() => {
            setUserCotizacion((prev) => prev.filter((c) => c._id !== id));
          });
        } else {
          Swal.fire({ title: "Error", text: "No se pudo eliminar.", icon: "error", timer: 2000, showConfirmButton: false, background: "#fff1f2", color: "#540027" });
        }
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  /* Pagination */
  const totalPages = Math.ceil(userCotizacion.length / itemsPerPage);
  const currentItems = userCotizacion.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("es-MX", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  return (
    <div className={nunito.className} style={{ background: "var(--bg-sunken)", minHeight: "100vh" }}>
      {/* Sprinkle overlay */}
      <div
        aria-hidden="true"
        className="ru-pattern-sprinkle fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.07 }}
      />

      <NavbarAdmin />

      <div className="flex flex-row mt-16 relative z-10">
        <Asideadmin />

        <main className="flex-grow min-w-0 px-4 md:px-6 py-7 pb-20 md:pb-8">

          {/* ── Header ─────────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1
                className={sofia.className}
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "var(--burdeos)", lineHeight: 1.1 }}
              >
                Cotizaciones
              </h1>
              <p style={{ color: "var(--text-muted)", fontWeight: 600, marginTop: 4, fontSize: "0.85rem" }}>
                {userCotizacion.length} solicitud{userCotizacion.length !== 1 ? "es" : ""} en total
              </p>
            </div>
            <Link href="/dashboard/cotizaciones/cotizacionmanual">
              <button
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "10px 20px", borderRadius: "var(--r-pill)",
                  background: "var(--burdeos)", color: "#fff",
                  fontFamily: "var(--font-nunito)", fontWeight: 700, fontSize: "0.875rem",
                  border: "none", cursor: "pointer",
                  boxShadow: "var(--shadow-sm)",
                  transition: "all 150ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--burdeos-2)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--burdeos)"; e.currentTarget.style.transform = "none"; }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Crear cotización manual
              </button>
            </Link>
          </div>

          {/* ── Table card ─────────────────────────────────────── */}
          <div
            style={{
              background: "var(--bg-raised)",
              borderRadius: "var(--r-xl)",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--border-color)",
              overflow: "hidden",
            }}
          >
            {userCotizacion.length === 0 ? (
              <div
                style={{
                  padding: "4rem 2rem",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2" style={{ margin: "0 auto 1rem", color: "var(--border-strong)", display: "block" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3" />
                </svg>
                No hay cotizaciones aún
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                      {["ID", "Cliente", "Tipo", "Creación", "Solicitud", "Estado", "Acciones"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 16px",
                            textAlign: "left",
                            fontWeight: 700,
                            fontSize: "0.72rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            color: "var(--text-muted)",
                            background: "var(--bg-sunken)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((c, idx) => (
                      <tr
                        key={`${c._id}-${idx}`}
                        style={{
                          borderBottom: "1px solid var(--border-color)",
                          transition: "background 120ms",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--crema)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        {/* ID */}
                        <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--rosa)", fontFamily: "ui-monospace, monospace", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                          #{String(c._id).slice(-6)}
                        </td>
                        {/* Cliente */}
                        <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--color-text)", whiteSpace: "nowrap" }}>
                          {c.contactName || "—"}
                        </td>
                        {/* Tipo */}
                        <td style={{ padding: "12px 16px", color: "var(--text-soft)" }}>
                          {c.type || "—"}
                        </td>
                        {/* Creación */}
                        <td style={{ padding: "12px 16px", color: "var(--text-soft)", whiteSpace: "nowrap" }}>
                          {formatDate(c.createdAt)}
                        </td>
                        {/* Solicitud */}
                        <td style={{ padding: "12px 16px", color: "var(--text-soft)" }}>
                          {c.priceType || "—"}
                        </td>
                        {/* Estado */}
                        <td style={{ padding: "12px 16px" }}>
                          <StatusBadge status={c.status} />
                        </td>
                        {/* Acciones */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <ActionBtn
                              href={`/dashboard/cotizaciones/${c._id}?type=${c.type}&source=${c.type.toLowerCase()}`}
                              title="Ver detalle"
                              color="var(--burdeos)"
                            >
                              <EyeIcon />
                            </ActionBtn>
                            <ActionBtn
                              href={`/dashboard/cotizaciones/editarcotizacion/${c._id}?type=${c.type}&source=${c.type.toLowerCase()}`}
                              title="Editar"
                              color="var(--burdeos)"
                            >
                              <EditIcon />
                            </ActionBtn>
                            <ActionBtn
                              href={`/dashboard/cotizaciones/costeo/${c._id}?source=${c.type.toLowerCase()}`}
                              title="Calcular costeo"
                              color="var(--menta-deep)"
                            >
                              <CalcIcon />
                            </ActionBtn>
                            <ActionBtn
                              onClick={() => deleteCotizacion(c._id, c.type.toLowerCase())}
                              title="Eliminar"
                              color="#e53e3e"
                            >
                              <TrashIcon />
                            </ActionBtn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Pagination ─────────────────────────────────── */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 20px",
                  borderTop: "1px solid var(--border-color)",
                  background: "var(--bg-sunken)",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  Página {currentPage} de {totalPages}
                </span>
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 1}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "var(--r-pill)",
                      border: "1.5px solid var(--border-strong)",
                      background: currentPage === 1 ? "transparent" : "var(--bg-raised)",
                      color: currentPage === 1 ? "var(--text-muted)" : "var(--burdeos)",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      opacity: currentPage === 1 ? 0.5 : 1,
                    }}
                  >
                    ← Anterior
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "var(--r-pill)",
                        border: "1.5px solid",
                        borderColor: page === currentPage ? "var(--burdeos)" : "var(--border-color)",
                        background: page === currentPage ? "var(--burdeos)" : "var(--bg-raised)",
                        color: page === currentPage ? "#fff" : "var(--burdeos)",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "var(--r-pill)",
                      border: "1.5px solid var(--border-strong)",
                      background: currentPage === totalPages ? "transparent" : "var(--bg-raised)",
                      color: currentPage === totalPages ? "var(--text-muted)" : "var(--burdeos)",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                      opacity: currentPage === totalPages ? 0.5 : 1,
                    }}
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <FooterDashboard />
    </div>
  );
}
