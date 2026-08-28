import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/src/context";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const STORE_ADDRESS = "Calle Bogotá 2866a, Col. Providencia, Guadalajara, Jal.";
const STORE_PHONE = "332 929 5129";

function fechaLarga(d) {
  if (!d) return "";
  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const f = new Date(d);
  return `${dias[f.getUTCDay()]} ${f.getUTCDate()} ${meses[f.getUTCMonth()]} ${f.getUTCFullYear()}`;
}

/** Imprimir pedidos de Pastel Vintage (?ids=...) — patrón galletas. */
export default function ImprimirVintage() {
  const router = useRouter();
  const { ids } = router.query;
  const { userToken } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!router.isReady || !ids || !userToken) return;
    const idList = String(ids).split(",").filter(Boolean);
    if (!idList.length) { setError("No se especificaron pedidos"); setLoading(false); return; }
    (async () => {
      try {
        const headers = { Authorization: `Bearer ${userToken}` };
        const results = await Promise.all(idList.map((id) =>
          fetch(`${API_BASE}/vintage-pedidos/${id}`, { headers }).then((r) => r.json()).then((j) => j.data).catch(() => null)
        ));
        const valid = results.filter(Boolean);
        valid.sort((a, b) => new Date(a.fecha || 0) - new Date(b.fecha || 0) || (a.envio?.hora || "").localeCompare(b.envio?.hora || ""));
        setPedidos(valid);
      } catch { setError("Error cargando los pedidos"); }
      finally { setLoading(false); }
    })();
  }, [router.isReady, ids, userToken]);

  useEffect(() => {
    if (!loading && pedidos.length > 0) {
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
          .ticket { page-break-after: always; page-break-inside: avoid; box-shadow: none !important; }
          .ticket:last-child { page-break-after: auto; }
        }
      `}</style>

      <div className="no-print" style={{ maxWidth: 720, margin: "0 auto 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <button onClick={() => window.history.back()} style={{ padding: "8px 16px", borderRadius: 999, background: "transparent", color: "#540027", border: "1px solid #E8B5BE", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>← Volver</button>
        <p style={{ fontSize: "0.85rem", color: "#5A3548" }}>Imprimiendo <strong>{pedidos.length}</strong> pedido{pedidos.length === 1 ? "" : "s"}</p>
        <button onClick={() => window.print()} style={{ padding: "8px 16px", borderRadius: 999, background: "#540027", color: "#fff", border: "none", fontWeight: 800, fontSize: "0.85rem", cursor: "pointer" }}>🖨️ Imprimir de nuevo</button>
      </div>

      {loading && <div className="no-print" style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", padding: "2rem", color: "#8B6B7A" }}>Cargando pedidos…</div>}
      {error && <div className="no-print" style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem", background: "#fff1f2", border: "1px solid #FF6F7D", borderRadius: 12, color: "#540027", textAlign: "center" }}>{error}</div>}

      {pedidos.map((p) => <Ticket key={p._id} p={p} />)}
    </div>
  );
}

function Row({ k, v }) {
  if (!v) return null;
  return <li><strong>{k}:</strong> {v}</li>;
}

function Ticket({ p }) {
  const s = p.seleccion || {};
  const esEnvio = p.envio?.tipo === "domicilio";
  return (
    <div className="ticket" style={{ maxWidth: 720, margin: "0 auto 1.5rem", background: "#fff", border: "1px solid #e5d6db", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 12px rgba(84,0,39,.06)" }}>
      <div style={{ background: "linear-gradient(135deg,#FFC3C9,#FFA1AA)", padding: "1.25rem", textAlign: "center", color: "#fff" }}>
        <p className={sofia.className} style={{ fontSize: "1.4rem", lineHeight: 1, marginBottom: 4 }}>Pastelería El Ruiseñor</p>
        <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, opacity: 0.95 }}>Pastel Vintage · Pedido</p>
      </div>
      <div style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem", borderLeft: "4px solid #FF6F7D", paddingLeft: "0.75rem", flexWrap: "wrap", gap: 8 }}>
          <div>
            <p style={{ fontSize: "0.65rem", color: "#888", textTransform: "uppercase", fontWeight: 700 }}>Número de orden</p>
            <p className={sofia.className} style={{ fontSize: "1.4rem", color: "#540027", fontFamily: "monospace" }}>{p.numeroOrden || String(p._id).slice(-6)}</p>
          </div>
          <span style={{ padding: "5px 14px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 800, background: "#fff1f2", color: "#540027", textTransform: "uppercase" }}>{p.status}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.65rem", color: "#FF6F7D", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Cliente</p>
            <p style={{ color: "#540027", fontWeight: 700, fontSize: "0.9rem" }}>{p.cliente?.nombre}</p>
            <p style={{ color: "#666", fontSize: "0.78rem" }}>{p.cliente?.email}</p>
            <p style={{ color: "#666", fontSize: "0.78rem" }}>📞 {p.cliente?.telefono}</p>
          </div>
          <div>
            <p style={{ fontSize: "0.65rem", color: "#FF6F7D", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>{esEnvio ? "🚗 Envío" : "🏪 Recoger"}</p>
            {esEnvio ? (
              <>
                <p style={{ color: "#540027", fontWeight: 700, fontSize: "0.85rem" }}>{p.envio?.direccion}</p>
                <p style={{ color: "#666", fontSize: "0.78rem" }}>Col. {p.envio?.colonia}, {p.envio?.municipio}{p.envio?.zona ? ` · Zona ${p.envio.zona}` : ""}</p>
              </>
            ) : (
              <p style={{ color: "#540027", fontSize: "0.82rem" }}>{STORE_ADDRESS}</p>
            )}
            <p style={{ color: "#540027", fontWeight: 700, fontSize: "0.88rem", marginTop: 4 }}>
              {fechaLarga(p.fecha)}{p.envio?.hora ? <> · <span style={{ background: "#FFE99B", padding: "2px 8px", borderRadius: 4, color: "#6B4F1A" }}>{p.envio.hora}</span></> : null}
            </p>
          </div>
        </div>

        <div style={{ background: "#fff1f2", borderRadius: 8, padding: "0.75rem 0.95rem", marginBottom: "0.85rem" }}>
          <p style={{ fontSize: "0.65rem", color: "#FF6F7D", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Configuración</p>
          <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.82rem", color: "#540027", lineHeight: 1.6 }}>
            <Row k="Porciones" v={s.porciones} />
            <Row k="Pisos" v={s.pisosSlug} />
            <Row k="Forma" v={s.formaSlug} />
            <Row k="Sabor" v={s.saborSlug} />
            <Row k="Relleno" v={s.rellenoSlug} />
            <Row k="Cobertura" v={s.coberturaSlug} />
            <Row k="Color" v={s.colorSlug} />
            <Row k="Decoraciones" v={(s.decoraciones || []).map((d) => `${d.nombre || d.slug}${d.colorNombre ? ` (${d.colorNombre})` : ""}`).join(", ")} />
            <Row k="Notas" v={p.notas} />
          </ul>
        </div>

        <table style={{ width: "100%", marginBottom: "0.75rem" }}>
          <tbody>
            <tr><td style={{ padding: "2px 0", color: "#666", fontSize: "0.8rem" }}>Productos</td><td style={{ textAlign: "right", color: "#540027", fontWeight: 700 }}>${p.totalProductos}</td></tr>
            {p.envio?.costo > 0 && <tr><td style={{ padding: "2px 0", color: "#666", fontSize: "0.8rem" }}>Envío</td><td style={{ textAlign: "right", color: "#540027", fontWeight: 700 }}>${p.envio.costo}</td></tr>}
            <tr><td style={{ padding: "5px 0 0", borderTop: "1.5px solid #ddd", color: "#540027", fontWeight: 800 }}>Total</td><td style={{ padding: "5px 0 0", borderTop: "1.5px solid #ddd", textAlign: "right", color: "#540027", fontWeight: 800, fontSize: "1.05rem" }}>${p.total}</td></tr>
            {p.saldoPendiente > 0 && <tr><td style={{ padding: "2px 0", color: "#666", fontSize: "0.8rem" }}>Saldo pendiente</td><td style={{ textAlign: "right", color: "#540027", fontWeight: 700 }}>${p.saldoPendiente}</td></tr>}
          </tbody>
        </table>

        <div style={{ paddingTop: "0.6rem", borderTop: "1px dashed #ccc", textAlign: "center" }}>
          <p style={{ fontSize: "0.7rem", color: "#888" }}>{STORE_PHONE} · {STORE_ADDRESS}</p>
          <p style={{ fontSize: "0.65rem", color: "#aaa" }}>Recibido: {new Date(p.createdAt).toLocaleString("es-MX")}</p>
        </div>
      </div>
    </div>
  );
}
