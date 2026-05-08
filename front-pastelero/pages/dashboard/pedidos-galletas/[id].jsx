import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
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

const STORE_ADDRESS = "Calle Bogotá 2866a, Col. Providencia, Guadalajara, Jal.";
const STORE_PHONE   = "374 102 5036";

const ESTADOS = [
  { key: "pendiente",       label: "Pendiente",       color: "#FFE99B", text: "#6B4F1A" },
  { key: "confirmado",      label: "Confirmado",      color: "#B8E6D3", text: "#1D5A45" },
  { key: "en_preparacion",  label: "En preparación",  color: "#D9C4E8", text: "#4B2A6E" },
  { key: "listo",           label: "Listo",           color: "#FFC9A5", text: "#7A4A1F" },
  { key: "entregado",       label: "Entregado",       color: "#9FB864", text: "#fff"    },
  { key: "cancelado",       label: "Cancelado",       color: "#F3C9D4", text: "#9c2a44" },
];

function formatearFechaLarga(d) {
  if (!d) return "";
  const dias  = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const f = new Date(d);
  return `${dias[f.getDay()]} ${f.getDate()} de ${meses[f.getMonth()]}, ${f.getFullYear()}`;
}

export default function PedidoDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { userToken } = useAuth();
  const authHeader = userToken ? { Authorization: `Bearer ${userToken}` } : {};

  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const cargar = async () => {
    if (!id || !userToken) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/galletaPedidos/${id}`, { headers: authHeader });
      setPedido(res.data.data);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "No se pudo cargar el pedido" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); /* eslint-disable-next-line */ }, [id, userToken]);

  const cambiarEstado = async (nuevoEstado) => {
    setUpdating(true);
    try {
      const res = await axios.patch(
        `${API_BASE}/galletaPedidos/${id}/estado`,
        { estado: nuevoEstado },
        { headers: authHeader }
      );
      setPedido(res.data.data);
      Swal.fire({
        icon: "success", title: "Estado actualizado",
        timer: 1200, showConfirmButton: false,
        background: "#fff1f2", color: "#540027",
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || err.message });
    } finally {
      setUpdating(false);
    }
  };

  const totalPiezas = pedido
    ? (pedido.cajas || []).reduce((s, c) => s + (c.items || []).reduce((x, it) => x + it.cantidad, 0), 0)
    : 0;

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)" }}>
      {/* CSS de impresión: oculta navegación, muestra solo el ticket */}
      <style jsx global>{`
        @media print {
          html, body { background: #fff !important; }
          aside, nav, footer, .no-print { display: none !important; }
          .print-only { display: block !important; }
          .ticket {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
            page-break-inside: avoid;
          }
          /* Tamaño 80mm para tickets térmicos. Si imprimes en carta, Chrome
             lo escala automáticamente. Para forzar 80mm: en el diálogo de
             impresión elige tamaño "80mm x auto" o "Receipt 80mm". */
          @page { margin: 8mm; }
        }
        .print-only { display: none; }
      `}</style>

      <NavbarAdmin />
      <div className="flex" style={{ marginTop: 64 }}>
        <Asideadmin />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6" style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>

          {loading || !pedido ? (
            <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              Cargando…
            </div>
          ) : (
            <>
              {/* Top bar (no se imprime) */}
              <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
                <Link href="/dashboard/pedidos-galletas" style={{ color: "var(--text-soft)", fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  ← Volver a la lista
                </Link>
                <button
                  onClick={() => window.print()}
                  style={{ padding: "10px 22px", borderRadius: "var(--r-pill)", background: "var(--burdeos)", color: "#fff", border: "none", fontWeight: 800, fontSize: "0.85rem", cursor: "pointer", boxShadow: "var(--shadow-sm)" }}
                >
                  🖨️ Imprimir
                </button>
              </div>

              {/* Estado actual — banner prominente (no se imprime) */}
              {(() => {
                const estadoActual = ESTADOS.find(e => e.key === pedido.estado) || ESTADOS[0];
                const pagoBadge = {
                  paid:     { label: "✓ Pagado",     color: "#1D5A45", bg: "#B8E6D3" },
                  pending:  { label: "⏳ Pago pendiente", color: "#6B4F1A", bg: "#FFE99B" },
                  failed:   { label: "✗ Pago fallido", color: "#9c2a44", bg: "#F3C9D4" },
                  refunded: { label: "↩ Reembolsado", color: "#4B2A6E", bg: "#D9C4E8" },
                }[pedido.estadoPago] || { label: pedido.estadoPago, color: "#666", bg: "#eee" };
                return (
                  <div className="no-print" style={{
                    background: estadoActual.color,
                    borderRadius: "var(--r-xl)",
                    padding: "1.25rem 1.5rem",
                    marginBottom: "1rem",
                    boxShadow: "var(--shadow-md)",
                    color: estadoActual.text,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                  }}>
                    <div>
                      <p style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, opacity: 0.85, marginBottom: 4 }}>Estado actual</p>
                      <p className={sofia.className} style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", lineHeight: 1 }}>{estadoActual.label}</p>
                    </div>
                    <span style={{ padding: "8px 16px", borderRadius: "var(--r-pill)", background: pagoBadge.bg, color: pagoBadge.color, fontWeight: 800, fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                      {pagoBadge.label}
                    </span>
                  </div>
                );
              })()}

              {/* Cambiar estado (no se imprime) */}
              <div className="no-print" style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "1rem 1.25rem", marginBottom: "1rem", boxShadow: "var(--shadow-sm)" }}>
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 8 }}>Cambiar estado</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {ESTADOS.map(e => {
                    const active = pedido.estado === e.key;
                    return (
                      <button
                        key={e.key}
                        onClick={() => !active && cambiarEstado(e.key)}
                        disabled={updating || active}
                        style={{
                          padding: "7px 16px",
                          borderRadius: "var(--r-pill)",
                          border: `2px solid ${active ? "var(--burdeos)" : "var(--border-color)"}`,
                          background: active ? "var(--burdeos)" : e.color,
                          color: active ? "#fff" : e.text,
                          fontWeight: 700, fontSize: "0.78rem",
                          cursor: (updating || active) ? "default" : "pointer",
                          fontFamily: "var(--font-nunito)",
                          opacity: updating ? 0.6 : 1,
                          transition: "all 120ms",
                        }}
                      >
                        {active && "✓ "}{e.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TICKET — se imprime */}
              <div className="ticket" style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", boxShadow: "var(--shadow-md)", overflow: "hidden" }}>

                {/* Header del ticket */}
                <div style={{ background: "linear-gradient(135deg,#FFC3C9,#FFA1AA)", padding: "1.5rem", textAlign: "center", color: "#fff" }}>
                  <p className={sofia.className} style={{ fontSize: "1.5rem", lineHeight: 1, marginBottom: 4 }}>Pastelería El Ruiseñor</p>
                  <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, opacity: 0.95 }}>Galletas NY · Pedido</p>
                </div>

                <div style={{ padding: "1.5rem" }}>
                  {/* Número de orden */}
                  <div style={{ borderLeft: "4px solid var(--rosa)", paddingLeft: "0.75rem", marginBottom: "1.25rem" }}>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Número de orden</p>
                    <p className={sofia.className} style={{ fontSize: "1.6rem", color: "var(--burdeos)", fontFamily: "monospace", letterSpacing: "0.04em" }}>{pedido.numeroOrden}</p>
                  </div>

                  {/* Grid 2 columnas */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                    {/* Cliente */}
                    <div>
                      <p style={{ fontSize: "0.7rem", color: "var(--rosa)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>Cliente</p>
                      <p style={{ color: "var(--burdeos)", fontWeight: 700 }}>{pedido.cliente?.nombre}</p>
                      <p style={{ color: "var(--text-soft)", fontSize: "0.85rem" }}>{pedido.cliente?.email}</p>
                      <p style={{ color: "var(--text-soft)", fontSize: "0.85rem" }}>📞 {pedido.cliente?.telefono}</p>
                    </div>

                    {/* Entrega */}
                    <div>
                      <p style={{ fontSize: "0.7rem", color: "var(--rosa)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>
                        {pedido.tipoEntrega === "envio" ? "🚗 Envío a domicilio" : "🏪 Recoger en sucursal"}
                      </p>
                      {pedido.tipoEntrega === "envio" ? (
                        <>
                          <p style={{ color: "var(--burdeos)", fontWeight: 700 }}>{pedido.direccionEnvio?.calleNumero}</p>
                          <p style={{ color: "var(--text-soft)", fontSize: "0.85rem" }}>Col. {pedido.direccionEnvio?.colonia}, {pedido.direccionEnvio?.municipio}</p>
                          {pedido.direccionEnvio?.referencias && (
                            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Ref: {pedido.direccionEnvio.referencias}</p>
                          )}
                          <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: 4 }}>Zona {pedido.direccionEnvio?.zona}</p>
                        </>
                      ) : (
                        <>
                          <p style={{ color: "var(--burdeos)", fontWeight: 700 }}>{STORE_ADDRESS}</p>
                        </>
                      )}
                      <div style={{ marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px dashed var(--border-color)" }}>
                        <p style={{ color: "var(--burdeos)", fontWeight: 700, fontSize: "0.95rem" }}>{formatearFechaLarga(pedido.fechaEntrega)}</p>
                        <p style={{ color: "var(--text-soft)", fontSize: "0.85rem" }}>Hora: <strong>{pedido.horaEntrega}</strong></p>
                      </div>
                    </div>
                  </div>

                  {/* Detalle de cajas */}
                  <div style={{ marginBottom: "1rem" }}>
                    <p style={{ fontSize: "0.7rem", color: "var(--rosa)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 8 }}>
                      Detalle ({totalPiezas} galletas en {pedido.cajas?.length || 0} caja{(pedido.cajas?.length || 0) > 1 ? "s" : ""})
                    </p>
                    {pedido.cajas?.map((caja, i) => (
                      <div key={i} style={{ background: "#fff1f2", borderRadius: "var(--r-md)", padding: "0.75rem 1rem", marginBottom: "0.5rem" }}>
                        <p style={{ fontWeight: 800, color: "var(--burdeos)", fontSize: "0.85rem", marginBottom: 4 }}>
                          Caja {i + 1} — {caja.tamano === "12" ? "Docena (12)" : "Media docena (6)"}
                        </p>
                        <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem", color: "var(--text-soft)" }}>
                          {caja.items.map((it, j) => (
                            <li key={j}>{it.cantidad}× {it.saborNombre} <span style={{ color: "var(--text-muted)" }}>(${it.precioUnitario} c/u)</span></li>
                          ))}
                        </ul>
                        {caja.descuento > 0 && (
                          <p style={{ fontSize: "0.78rem", color: "var(--menta-deep)", marginTop: 4 }}>Descuento: −${caja.descuento}</p>
                        )}
                        <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--burdeos)", textAlign: "right", marginTop: 4 }}>Subtotal: ${caja.total}</p>
                      </div>
                    ))}
                  </div>

                  {/* Totales */}
                  <table style={{ width: "100%", marginBottom: "1rem" }}>
                    <tbody>
                      <tr><td style={{ padding: "3px 0", color: "var(--text-soft)", fontSize: "0.85rem" }}>Productos</td><td style={{ padding: "3px 0", textAlign: "right", color: "var(--burdeos)", fontWeight: 700 }}>${pedido.subtotalProductos}</td></tr>
                      {pedido.costoEnvio > 0 && (
                        <tr><td style={{ padding: "3px 0", color: "var(--text-soft)", fontSize: "0.85rem" }}>Envío</td><td style={{ padding: "3px 0", textAlign: "right", color: "var(--burdeos)", fontWeight: 700 }}>${pedido.costoEnvio}</td></tr>
                      )}
                      <tr>
                        <td style={{ padding: "8px 0 0", borderTop: "2px solid var(--border-color)", color: "var(--burdeos)", fontWeight: 800 }}>Total</td>
                        <td style={{ padding: "8px 0 0", borderTop: "2px solid var(--border-color)", textAlign: "right", color: "var(--burdeos)", fontWeight: 800, fontSize: "1.2rem" }}>${pedido.total}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Notas */}
                  {pedido.notas && (
                    <div style={{ background: "#FFE99B", borderRadius: "var(--r-md)", padding: "0.75rem 1rem", marginBottom: "1rem" }}>
                      <p style={{ fontSize: "0.72rem", color: "#6B4F1A", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 2 }}>Nota del cliente</p>
                      <p style={{ color: "#6B4F1A", fontSize: "0.88rem", lineHeight: 1.5 }}>{pedido.notas}</p>
                    </div>
                  )}

                  {/* Estado del pago + estado del pedido (solo en pantalla) */}
                  <div className="no-print" style={{ display: "flex", gap: 8, fontSize: "0.78rem", color: "var(--text-muted)", paddingTop: "0.75rem", borderTop: "1px dashed var(--border-color)" }}>
                    <span>Pago: <strong style={{ color: "var(--burdeos)" }}>{pedido.estadoPago}</strong></span>
                    <span>·</span>
                    <span>Estado: <strong style={{ color: "var(--burdeos)" }}>{pedido.estado}</strong></span>
                    <span>·</span>
                    <span>Recibido: {new Date(pedido.createdAt).toLocaleString("es-MX")}</span>
                  </div>

                  {/* Footer del ticket — solo se imprime */}
                  <div className="print-only" style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "2px dashed #ccc", textAlign: "center" }}>
                    <p style={{ fontSize: "0.78rem", color: "#555" }}>{STORE_ADDRESS}</p>
                    <p style={{ fontSize: "0.78rem", color: "#555" }}>Tel. {STORE_PHONE}</p>
                    <p style={{ fontSize: "0.7rem", color: "#888", marginTop: 6 }}>Recibido el {new Date(pedido.createdAt).toLocaleString("es-MX")}</p>
                  </div>
                </div>
              </div>
            </>
          )}
          </main>
          <FooterDashboard />
        </div>
      </div>
    </div>
  );
}
