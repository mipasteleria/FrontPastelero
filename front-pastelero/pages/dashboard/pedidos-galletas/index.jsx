import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { useAuth } from "@/src/context";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const ESTADOS = [
  { key: "pendiente",       label: "Pendiente",       color: "#FFE99B", text: "#6B4F1A" },
  { key: "confirmado",      label: "Confirmado",      color: "#B8E6D3", text: "#1D5A45" },
  { key: "en_preparacion",  label: "En preparación",  color: "#D9C4E8", text: "#4B2A6E" },
  { key: "listo",           label: "Listo",           color: "#FFC9A5", text: "#7A4A1F" },
  { key: "entregado",       label: "Entregado",       color: "#9FB864", text: "#fff"    },
  { key: "cancelado",       label: "Cancelado",       color: "#F3C9D4", text: "#9c2a44" },
];

const ESTADO_PAGO = {
  pending:  { label: "Pago pendiente",  color: "#FFE99B", text: "#6B4F1A" },
  paid:     { label: "Pagado",          color: "#B8E6D3", text: "#1D5A45" },
  failed:   { label: "Pago fallido",    color: "#F3C9D4", text: "#9c2a44" },
  refunded: { label: "Reembolsado",     color: "#D9C4E8", text: "#4B2A6E" },
};

function getEstadoBadge(estado) {
  return ESTADOS.find(e => e.key === estado) || ESTADOS[0];
}

function formatearFecha(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

/* Compara solo fecha (no hora) — útil para "hoy" */
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

export default function PedidosGalletas() {
  const router = useRouter();
  const { userToken } = useAuth();
  const authHeader = userToken ? { Authorization: `Bearer ${userToken}` } : {};

  const [pedidos, setPedidos]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterPago, setFilterPago]     = useState("todos");
  const [search, setSearch]             = useState("");
  const [selected, setSelected]         = useState(new Set()); // ids de pedidos seleccionados
  const [bulkUpdating, setBulkUpdating] = useState(false);

  /* ── Cargar ── */
  const cargar = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/galletaPedidos`, { headers: authHeader });
      setPedidos(res.data.data || []);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudieron cargar los pedidos" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userToken) cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userToken]);

  /* ── Conteos ── */
  const counts = useMemo(() => {
    const out = { todos: pedidos.length };
    for (const p of pedidos) out[p.estado] = (out[p.estado] || 0) + 1;
    return out;
  }, [pedidos]);

  const hoy = useMemo(() => new Date(), []);
  const entregasHoy = useMemo(
    () => pedidos.filter(p => p.fechaEntrega && isSameDay(new Date(p.fechaEntrega), hoy)),
    [pedidos, hoy]
  );

  /* ── Filtrar ── */
  const pedidosFiltrados = useMemo(() => {
    let list = [...pedidos];
    if (filterEstado !== "todos") list = list.filter(p => p.estado === filterEstado);
    if (filterPago !== "todos")   list = list.filter(p => p.estadoPago === filterPago);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(p =>
        p.numeroOrden?.toLowerCase().includes(q) ||
        p.cliente?.nombre?.toLowerCase().includes(q) ||
        p.cliente?.email?.toLowerCase().includes(q) ||
        p.cliente?.telefono?.includes(q)
      );
    }
    return list;
  }, [pedidos, filterEstado, filterPago, search]);

  /* ── Multi-select ── */
  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(pedidosFiltrados.map(p => p._id)));
    }
  };
  const allSelected = pedidosFiltrados.length > 0 &&
    pedidosFiltrados.every(p => selected.has(p._id));

  /* ── Bulk actions ── */
  const imprimirSeleccionados = () => {
    if (selected.size === 0) return;
    const ids = [...selected].join(",");
    window.open(`/dashboard/pedidos-galletas/imprimir?ids=${ids}`, "_blank");
  };

  const imprimirEntregasHoy = () => {
    if (entregasHoy.length === 0) {
      return Swal.fire({
        icon: "info", title: "Sin entregas hoy",
        text: "No hay pedidos programados para entregarse hoy.",
        timer: 2000, showConfirmButton: false,
        background: "#fff1f2", color: "#540027",
      });
    }
    const ids = entregasHoy.map(p => p._id).join(",");
    window.open(`/dashboard/pedidos-galletas/imprimir?ids=${ids}`, "_blank");
  };

  const bulkChangeEstado = async (nuevoEstado) => {
    if (selected.size === 0) return;
    const result = await Swal.fire({
      title: `Cambiar ${selected.size} pedido${selected.size === 1 ? "" : "s"} a "${ESTADOS.find(e => e.key === nuevoEstado).label}"?`,
      icon: "question",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#FF6F7D",
      cancelButtonColor: "#3a3a3a",
      confirmButtonText: "✓ Sí, cambiar",
      cancelButtonText: "Cancelar",
      background: "#fff1f2",
      color: "#540027",
      buttonsStyling: true,
      customClass: {
        confirmButton: "ru-swal-btn ru-swal-confirm",
        cancelButton:  "ru-swal-btn ru-swal-cancel",
        actions:       "ru-swal-actions",
      },
    });
    if (!result.isConfirmed) return;

    setBulkUpdating(true);
    try {
      await Promise.all(
        [...selected].map(id =>
          axios.patch(
            `${API_BASE}/galletaPedidos/${id}/estado`,
            { estado: nuevoEstado },
            { headers: authHeader }
          )
        )
      );
      setSelected(new Set());
      cargar();
      Swal.fire({
        icon: "success",
        title: `${selected.size} pedidos actualizados`,
        timer: 1500, showConfirmButton: false,
        background: "#fff1f2", color: "#540027",
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || err.message });
    } finally {
      setBulkUpdating(false);
    }
  };

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)" }}>
      <style jsx global>{`
        @media (max-width: 720px) {
          .pedidos-row {
            grid-template-columns: auto 1fr !important;
            gap: 0.5rem !important;
          }
          .pedidos-row .col-2,
          .pedidos-row .col-3 {
            grid-column: 2 !important;
          }
          .pedidos-row .col-arrow { display: none !important; }
          .filter-row { flex-direction: column !important; align-items: stretch !important; }
          .quick-actions { flex-direction: column !important; }
          .quick-actions button { width: 100% !important; }
        }
      `}</style>

      <NavbarAdmin />
      <div className="flex" style={{ marginTop: 64 }}>
        <Asideadmin />
        <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
          <main className="flex-1" style={{ maxWidth: 1400, margin: "0 auto", width: "100%", padding: "1.25rem 1rem 6rem" }}>

            {/* Header */}
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.7rem", color: "var(--rosa)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, marginBottom: 6 }}>Pedidos · Galletas NY</p>
              <h1 className={sofia.className} style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "var(--burdeos)", lineHeight: 1 }}>Gestión de pedidos</h1>
              <p style={{ color: "var(--text-soft)", marginTop: 6, fontSize: "0.88rem" }}>
                Filtra, busca, selecciona varios y haz acciones en lote.
              </p>
            </div>

            {/* Quick actions */}
            <div className="quick-actions" style={{ display: "flex", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
              <button
                onClick={imprimirEntregasHoy}
                style={{ padding: "10px 18px", borderRadius: "var(--r-pill)", background: "var(--burdeos)", color: "#fff", border: "none", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, boxShadow: "var(--shadow-sm)" }}
              >
                🖨️ Imprimir entregas de hoy ({entregasHoy.length})
              </button>
            </div>

            {/* Filters */}
            <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "0.85rem 1rem", boxShadow: "var(--shadow-sm)", marginBottom: "1rem" }}>
              <input
                type="search"
                placeholder="Buscar por número, nombre, email o teléfono…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid var(--border-color)", borderRadius: "var(--r-md)", fontSize: "0.88rem", fontFamily: "var(--font-nunito)", background: "var(--bg-sunken)", color: "var(--burdeos)", outline: "none", marginBottom: "0.6rem" }}
              />
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: "0.4rem" }}>
                <FilterChip label="Todos" active={filterEstado === "todos"} onClick={() => setFilterEstado("todos")} count={counts.todos} />
                {ESTADOS.map(e => (
                  <FilterChip key={e.key} label={e.label} active={filterEstado === e.key} onClick={() => setFilterEstado(e.key)} count={counts[e.key] || 0} color={e.color} text={e.text} />
                ))}
              </div>
              <div className="filter-row" style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Pago:</span>
                <FilterChip label="Todos"     active={filterPago === "todos"}   onClick={() => setFilterPago("todos")} />
                <FilterChip label="Pagado"    active={filterPago === "paid"}    onClick={() => setFilterPago("paid")} />
                <FilterChip label="Pendiente" active={filterPago === "pending"} onClick={() => setFilterPago("pending")} />
                <FilterChip label="Fallido"   active={filterPago === "failed"}  onClick={() => setFilterPago("failed")} />
              </div>
            </div>

            {/* Select all / count */}
            {pedidosFiltrados.length > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", padding: "0 0.25rem", flexWrap: "wrap", gap: 8 }}>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "var(--text-soft)", fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} style={{ width: 18, height: 18, accentColor: "var(--burdeos)" }} />
                  Seleccionar todos los visibles
                </label>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {pedidosFiltrados.length} de {pedidos.length} pedido{pedidos.length === 1 ? "" : "s"}
                </p>
              </div>
            )}

            {/* Lista */}
            {loading ? (
              <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                Cargando…
              </div>
            ) : pedidosFiltrados.length === 0 ? (
              <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "3rem", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📭</div>
                <p style={{ color: "var(--burdeos)", fontWeight: 700 }}>
                  {pedidos.length === 0 ? "Aún no hay pedidos" : "Ningún pedido coincide con los filtros"}
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {pedidosFiltrados.map(p => {
                  const estadoBadge = getEstadoBadge(p.estado);
                  const pagoBadge   = ESTADO_PAGO[p.estadoPago] || ESTADO_PAGO.pending;
                  const totalPiezas = (p.cajas || []).reduce((s, c) => s + (c.items || []).reduce((x, it) => x + it.cantidad, 0), 0);
                  const isSelected  = selected.has(p._id);
                  const esHoy       = p.fechaEntrega && isSameDay(new Date(p.fechaEntrega), hoy);

                  return (
                    <div
                      key={p._id}
                      className="pedidos-row"
                      style={{
                        background: "var(--bg-raised)",
                        borderRadius: "var(--r-xl)",
                        padding: "1rem 1.1rem",
                        boxShadow: isSelected ? "0 0 0 2px var(--burdeos), var(--shadow-sm)" : "var(--shadow-sm)",
                        display: "grid",
                        gridTemplateColumns: "auto 1fr 1fr 1fr auto",
                        gap: "0.75rem",
                        alignItems: "center",
                        transition: "transform 150ms, box-shadow 150ms",
                        position: "relative",
                      }}
                    >
                      {/* Checkbox */}
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(p._id)}
                          onClick={(e) => e.stopPropagation()}
                          style={{ width: 20, height: 20, accentColor: "var(--burdeos)", cursor: "pointer" }}
                        />
                      </div>

                      {/* Col 1: número + cliente — clickable para detalle */}
                      <Link href={`/dashboard/pedidos-galletas/${p._id}`} style={{ textDecoration: "none", minWidth: 0 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
                            <p className={sofia.className} style={{ fontSize: "1rem", color: "var(--burdeos)", fontFamily: "monospace", letterSpacing: "0.04em" }}>{p.numeroOrden}</p>
                            {esHoy && <span style={{ padding: "1px 7px", borderRadius: "var(--r-pill)", background: "var(--rosa)", color: "#fff", fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>Hoy</span>}
                          </div>
                          <p style={{ fontSize: "0.85rem", color: "var(--text-soft)", fontWeight: 700, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.cliente?.nombre}</p>
                          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.cliente?.email}</p>
                        </div>
                      </Link>

                      {/* Col 2: entrega */}
                      <Link href={`/dashboard/pedidos-galletas/${p._id}`} className="col-2" style={{ textDecoration: "none", minWidth: 0 }}>
                        <div>
                          <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 2 }}>
                            {p.tipoEntrega === "envio" ? "🚗 Envío" : "🏪 Recoger"}
                          </p>
                          <p style={{ fontSize: "0.85rem", color: "var(--burdeos)", fontWeight: 700 }}>
                            {formatearFecha(p.fechaEntrega)} · {p.horaEntrega}
                          </p>
                          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 1 }}>
                            {totalPiezas} galletas · {p.cajas?.length || 0} caja{(p.cajas?.length || 0) > 1 ? "s" : ""}
                          </p>
                        </div>
                      </Link>

                      {/* Col 3: badges + total */}
                      <Link href={`/dashboard/pedidos-galletas/${p._id}`} className="col-3" style={{ textDecoration: "none" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-start" }}>
                          <span style={{ padding: "3px 10px", borderRadius: "var(--r-pill)", fontSize: "0.7rem", fontWeight: 700, background: estadoBadge.color, color: estadoBadge.text }}>
                            {estadoBadge.label}
                          </span>
                          <span style={{ padding: "2px 8px", borderRadius: "var(--r-pill)", fontSize: "0.62rem", fontWeight: 700, background: pagoBadge.color, color: pagoBadge.text }}>
                            {pagoBadge.label}
                          </span>
                          <p className={sofia.className} style={{ fontSize: "1.25rem", color: "var(--burdeos)", marginTop: 2 }}>${p.total}</p>
                        </div>
                      </Link>

                      {/* Col 4: arrow (solo desktop) */}
                      <Link href={`/dashboard/pedidos-galletas/${p._id}`} className="col-arrow" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: "1.4rem" }}>
                        →
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
          <FooterDashboard />
        </div>
      </div>

      {/* ── Floating action bar — solo cuando hay seleccionados ── */}
      {selected.size > 0 && (
        <div style={{
          position: "fixed",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          background: "var(--burdeos)",
          color: "#fff",
          borderRadius: "var(--r-xl)",
          padding: "0.85rem 1.1rem",
          boxShadow: "0 16px 36px rgba(84,0,39,.35)",
          zIndex: 100,
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          flexWrap: "wrap",
          maxWidth: "calc(100vw - 2rem)",
        }}>
          <span style={{ fontWeight: 800, fontSize: "0.9rem", whiteSpace: "nowrap" }}>
            {selected.size} seleccionado{selected.size === 1 ? "" : "s"}
          </span>

          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,.2)" }} />

          <button
            onClick={imprimirSeleccionados}
            disabled={bulkUpdating}
            style={{ padding: "7px 14px", borderRadius: "var(--r-pill)", background: "var(--rosa)", color: "#fff", border: "none", fontWeight: 700, fontSize: "0.78rem", cursor: bulkUpdating ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}
          >
            🖨️ Imprimir
          </button>

          <select
            disabled={bulkUpdating}
            onChange={(e) => {
              if (e.target.value) {
                bulkChangeEstado(e.target.value);
                e.target.value = "";
              }
            }}
            defaultValue=""
            style={{ padding: "7px 12px", borderRadius: "var(--r-pill)", background: "rgba(255,255,255,.15)", color: "#fff", border: "none", fontWeight: 700, fontSize: "0.78rem", cursor: bulkUpdating ? "not-allowed" : "pointer", appearance: "none", paddingRight: 28, backgroundImage: "url(\"data:image/svg+xml;utf8,<svg fill='%23ffffff' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M7 10l5 5 5-5z'/></svg>\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center" }}
          >
            <option value="" disabled style={{ color: "#000" }}>Cambiar estado…</option>
            {ESTADOS.map(e => (
              <option key={e.key} value={e.key} style={{ color: "#000" }}>{e.label}</option>
            ))}
          </select>

          <button
            onClick={() => setSelected(new Set())}
            disabled={bulkUpdating}
            style={{ padding: "7px 12px", borderRadius: "var(--r-pill)", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,.3)", fontWeight: 700, fontSize: "0.78rem", cursor: bulkUpdating ? "not-allowed" : "pointer" }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, active, onClick, count, color, text }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 11px",
        borderRadius: "var(--r-pill)",
        border: `2px solid ${active ? "var(--burdeos)" : "var(--border-color)"}`,
        background: active ? "var(--burdeos)" : (color || "var(--bg-sunken)"),
        color: active ? "#fff" : (text || "var(--text-soft)"),
        fontWeight: 700,
        fontSize: "0.74rem",
        cursor: "pointer",
        fontFamily: "var(--font-nunito)",
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        transition: "all 120ms",
      }}
    >
      {label}
      {count != null && (
        <span style={{ padding: "1px 6px", borderRadius: "var(--r-pill)", background: active ? "rgba(255,255,255,.25)" : "rgba(84,0,39,.1)", color: active ? "#fff" : "var(--burdeos)", fontSize: "0.62rem", fontWeight: 800 }}>
          {count}
        </span>
      )}
    </button>
  );
}
