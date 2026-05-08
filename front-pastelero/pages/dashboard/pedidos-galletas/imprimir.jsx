import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "@/src/context";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const STORE_ADDRESS = "Calle Bogotá 2866a, Col. Providencia, Guadalajara, Jal.";
const STORE_PHONE   = "374 102 5036";

function formatearFechaLarga(d) {
  if (!d) return "";
  const dias  = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const f = new Date(d);
  return `${dias[f.getDay()]} ${f.getDate()} ${meses[f.getMonth()]} ${f.getFullYear()}`;
}

/**
 * Página dedicada a imprimir múltiples pedidos.
 *
 * Recibe ?ids=id1,id2,id3 — fetcha cada uno en paralelo, los renderiza
 * uno tras otro con page-break-after entre cada uno, y dispara
 * window.print() automáticamente cuando todos cargaron.
 */
export default function ImprimirPedidos() {
  const router = useRouter();
  const { ids } = router.query;
  const { userToken } = useAuth();

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!router.isReady) return;
    if (!ids || !userToken) return;

    const idList = String(ids).split(",").filter(Boolean);
    if (idList.length === 0) {
      setError("No se especificaron pedidos para imprimir");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const headers = { Authorization: `Bearer ${userToken}` };
        const results = await Promise.all(
          idList.map(id =>
            axios.get(`${API_BASE}/galletaPedidos/${id}`, { headers })
              .then(r => r.data.data)
              .catch(() => null)
          )
        );
        const valid = results.filter(Boolean);
        // Ordenar por hora de entrega para que el que sale primero a entregar quede arriba
        valid.sort((a, b) => {
          const da = new Date(a.fechaEntrega).getTime();
          const db = new Date(b.fechaEntrega).getTime();
          if (da !== db) return da - db;
          return (a.horaEntrega || "").localeCompare(b.horaEntrega || "");
        });
        setPedidos(valid);
      } catch (err) {
        setError("Error cargando los pedidos");
      } finally {
        setLoading(false);
      }
    })();
  }, [router.isReady, ids, userToken]);

  // Auto-print cuando todo cargó
  useEffect(() => {
    if (!loading && pedidos.length > 0) {
      // Pequeño delay para que el navegador termine de renderizar
      const t = setTimeout(() => window.print(), 400);
      return () => clearTimeout(t);
    }
  }, [loading, pedidos]);

  return (
    <div className={nunito.className} style={{ background: "#fff", minHeight: "100vh", padding: "1.5rem" }}>
      <style jsx global>{`
        @page { margin: 10mm; }
        @media print {
          .no-print { display: none !important; }
          .ticket {
            page-break-after: always;
            page-break-inside: avoid;
            box-shadow: none !important;
          }
          .ticket:last-child { page-break-after: auto; }
        }
      `}</style>

      {/* Header solo en pantalla — controles para reimprimir / volver */}
      <div className="no-print" style={{ maxWidth: 720, margin: "0 auto 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <button
          onClick={() => window.history.back()}
          style={{ padding: "8px 16px", borderRadius: "var(--r-pill)", background: "transparent", color: "var(--burdeos)", border: "1px solid var(--border-strong)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
        >
          ← Volver
        </button>
        <p style={{ fontSize: "0.85rem", color: "var(--text-soft)" }}>
          Imprimiendo <strong>{pedidos.length}</strong> pedido{pedidos.length === 1 ? "" : "s"}
        </p>
        <button
          onClick={() => window.print()}
          style={{ padding: "8px 16px", borderRadius: "var(--r-pill)", background: "var(--burdeos)", color: "#fff", border: "none", fontWeight: 800, fontSize: "0.85rem", cursor: "pointer" }}
        >
          🖨️ Imprimir de nuevo
        </button>
      </div>

      {loading && (
        <div className="no-print" style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
          Cargando pedidos…
        </div>
      )}

      {error && (
        <div className="no-print" style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem", background: "#fff1f2", border: "1px solid var(--rosa)", borderRadius: "var(--r-md)", color: "var(--burdeos)", textAlign: "center" }}>
          {error}
        </div>
      )}

      {/* Renderizar cada ticket con page-break entre ellos */}
      {pedidos.map(pedido => (
        <Ticket key={pedido._id} pedido={pedido} />
      ))}
    </div>
  );
}

function Ticket({ pedido }) {
  const totalPiezas = (pedido.cajas || []).reduce((s, c) => s + (c.items || []).reduce((x, it) => x + it.cantidad, 0), 0);

  return (
    <div className="ticket" style={{ maxWidth: 720, margin: "0 auto 1.5rem", background: "#fff", border: "1px solid #e5d6db", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 12px rgba(84,0,39,.06)" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#FFC3C9,#FFA1AA)", padding: "1.25rem", textAlign: "center", color: "#fff" }}>
        <p className={sofia.className} style={{ fontSize: "1.4rem", lineHeight: 1, marginBottom: 4 }}>Pastelería El Ruiseñor</p>
        <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, opacity: 0.95 }}>Galletas NY · Pedido</p>
      </div>

      <div style={{ padding: "1.25rem" }}>
        {/* Número de orden + estado */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem", borderLeft: "4px solid #FF6F7D", paddingLeft: "0.75rem", flexWrap: "wrap", gap: 8 }}>
          <div>
            <p style={{ fontSize: "0.65rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Número de orden</p>
            <p className={sofia.className} style={{ fontSize: "1.4rem", color: "#540027", fontFamily: "monospace", letterSpacing: "0.04em" }}>{pedido.numeroOrden}</p>
          </div>
          <span style={{ padding: "5px 14px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 800, background: "#fff1f2", color: "#540027", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {pedido.estado.replace(/_/g, " ")}
          </span>
        </div>

        {/* Grid 2 cols: cliente + entrega */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.65rem", color: "#FF6F7D", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 4 }}>Cliente</p>
            <p style={{ color: "#540027", fontWeight: 700, fontSize: "0.9rem" }}>{pedido.cliente?.nombre}</p>
            <p style={{ color: "#666", fontSize: "0.78rem" }}>{pedido.cliente?.email}</p>
            <p style={{ color: "#666", fontSize: "0.78rem" }}>📞 {pedido.cliente?.telefono}</p>
          </div>

          <div>
            <p style={{ fontSize: "0.65rem", color: "#FF6F7D", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 4 }}>
              {pedido.tipoEntrega === "envio" ? "🚗 Envío" : "🏪 Recoger"}
            </p>
            {pedido.tipoEntrega === "envio" ? (
              <>
                <p style={{ color: "#540027", fontWeight: 700, fontSize: "0.85rem" }}>{pedido.direccionEnvio?.calleNumero}</p>
                <p style={{ color: "#666", fontSize: "0.78rem" }}>Col. {pedido.direccionEnvio?.colonia}, {pedido.direccionEnvio?.municipio}</p>
                {pedido.direccionEnvio?.referencias && <p style={{ color: "#888", fontSize: "0.74rem" }}>Ref: {pedido.direccionEnvio.referencias}</p>}
                <p style={{ color: "#888", fontSize: "0.7rem" }}>Zona {pedido.direccionEnvio?.zona}</p>
              </>
            ) : (
              <p style={{ color: "#540027", fontSize: "0.82rem" }}>{STORE_ADDRESS}</p>
            )}
            <p style={{ color: "#540027", fontWeight: 700, fontSize: "0.88rem", marginTop: 4 }}>
              {formatearFechaLarga(pedido.fechaEntrega)} · <span style={{ background: "#FFE99B", padding: "2px 8px", borderRadius: 4, color: "#6B4F1A" }}>{pedido.horaEntrega}</span>
            </p>
          </div>
        </div>

        {/* Detalle */}
        <div style={{ marginBottom: "0.85rem" }}>
          <p style={{ fontSize: "0.65rem", color: "#FF6F7D", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>
            Detalle ({totalPiezas} galletas en {pedido.cajas?.length || 0} caja{(pedido.cajas?.length || 0) > 1 ? "s" : ""})
          </p>
          {pedido.cajas?.map((caja, i) => (
            <div key={i} style={{ background: "#fff1f2", borderRadius: 8, padding: "0.6rem 0.85rem", marginBottom: 5 }}>
              <p style={{ fontWeight: 800, color: "#540027", fontSize: "0.8rem", marginBottom: 3 }}>
                Caja {i + 1} — {caja.tamano === "12" ? "Docena (12)" : "Media docena (6)"}
              </p>
              <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.78rem", color: "#666" }}>
                {caja.items.map((it, j) => (
                  <li key={j}>{it.cantidad}× {it.saborNombre}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Totales */}
        <table style={{ width: "100%", marginBottom: "0.75rem" }}>
          <tbody>
            <tr><td style={{ padding: "2px 0", color: "#666", fontSize: "0.8rem" }}>Productos</td><td style={{ padding: "2px 0", textAlign: "right", color: "#540027", fontWeight: 700, fontSize: "0.85rem" }}>${pedido.subtotalProductos}</td></tr>
            {pedido.costoEnvio > 0 && (
              <tr><td style={{ padding: "2px 0", color: "#666", fontSize: "0.8rem" }}>Envío</td><td style={{ padding: "2px 0", textAlign: "right", color: "#540027", fontWeight: 700, fontSize: "0.85rem" }}>${pedido.costoEnvio}</td></tr>
            )}
            <tr><td style={{ padding: "5px 0 0", borderTop: "1.5px solid #ddd", color: "#540027", fontWeight: 800, fontSize: "0.85rem" }}>Total</td><td style={{ padding: "5px 0 0", borderTop: "1.5px solid #ddd", textAlign: "right", color: "#540027", fontWeight: 800, fontSize: "1.05rem" }}>${pedido.total}</td></tr>
          </tbody>
        </table>

        {/* Notas */}
        {pedido.notas && (
          <div style={{ background: "#FFE99B", borderRadius: 6, padding: "0.55rem 0.85rem", marginBottom: "0.6rem" }}>
            <p style={{ fontSize: "0.65rem", color: "#6B4F1A", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 2 }}>Nota del cliente</p>
            <p style={{ color: "#6B4F1A", fontSize: "0.82rem", lineHeight: 1.4 }}>{pedido.notas}</p>
          </div>
        )}

        {/* Footer */}
        <div style={{ paddingTop: "0.6rem", borderTop: "1px dashed #ccc", textAlign: "center" }}>
          <p style={{ fontSize: "0.7rem", color: "#888" }}>{STORE_PHONE} · {STORE_ADDRESS}</p>
          <p style={{ fontSize: "0.65rem", color: "#aaa" }}>Recibido: {new Date(pedido.createdAt).toLocaleString("es-MX")}</p>
        </div>
      </div>
    </div>
  );
}
