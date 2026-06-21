import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";
import { esDiaNoDisponible, MENSAJE_DIA } from "@/src/lib/disponibilidad";

const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "700", "800"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Caja geográfica aproximada de Jalisco (sin API).
function enJalisco(lat, lng) {
  return lat >= 18.8 && lat <= 22.8 && lng >= -105.8 && lng <= -101.4;
}

const MUNICIPIOS_JAL = [
  "Guadalajara", "Zapopan", "San Pedro Tlaquepaque", "Tonalá", "Tlajomulco de Zúñiga",
  "El Salto", "Juanacatlán", "Ixtlahuacán de los Membrillos", "Acatlán de Juárez", "Otro municipio de Jalisco",
];

// Días hábiles a partir de hoy (sin sáb/dom) → fecha mínima YYYY-MM-DD.
function fechaMinHabil(dias) {
  const d = new Date();
  let r = dias;
  while (r > 0) { d.setDate(d.getDate() + 1); const w = d.getDay(); if (w !== 0 && w !== 6) r--; }
  return d.toISOString().slice(0, 10);
}

export default function PastelVintage() {
  // ── Gate de ubicación ───────────────────────────────────────────
  const [geo, setGeo] = useState("checando"); // checando | permitido | fuera | manual
  const [muni, setMuni] = useState("");

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) { setGeo("manual"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => setGeo(enJalisco(pos.coords.latitude, pos.coords.longitude) ? "permitido" : "fuera"),
      () => setGeo("manual"),
      { timeout: 8000 }
    );
  }, []);

  const permitido = geo === "permitido" || (geo === "manual" && muni && muni !== "Fuera de Jalisco");

  // ── Catálogos ───────────────────────────────────────────────────
  const [cat, setCat] = useState({ porciones: [], pisos: [], formas: [], colores: [], decoraciones: [], sabores: [], rellenos: [], coberturas: [] });

  useEffect(() => {
    if (!permitido) return;
    const g = (p) => fetch(`${API_BASE}/${p}`).then((r) => r.json()).then((j) => j.data || []).catch(() => []);
    Promise.all([
      g("vintage-catalogos/porciones"), g("vintage-catalogos/pisos"), g("vintage-catalogos/formas"),
      g("vintage-catalogos/colores"), g("vintage-catalogos/decoraciones"),
      g("cotizacion-catalogos/sabores"), g("cotizacion-catalogos/rellenos"), g("cotizacion-catalogos/coberturas"),
    ]).then(([porciones, pisos, formas, colores, decoraciones, sabores, rellenos, coberturas]) => {
      setCat({
        porciones, pisos, formas, colores, decoraciones,
        sabores: sabores.filter((s) => s.paraVintage),
        rellenos: rellenos.filter((s) => s.paraVintage),
        coberturas: coberturas.filter((s) => s.paraVintage),
      });
    });
  }, [permitido]);

  // ── Selección ───────────────────────────────────────────────────
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState({
    porcionSlug: "", pisosSlug: "", formaSlug: "", saborSlug: "", rellenoSlug: "",
    coberturaSlug: "", colorSlug: "", decoraciones: [], notas: "",
    fecha: "", entregaTipo: "recoger-local",
    clienteNombre: "", clienteTelefono: "", clienteEmail: "",
    colonia: "", municipio: "", direccion: "",
  });
  const upd = (patch) => setSel((s) => ({ ...s, ...patch }));

  const [creando, setCreando] = useState(false);
  const [pedido, setPedido] = useState(null); // { _id, total, anticipo, numeroOrden }
  const [pagando, setPagando] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("pago") === "ok") {
      // Confirmación tras Stripe.
      setGeo("permitido");
    }
  }, []);

  const finalizar = async () => {
    if (!sel.clienteNombre || !sel.clienteTelefono) { alert("Necesitamos tu nombre y teléfono."); return; }
    if (!sel.fecha) { alert("Elige la fecha de entrega."); return; }
    if (sel.entregaTipo === "domicilio" && !sel.municipio) { alert("Indica tu municipio para el envío."); return; }
    setCreando(true);
    try {
      const r = await fetch(`${API_BASE}/vintage-pedidos`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          porcionSlug: sel.porcionSlug, pisosSlug: sel.pisosSlug, formaSlug: sel.formaSlug,
          saborSlug: sel.saborSlug, rellenoSlug: sel.rellenoSlug, coberturaSlug: sel.coberturaSlug,
          colorSlug: sel.colorSlug, decoraciones: sel.decoraciones, notas: sel.notas, fecha: sel.fecha,
          entrega: { tipo: sel.entregaTipo, colonia: sel.colonia, municipio: sel.municipio, direccion: sel.direccion },
          cliente: { nombre: sel.clienteNombre, telefono: sel.clienteTelefono, email: sel.clienteEmail },
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Error");
      setPedido(j.data);
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setCreando(false);
    }
  };

  const pagar = async (paymentOption) => {
    setPagando(true);
    try {
      const r = await fetch(`${API_BASE}/checkout/vintage-checkout`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pedidoId: pedido._id, paymentOption }),
      });
      const j = await r.json();
      if (!r.ok || !j.url) throw new Error(j.message || "No se pudo iniciar el pago");
      window.location.href = j.url;
    } catch (e) {
      alert("Error: " + e.message);
      setPagando(false);
    }
  };

  const porcion = cat.porciones.find((p) => p.slug === sel.porcionSlug);
  const color = cat.colores.find((c) => c.slug === sel.colorSlug);
  const pisosDisponibles = cat.pisos.filter((p) => p.niveles <= (porcion?.pisosMax || 1)).sort((a, b) => a.niveles - b.niveles);
  const anticip = porcion?.anticipacionDias ?? 5;
  const fechaMin = useMemo(() => fechaMinHabil(anticip), [anticip]);

  // ── Total en vivo ───────────────────────────────────────────────
  const [cotz, setCotz] = useState({ items: [], total: 0 });
  const tRef = useRef();
  useEffect(() => {
    if (!sel.porcionSlug) { setCotz({ items: [], total: 0 }); return; }
    clearTimeout(tRef.current);
    tRef.current = setTimeout(() => {
      fetch(`${API_BASE}/vintage-catalogos/cotizar`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          porcionSlug: sel.porcionSlug, pisosSlug: sel.pisosSlug, formaSlug: sel.formaSlug,
          saborSlug: sel.saborSlug, rellenoSlug: sel.rellenoSlug, coberturaSlug: sel.coberturaSlug,
          colorSlug: sel.colorSlug, decoraciones: sel.decoraciones.map((d) => ({ slug: d.slug })),
        }),
      }).then((r) => r.json()).then(setCotz).catch(() => {});
    }, 350);
  }, [sel]);

  // Capas del visualizador (forma/base color + decoraciones por color).
  const capas = [
    cat.formas.find((f) => f.slug === sel.formaSlug)?.imagenUrl,
    color?.imagenUrl,
    ...sel.decoraciones.map((d) => d.imagenUrl).filter(Boolean),
  ].filter(Boolean);

  // ── Render: gate ─────────────────────────────────────────────────
  if (geo === "checando") return <Shell><p style={{ color: "var(--text-soft)" }}>Verificando tu ubicación…</p></Shell>;
  if (geo === "fuera") return <Bloqueado />;
  if (geo === "manual" && (!muni || muni === "Fuera de Jalisco")) {
    return (
      <Shell>
        <h1 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "2rem", marginBottom: 8 }}>Confírmanos tu ubicación</h1>
        <p style={{ color: "var(--text-soft)", marginBottom: 16 }}>Este pastel solo está disponible en Jalisco. Indícanos tu municipio:</p>
        <select className="border rounded px-3 py-2" style={{ minWidth: 260 }} value={muni} onChange={(e) => setMuni(e.target.value)}>
          <option value="">Selecciona…</option>
          {MUNICIPIOS_JAL.map((m) => <option key={m} value={m}>{m}</option>)}
          <option value="Fuera de Jalisco">Estoy fuera de Jalisco</option>
        </select>
        {muni === "Fuera de Jalisco" && <Bloqueado inline />}
      </Shell>
    );
  }

  // ── Pasos ────────────────────────────────────────────────────────
  const pasos = [
    {
      label: "Porciones", title: "Elige las porciones",
      desc: "Define el tamaño; según el número de porciones se habilitan los pisos.",
      content: (
        <div>
          <Grid options={cat.porciones.map((p) => ({ id: p.slug, label: p.nombre, sub: `${p.porciones} porciones · hasta ${p.pisosMax} piso${p.pisosMax > 1 ? "s" : ""}`, extra: `${p.anticipacionDias} días hábiles` }))}
            selected={sel.porcionSlug} onSelect={(v) => upd({ porcionSlug: v, pisosSlug: "" })} />
          {porcion && pisosDisponibles.length > 0 && (
            <>
              <p style={lbl}>Pisos</p>
              <Grid options={pisosDisponibles.map((p) => ({ id: p.slug, label: p.nombre, sub: `${p.niveles} nivel${p.niveles > 1 ? "es" : ""}` }))}
                selected={sel.pisosSlug} onSelect={(v) => upd({ pisosSlug: v })} />
            </>
          )}
        </div>
      ),
    },
    { label: "Forma", title: "Elige la forma", desc: "La silueta de tu pastel.",
      content: <Grid options={cat.formas.map((f) => ({ id: f.slug, label: `${f.emoji ? f.emoji + " " : ""}${f.nombre}` }))} selected={sel.formaSlug} onSelect={(v) => upd({ formaSlug: v })} /> },
    { label: "Sabor", title: "Elige tu sabor", desc: "",
      content: <Grid empty="No hay sabores disponibles para vintage." options={cat.sabores.map((s) => ({ id: s.slug, label: `${s.emoji ? s.emoji + " " : ""}${s.nombre}`, sub: s.descripcion }))} selected={sel.saborSlug} onSelect={(v) => upd({ saborSlug: v })} /> },
    { label: "Relleno", title: "Elige tu relleno", desc: "",
      content: <Grid options={cat.rellenos.map((s) => ({ id: s.slug, label: s.nombre, sub: s.descripcion }))} selected={sel.rellenoSlug} onSelect={(v) => upd({ rellenoSlug: v })} /> },
    { label: "Cobertura", title: "Elige la cobertura", desc: "",
      content: <Grid options={cat.coberturas.map((s) => ({ id: s.slug, label: s.nombre, sub: s.descripcion }))} selected={sel.coberturaSlug} onSelect={(v) => upd({ coberturaSlug: v })} /> },
    { label: "Color", title: "Color base", desc: "El color exterior de tu pastel.",
      content: (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {cat.colores.map((c) => (
            <button key={c.slug} type="button" onClick={() => upd({ colorSlug: c.slug })}
              style={{ width: 56, height: 56, borderRadius: "50%", background: c.hex, border: sel.colorSlug === c.slug ? "3px solid var(--burdeos)" : "3px solid transparent", cursor: "pointer", boxShadow: "var(--shadow-sm)" }} title={c.nombre} />
          ))}
          {cat.colores.length === 0 && <p style={{ color: "var(--text-soft)", fontSize: ".85rem" }}>No hay colores dados de alta.</p>}
        </div>
      ),
    },
    { label: "Decoración", title: "Decoraciones", desc: "Elige varias; para cada una, su color.",
      content: (
        <div style={{ display: "grid", gap: 10 }}>
          {cat.decoraciones.map((d) => {
            const elegido = sel.decoraciones.find((x) => x.slug === d.slug);
            return (
              <div key={d.slug} style={{ border: "1.5px solid var(--border-color)", borderRadius: "var(--r-md)", padding: 12, background: elegido ? "var(--rosa-4)" : "#fff" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--burdeos)", cursor: "pointer" }}>
                  <input type="checkbox" checked={!!elegido} onChange={(e) => {
                    if (e.target.checked) {
                      const primera = d.colores?.[0];
                      upd({ decoraciones: [...sel.decoraciones, { slug: d.slug, nombre: d.nombre, colorNombre: primera?.nombre || "", imagenUrl: primera?.imagenUrl || "" }] });
                    } else {
                      upd({ decoraciones: sel.decoraciones.filter((x) => x.slug !== d.slug) });
                    }
                  }} />
                  {d.nombre}
                </label>
                {elegido && (d.colores || []).length > 0 && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    {d.colores.map((c) => (
                      <button key={c.nombre} type="button" title={c.nombre}
                        onClick={() => upd({ decoraciones: sel.decoraciones.map((x) => x.slug === d.slug ? { ...x, colorNombre: c.nombre, imagenUrl: c.imagenUrl } : x) })}
                        style={{ width: 32, height: 32, borderRadius: "50%", background: c.hex, border: elegido.colorNombre === c.nombre ? "3px solid var(--burdeos)" : "2px solid #fff", boxShadow: "0 0 0 1px #ddd", cursor: "pointer" }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {cat.decoraciones.length === 0 && <p style={{ color: "var(--text-soft)", fontSize: ".85rem" }}>No hay decoraciones dadas de alta.</p>}
        </div>
      ),
    },
    { label: "Notas", title: "Notas y detalles", desc: "¿Texto en el pastel, temática o algo a considerar?",
      content: <textarea rows={4} value={sel.notas} onChange={(e) => upd({ notas: e.target.value })} placeholder="Ej. 'Feliz cumpleaños Ana', tema mariposas, alergias…"
        style={{ width: "100%", border: "1.5px solid var(--border-color)", borderRadius: "var(--r-md)", padding: 12, fontFamily: "var(--font-nunito)" }} /> },
    { label: "Fecha", title: "Fecha y entrega", desc: `Anticipación mínima: ${anticip} días hábiles (sin domingos).`,
      content: (
        <div style={{ display: "grid", gap: 12, maxWidth: 360 }}>
          <div>
            <p style={lbl}>Fecha de entrega</p>
            <input type="date" min={fechaMin} value={sel.fecha}
              onChange={(e) => { if (esDiaNoDisponible(e.target.value)) { alert(MENSAJE_DIA); return; } upd({ fecha: e.target.value }); }}
              style={{ width: "100%", border: "1.5px solid var(--border-color)", borderRadius: "var(--r-md)", padding: 10 }} />
          </div>
          <div>
            <p style={lbl}>Entrega</p>
            <select value={sel.entregaTipo} onChange={(e) => upd({ entregaTipo: e.target.value })} style={inputStyle}>
              <option value="recoger-local">Recoger en local</option>
              <option value="domicilio">A domicilio (Jalisco)</option>
            </select>
          </div>
          {sel.entregaTipo === "domicilio" && (
            <>
              <div>
                <p style={lbl}>Municipio</p>
                <select value={sel.municipio} onChange={(e) => upd({ municipio: e.target.value })} style={inputStyle}>
                  <option value="">Selecciona…</option>
                  {MUNICIPIOS_JAL.filter((m) => m !== "Otro municipio de Jalisco").map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div><p style={lbl}>Colonia</p><input value={sel.colonia} onChange={(e) => upd({ colonia: e.target.value })} style={inputStyle} placeholder="Para calcular la zona de envío" /></div>
              <div><p style={lbl}>Calle y número</p><input value={sel.direccion} onChange={(e) => upd({ direccion: e.target.value })} style={inputStyle} /></div>
            </>
          )}
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: 12 }}>
            <p style={lbl}>Tus datos</p>
            <input value={sel.clienteNombre} onChange={(e) => upd({ clienteNombre: e.target.value })} style={{ ...inputStyle, marginBottom: 8 }} placeholder="Nombre completo" />
            <input value={sel.clienteTelefono} onChange={(e) => upd({ clienteTelefono: e.target.value })} style={{ ...inputStyle, marginBottom: 8 }} placeholder="Teléfono" />
            <input value={sel.clienteEmail} onChange={(e) => upd({ clienteEmail: e.target.value })} style={inputStyle} placeholder="Email (para tu confirmación)" />
          </div>
        </div>
      ),
    },
  ];

  const cur = pasos[step];

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)" }}>
      <NavbarAdmin />
      <main style={{ maxWidth: 1040, margin: "0 auto", padding: "5rem 1.25rem 3rem" }}>
        <p style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--rosa)" }}>Edición Vintage · Personalizable</p>
        <h1 className={sofia.className} style={{ fontSize: "clamp(2.2rem,6vw,4rem)", color: "var(--burdeos)", lineHeight: 1 }}>Arma tu pastel vintage</h1>

        {/* Stepper */}
        <div style={{ display: "flex", gap: 4, margin: "1.25rem 0", overflowX: "auto", paddingBottom: 6 }}>
          {pasos.map((p, i) => (
            <button key={p.label} onClick={() => setStep(i)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", minWidth: 64 }}>
              <span style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: ".8rem",
                background: i < step ? "var(--menta-deep)" : i === step ? "var(--rosa)" : "var(--bg-raised)", color: i <= step ? "#fff" : "var(--text-muted)", border: "2px solid", borderColor: i <= step ? "transparent" : "var(--border-color)" }}>{i < step ? "✓" : i + 1}</span>
              <span style={{ fontSize: ".6rem", fontWeight: 700, textTransform: "uppercase", color: i <= step ? "var(--burdeos)" : "var(--text-muted)" }}>{p.label}</span>
            </button>
          ))}
        </div>

        <div className="vintage-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "1.5rem", alignItems: "start" }}>
          {/* Pasos */}
          <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-2xl)", boxShadow: "var(--shadow-md)", padding: "1.75rem" }}>
            <h2 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.8rem", marginBottom: 4 }}>{cur.title}</h2>
            {cur.desc && <p style={{ color: "var(--text-soft)", fontSize: ".9rem", marginBottom: "1rem" }}>{cur.desc}</p>}
            {cur.content}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
              <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
                style={{ padding: "10px 20px", borderRadius: "var(--r-pill)", border: "1.5px solid var(--border-strong)", background: "#fff", color: "var(--burdeos)", fontWeight: 700, cursor: step === 0 ? "not-allowed" : "pointer", opacity: step === 0 ? .5 : 1 }}>← Atrás</button>
              {step < pasos.length - 1
                ? <button onClick={() => setStep((s) => s + 1)} style={{ padding: "10px 24px", borderRadius: "var(--r-pill)", border: "none", background: "var(--burdeos)", color: "#fff", fontWeight: 800, cursor: "pointer" }}>Siguiente →</button>
                : <button onClick={finalizar} disabled={creando} style={{ padding: "10px 24px", borderRadius: "var(--r-pill)", border: "none", background: "var(--rosa)", color: "#fff", fontWeight: 800, cursor: "pointer", opacity: creando ? .6 : 1 }}>{creando ? "Creando…" : "Continuar al pago"}</button>}
            </div>
          </div>

          {/* Preview + total */}
          <aside style={{ position: "sticky", top: 84, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ borderRadius: "var(--r-2xl)", overflow: "hidden", boxShadow: "var(--shadow-md)", background: color ? `${color.hex}33` : "var(--rosa-4)", aspectRatio: "1/1", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {capas.length === 0
                ? <span style={{ fontSize: "4rem" }}>🎂</span>
                : capas.map((src, i) => <img key={i} src={src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: "8%" }} />)}
            </div>
            <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", boxShadow: "var(--shadow-sm)", padding: "1.25rem" }}>
              <h3 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.3rem", marginBottom: 8 }}>Tu pastel</h3>
              {cotz.items.length === 0 ? (
                <p style={{ color: "var(--text-soft)", fontSize: ".85rem" }}>Elige el tamaño para ver el precio.</p>
              ) : (
                <>
                  {cotz.items.map((it, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", padding: "3px 0", color: "var(--text-soft)" }}>
                      <span style={{ maxWidth: "65%" }}>{it.concepto}</span>
                      <strong style={{ color: "var(--burdeos)" }}>${it.precio.toLocaleString("es-MX")}</strong>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-color)", marginTop: 8, paddingTop: 8, fontSize: "1.1rem", fontWeight: 800, color: "var(--burdeos)" }}>
                    <span>Total</span><span>${cotz.total.toLocaleString("es-MX")}</span>
                  </div>
                  <p style={{ fontSize: ".7rem", color: "var(--text-soft)", marginTop: 6 }}>+ envío si aplica (se calcula al pagar).</p>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>

      {pedido && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(84,0,39,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: "var(--r-2xl)", maxWidth: 420, width: "100%", padding: "1.75rem", boxShadow: "var(--shadow-xl)" }}>
            <h2 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.6rem" }}>¡Casi listo! 🎂</h2>
            <p style={{ color: "var(--text-soft)", fontSize: ".9rem", margin: "6px 0 14px" }}>
              Pedido <strong>{pedido.numeroOrden}</strong>. Elige cómo pagar para apartar tu fecha.
            </p>
            <div style={{ background: "var(--rosa-4)", borderRadius: "var(--r-md)", padding: 12, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, color: "var(--burdeos)" }}><span>Total</span><span>${pedido.total.toLocaleString("es-MX")}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".85rem", color: "var(--text-soft)" }}><span>Anticipo (50%)</span><span>${pedido.anticipo.toLocaleString("es-MX")}</span></div>
            </div>
            <button onClick={() => pagar("anticipo")} disabled={pagando} style={{ width: "100%", padding: 13, borderRadius: "var(--r-pill)", border: "none", background: "var(--burdeos)", color: "#fff", fontWeight: 800, cursor: "pointer", marginBottom: 8 }}>
              {pagando ? "Redirigiendo…" : `Pagar anticipo $${pedido.anticipo.toLocaleString("es-MX")}`}
            </button>
            <button onClick={() => pagar("total")} disabled={pagando} style={{ width: "100%", padding: 13, borderRadius: "var(--r-pill)", border: "1.5px solid var(--burdeos)", background: "#fff", color: "var(--burdeos)", fontWeight: 800, cursor: "pointer" }}>
              Pagar total ${pedido.total.toLocaleString("es-MX")}
            </button>
            <button onClick={() => setPedido(null)} style={{ width: "100%", marginTop: 10, background: "none", border: "none", color: "var(--text-soft)", fontSize: ".8rem", cursor: "pointer" }}>Cancelar</button>
          </div>
        </div>
      )}

      <style jsx>{`@media (max-width: 880px){ .vintage-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

const lbl = { fontSize: ".72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--text-soft)", margin: "1rem 0 .4rem" };
const inputStyle = { width: "100%", border: "1.5px solid var(--border-color)", borderRadius: "var(--r-md)", padding: 10, fontFamily: "var(--font-nunito)" };

function Grid({ options, selected, onSelect, empty }) {
  if (!options || options.length === 0) return <p style={{ color: "var(--text-soft)", fontSize: ".85rem" }}>{empty || "Sin opciones disponibles."}</p>;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 8 }}>
      {options.map((opt) => (
        <button key={opt.id} type="button" onClick={() => onSelect(opt.id)}
          style={{ textAlign: "left", padding: 12, borderRadius: "var(--r-md)", border: "2px solid", borderColor: selected === opt.id ? "var(--rosa)" : "var(--border-color)", background: selected === opt.id ? "var(--rosa-4)" : "#fff", cursor: "pointer", position: "relative" }}>
          <span style={{ fontWeight: 700, color: "var(--burdeos)", display: "block" }}>{opt.label}</span>
          {opt.sub && <span style={{ fontSize: ".75rem", color: "var(--text-soft)", display: "block", marginTop: 2 }}>{opt.sub}</span>}
          {opt.extra && <span style={{ fontSize: ".68rem", color: "var(--rosa)", fontWeight: 700, display: "block", marginTop: 3 }}>{opt.extra}</span>}
          {selected === opt.id && <span style={{ position: "absolute", top: 8, right: 10, color: "var(--rosa)", fontWeight: 800 }}>✓</span>}
        </button>
      ))}
    </div>
  );
}

function Shell({ children }) {
  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)" }}>
      <NavbarAdmin />
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "6rem 1.25rem" }}>{children}</main>
    </div>
  );
}

function Bloqueado({ inline }) {
  const box = (
    <div style={{ background: "#fff", border: "1px solid var(--border-color)", borderLeft: "4px solid var(--rosa)", borderRadius: "var(--r-md)", padding: "1.25rem", marginTop: inline ? 16 : 0 }}>
      <p style={{ color: "var(--burdeos)", fontWeight: 800, fontSize: "1.05rem" }}>Este producto no está disponible para tu ubicación ⚠️</p>
      <p style={{ color: "var(--text-soft)", fontSize: ".9rem", marginTop: 6 }}>Por ahora solo ofrecemos el pastel vintage dentro de Jalisco.</p>
      <Link href="/" style={{ color: "var(--rosa)", fontWeight: 700, marginTop: 10, display: "inline-block" }}>← Volver al inicio</Link>
    </div>
  );
  return inline ? box : <Shell>{box}</Shell>;
}
