import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";
import { useAuth } from "@/src/context";
import { getGalletas, setGalletas, getPostres, setPostres, getVintage, setVintage } from "@/src/lib/unifiedCart";

const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "700", "800"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const MUNICIPIOS = ["Guadalajara", "Zapopan", "San Pedro Tlaquepaque", "Tonalá", "Tlajomulco de Zúñiga", "El Salto", "Juanacatlán", "Ixtlahuacán de los Membrillos", "Acatlán de Juárez"];

/**
 * Carrito unificado: combina Galletas NY + Postres + Pastel Vintage en un
 * solo checkout (POST /carrito/checkout → Stripe hosted). Cada pedido se
 * crea en su colección y aparece en su sección del dashboard.
 */
export default function MiCarrito() {
  const { userId, userName, userEmail, userPhone } = useAuth();

  const [galletas, setG] = useState([]);
  const [postres, setP] = useState([]);
  const [vintage, setV] = useState(null);
  const [sabores, setSabores] = useState([]);
  const [slots, setSlots] = useState([]);

  const [form, setForm] = useState({
    nombre: "", email: "", telefono: "",
    tipoEntrega: "recogida", fecha: "", hora: "",
    calleNumero: "", colonia: "", municipio: "", referencias: "", notas: "",
  });
  const [envio, setEnvio] = useState(null); // { zona, costo, nombre }
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setG(getGalletas()); setP(getPostres()); setV(getVintage());
    fetch(`${API_BASE}/galletaSabores`).then((r) => r.json()).then((j) => setSabores(j.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setForm((f) => ({ ...f, nombre: f.nombre || userName || "", email: f.email || userEmail || "", telefono: f.telefono || userPhone || "" }));
  }, [userName, userEmail, userPhone]);

  useEffect(() => {
    fetch(`${API_BASE}/galletaPedidos/slots?tipo=${form.tipoEntrega === "envio" ? "envio" : "recogida"}`)
      .then((r) => r.json()).then((j) => setSlots(j.data || [])).catch(() => setSlots([]));
  }, [form.tipoEntrega]);

  // Cotizar envío al tener colonia+municipio.
  useEffect(() => {
    if (form.tipoEntrega !== "envio" || !form.municipio) { setEnvio(null); return; }
    const t = setTimeout(() => {
      fetch(`${API_BASE}/galletaPedidos/cotizar-envio`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colonia: form.colonia, municipio: form.municipio }),
      }).then((r) => r.json()).then((j) => setEnvio(j.data || null)).catch(() => setEnvio(null));
    }, 350);
    return () => clearTimeout(t);
  }, [form.tipoEntrega, form.colonia, form.municipio]);

  const saborMap = useMemo(() => Object.fromEntries(sabores.map((s) => [s.slug, s])), [sabores]);

  const boxData = (box) => {
    const items = Object.entries(box.quantities || {}).filter(([, q]) => q > 0)
      .map(([slug, q]) => ({ slug, qty: q, nombre: saborMap[slug]?.nombre || slug, precio: saborMap[slug]?.precio || 0 }));
    return { items, total: items.reduce((s, it) => s + it.precio * it.qty, 0) };
  };

  const totalGalletas = galletas.reduce((s, b) => s + boxData(b).total, 0);
  const totalPostres = postres.reduce((s, it) => s + (it.precio || 0) * (it.cantidad || 0), 0);
  const totalVintage = vintage?.resumen?.total || 0;
  const costoEnvio = form.tipoEntrega === "envio" ? (envio?.costo || 0) : 0;
  const granTotal = totalGalletas + totalPostres + totalVintage + costoEnvio;
  const vacio = galletas.length === 0 && postres.length === 0 && !vintage;

  const quitarCaja = (i) => { const next = galletas.filter((_, idx) => idx !== i); setG(next); setGalletas(next); };
  const quitarPostre = (id) => { const next = postres.filter((it) => it.postreId !== id); setP(next); setPostres(next); };
  const quitarVintage = () => { setV(null); setVintage(null); };

  const pagar = async () => {
    setError("");
    if (!form.nombre || !form.email || !form.telefono) { setError("Completa tu nombre, email y teléfono."); return; }
    if (!form.fecha || !form.hora) { setError("Elige fecha y hora de entrega."); return; }
    if (form.tipoEntrega === "envio" && (!form.calleNumero || !form.colonia || !form.municipio)) { setError("Completa la dirección de envío."); return; }
    setEnviando(true);
    try {
      const payload = {
        cliente: { nombre: form.nombre, email: form.email, telefono: form.telefono, userId: userId || null },
        tipoEntrega: form.tipoEntrega,
        fechaEntrega: form.fecha,
        horaEntrega: form.hora,
        direccionEnvio: form.tipoEntrega === "envio" ? { calleNumero: form.calleNumero, colonia: form.colonia, municipio: form.municipio, referencias: form.referencias } : undefined,
        notas: form.notas,
        galletas: galletas.length ? { cajas: galletas.map((b) => ({ tamano: b.size, items: Object.entries(b.quantities || {}).filter(([, q]) => q > 0).map(([saborSlug, cantidad]) => ({ saborSlug, cantidad })) })) } : null,
        postres: postres.length ? { items: postres.map((it) => ({ postreId: it.postreId, cantidad: it.cantidad })) } : null,
        vintage: vintage?.config || null,
      };
      const r = await fetch(`${API_BASE}/carrito/checkout`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!r.ok || !j.url) throw new Error(j.message || "No se pudo iniciar el pago");
      window.location.href = j.url;
    } catch (e) {
      setError(e.message);
      setEnviando(false);
    }
  };

  const inp = { width: "100%", border: "1.5px solid var(--border-color)", borderRadius: "var(--r-md)", padding: 10, fontFamily: "var(--font-nunito)", fontSize: ".9rem" };
  const lbl = { fontSize: ".7rem", fontWeight: 800, textTransform: "uppercase", color: "var(--text-soft)", margin: "10px 0 4px", display: "block" };

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)" }}>
      <NavbarAdmin />
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "5.5rem 1.25rem 3rem" }}>
        <h1 className={sofia.className} style={{ fontSize: "clamp(2rem,5vw,3rem)", color: "var(--burdeos)", marginBottom: 6 }}>Tu carrito</h1>
        <p style={{ color: "var(--text-soft)", fontSize: ".9rem", marginBottom: 20 }}>Galletas NY, postres y pastel vintage — todo en un solo pago.</p>

        {vacio ? (
          <div style={{ background: "#fff", borderRadius: "var(--r-xl)", padding: "2.5rem", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
            <p style={{ fontSize: "2.5rem" }}>🛒</p>
            <p style={{ color: "var(--text-soft)", marginBottom: 16 }}>Tu carrito está vacío.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/enduser/galletas-ny" style={{ color: "var(--rosa)", fontWeight: 700 }}>Galletas NY</Link>
              <Link href="/enduser/postres" style={{ color: "var(--rosa)", fontWeight: 700 }}>Postres</Link>
              <Link href="/enduser/pastel-vintage" style={{ color: "var(--rosa)", fontWeight: 700 }}>Pastel Vintage</Link>
            </div>
          </div>
        ) : (
          <div className="carrito-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", alignItems: "start" }}>
            <div style={{ display: "grid", gap: 14 }}>
              {/* Galletas */}
              {galletas.length > 0 && (
                <section style={{ background: "#fff", borderRadius: "var(--r-xl)", padding: "1.25rem", boxShadow: "var(--shadow-sm)" }}>
                  <h2 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.3rem", marginBottom: 8 }}>🍪 Galletas NY</h2>
                  {galletas.map((b, i) => {
                    const d = boxData(b);
                    return (
                      <div key={i} style={{ borderBottom: "1px dashed var(--border-color)", padding: "8px 0", display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ fontSize: ".85rem", color: "var(--text-soft)" }}>
                          <strong style={{ color: "var(--burdeos)" }}>Caja {i + 1} ({b.size === "6" ? "media docena" : "docena"})</strong>
                          <div>{d.items.map((it) => `${it.qty}× ${it.nombre}`).join(", ") || "vacía"}</div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontWeight: 800, color: "var(--burdeos)" }}>${d.total}</div>
                          <button onClick={() => quitarCaja(i)} style={{ background: "none", border: "none", color: "#e05", fontSize: ".75rem", cursor: "pointer" }}>Quitar</button>
                        </div>
                      </div>
                    );
                  })}
                  <Link href="/enduser/galletas-ny" style={{ fontSize: ".8rem", color: "var(--rosa)", fontWeight: 700 }}>+ Editar / agregar cajas</Link>
                </section>
              )}

              {/* Postres */}
              {postres.length > 0 && (
                <section style={{ background: "#fff", borderRadius: "var(--r-xl)", padding: "1.25rem", boxShadow: "var(--shadow-sm)" }}>
                  <h2 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.3rem", marginBottom: 8 }}>🧁 Postres</h2>
                  {postres.map((it) => (
                    <div key={it.postreId} style={{ borderBottom: "1px dashed var(--border-color)", padding: "8px 0", display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontSize: ".9rem", color: "var(--burdeos)", fontWeight: 700 }}>{it.cantidad}× {it.nombre}</span>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontWeight: 800, color: "var(--burdeos)" }}>${(it.precio * it.cantidad).toLocaleString("es-MX")}</div>
                        <button onClick={() => quitarPostre(it.postreId)} style={{ background: "none", border: "none", color: "#e05", fontSize: ".75rem", cursor: "pointer" }}>Quitar</button>
                      </div>
                    </div>
                  ))}
                  <Link href="/enduser/postres" style={{ fontSize: ".8rem", color: "var(--rosa)", fontWeight: 700 }}>+ Agregar postres</Link>
                </section>
              )}

              {/* Vintage */}
              {vintage && (
                <section style={{ background: "#fff", borderRadius: "var(--r-xl)", padding: "1.25rem", boxShadow: "var(--shadow-sm)" }}>
                  <h2 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.3rem", marginBottom: 8 }}>🎀 Pastel Vintage</h2>
                  {/* Sin desglose por concepto: al cliente le mostramos el
                      pastel que armó y su total, no el vocabulario interno. */}
                  <p style={{ fontSize: ".85rem", color: "var(--text-soft)" }}>
                    Pastel armado a tu medida
                    {vintage.resumen?.porciones ? ` · ${vintage.resumen.porciones} porciones` : ""}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontWeight: 800, color: "var(--burdeos)" }}>
                    <span>Subtotal</span><span>${totalVintage.toLocaleString("es-MX")}</span>
                  </div>
                  <button onClick={quitarVintage} style={{ background: "none", border: "none", color: "#e05", fontSize: ".75rem", cursor: "pointer", marginTop: 4 }}>Quitar del carrito</button>
                  <p style={{ fontSize: ".72rem", color: "var(--text-soft)", marginTop: 6 }}>En el carrito el pastel vintage se paga completo. Si prefieres apartar con 50%, cómpralo por separado desde su página.</p>
                </section>
              )}
            </div>

            {/* Checkout */}
            <aside style={{ background: "#fff", borderRadius: "var(--r-xl)", padding: "1.25rem", boxShadow: "var(--shadow-md)", position: "sticky", top: 84 }}>
              <h3 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.3rem" }}>Pagar todo junto</h3>

              <label style={lbl}>Nombre</label>
              <input style={inp} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              <label style={lbl}>Email</label>
              <input style={inp} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <label style={lbl}>Teléfono</label>
              <input style={inp} value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />

              <label style={lbl}>Entrega</label>
              <select style={inp} value={form.tipoEntrega} onChange={(e) => setForm({ ...form, tipoEntrega: e.target.value, hora: "" })}>
                <option value="recogida">Recoger en sucursal</option>
                <option value="envio">Envío a domicilio (ZMG)</option>
              </select>

              <label style={lbl}>Fecha</label>
              <input style={inp} type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
              <label style={lbl}>Hora</label>
              <select style={inp} value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })}>
                <option value="">Selecciona…</option>
                {slots.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>

              {form.tipoEntrega === "envio" && (
                <>
                  <label style={lbl}>Calle y número</label>
                  <input style={inp} value={form.calleNumero} onChange={(e) => setForm({ ...form, calleNumero: e.target.value })} />
                  <label style={lbl}>Colonia</label>
                  <input style={inp} value={form.colonia} onChange={(e) => setForm({ ...form, colonia: e.target.value })} />
                  <label style={lbl}>Municipio</label>
                  <select style={inp} value={form.municipio} onChange={(e) => setForm({ ...form, municipio: e.target.value })}>
                    <option value="">Selecciona…</option>
                    {MUNICIPIOS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                  <label style={lbl}>Referencias</label>
                  <input style={inp} value={form.referencias} onChange={(e) => setForm({ ...form, referencias: e.target.value })} />
                </>
              )}

              <label style={lbl}>Notas</label>
              <textarea style={{ ...inp, resize: "vertical" }} rows={2} value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} />

              <div style={{ borderTop: "1px solid var(--border-color)", marginTop: 12, paddingTop: 10, fontSize: ".85rem", color: "var(--text-soft)" }}>
                {totalGalletas > 0 && <Row k="Galletas NY" v={totalGalletas} />}
                {totalPostres > 0 && <Row k="Postres" v={totalPostres} />}
                {totalVintage > 0 && <Row k="Pastel Vintage" v={totalVintage} />}
                {form.tipoEntrega === "envio" && <Row k={`Envío${envio?.nombre ? ` (${envio.nombre})` : ""}`} v={costoEnvio} />}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, color: "var(--burdeos)", fontSize: "1.05rem", marginTop: 6 }}>
                  <span>Total</span><span>${granTotal.toLocaleString("es-MX")}</span>
                </div>
              </div>

              {error && <p style={{ color: "#e05", fontSize: ".8rem", marginTop: 8 }}>{error}</p>}
              <button onClick={pagar} disabled={enviando} style={{ width: "100%", marginTop: 12, padding: 13, borderRadius: 999, border: "none", background: "var(--burdeos)", color: "#fff", fontWeight: 800, cursor: "pointer", opacity: enviando ? .6 : 1 }}>
                {enviando ? "Redirigiendo…" : `Pagar $${granTotal.toLocaleString("es-MX")}`}
              </button>
            </aside>
          </div>
        )}
      </main>
      <style jsx>{`@media (max-width: 860px){ .carrito-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
      <span>{k}</span><span>${Number(v).toLocaleString("es-MX")}</span>
    </div>
  );
}
