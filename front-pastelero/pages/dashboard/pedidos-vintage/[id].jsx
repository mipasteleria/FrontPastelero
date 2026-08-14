import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Swal from "sweetalert2";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import VintagePreview from "@/src/components/vintage/VintagePreview";
import { HORAS_DISPONIBLES } from "@/src/lib/disponibilidad";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { useAuth } from "@/src/context";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const STATUSES = ["Pendiente", "Agendado con el 50%", "Agendado con el 100%", "Entregado", "Cancelado"];
const money = (n) => `$${Number(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const CAT_VACIO = { porciones: [], pisos: [], formas: [], colores: [], decoraciones: [], sabores: [], rellenos: [], coberturas: [] };

export default function PedidoVintageDetalle() {
  const router = useRouter();
  const { id } = router.query;
  const { userToken } = useAuth();
  const [cot, setCot] = useState(null);
  const [cat, setCat] = useState(CAT_VACIO);
  const [form, setForm] = useState({ status: "", anticipo: "", anticipoMetodo: "", anticipoReferencia: "" });
  const [nota, setNota] = useState("");
  const [editando, setEditando] = useState(false);
  const [edit, setEdit] = useState(null);   // borrador de la configuración
  const [guardandoCfg, setGuardandoCfg] = useState(false);
  const authHeader = userToken ? { Authorization: `Bearer ${userToken}` } : {};

  const recargar = async () => {
    if (!id) return;
    const r = await fetch(`${API_BASE}/vintage-pedidos/${id}`, { headers: authHeader });
    const j = await r.json();
    setCot(j.data);
    setForm({ status: j.data?.status || "Pendiente", anticipo: j.data?.anticipo ?? "", anticipoMetodo: j.data?.anticipoMetodo || "", anticipoReferencia: j.data?.anticipoReferencia || "" });
  };
  useEffect(() => { recargar(); /* eslint-disable-line */ }, [id, userToken]);

  // Catálogos: se usan tanto para la imagen como para mostrar nombres
  // legibles (antes se veían los slugs) y para el editor.
  useEffect(() => {
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
  }, []);

  const guardar = async () => {
    const r = await fetch(`${API_BASE}/vintage-pedidos/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({ status: form.status, anticipo: form.anticipo === "" ? undefined : Number(form.anticipo), anticipoMetodo: form.anticipoMetodo, anticipoReferencia: form.anticipoReferencia }),
    });
    if (r.ok) { Swal.fire({ icon: "success", title: "Actualizado", timer: 1300, showConfirmButton: false, background: "#fff1f2", color: "#540027" }); recargar(); }
  };

  const agregarNota = async () => {
    if (!nota.trim()) return;
    const r = await fetch(`${API_BASE}/vintage-pedidos/${id}/notas-internas`, { method: "POST", headers: { "Content-Type": "application/json", ...authHeader }, body: JSON.stringify({ texto: nota }) });
    if (r.ok) { setNota(""); recargar(); }
  };

  // ── Liquidar saldo (pago recibido fuera de línea) ──────────────
  const liquidarSaldo = async () => {
    const { value: vals, isDismissed } = await Swal.fire({
      title: "Registrar pago del saldo",
      html: `
        <select id="sw-metodo" class="swal2-input" style="width:80%">
          <option value="transferencia">Transferencia</option>
          <option value="efectivo">Efectivo</option>
          <option value="otro">Otro</option>
        </select>
        <input id="sw-ref" class="swal2-input" style="width:80%" placeholder="Referencia / nota (opcional)">`,
      showCancelButton: true, confirmButtonColor: "#540027", confirmButtonText: "Registrar",
      preConfirm: () => ({
        metodo: document.getElementById("sw-metodo").value,
        referencia: document.getElementById("sw-ref").value,
      }),
    });
    if (isDismissed || !vals) return;
    try {
      const r = await fetch(`${API_BASE}/vintage-pedidos/${id}/liquidar-saldo`, {
        method: "PUT", headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify(vals),
      });
      if (!r.ok) throw new Error((await r.json()).message || "Error");
      Swal.fire({ icon: "success", title: "Saldo liquidado ✓", timer: 1600, showConfirmButton: false, background: "#fff1f2", color: "#540027" });
      recargar();
    } catch (e) {
      Swal.fire({ icon: "error", title: e.message });
    }
  };

  // ── Enlace público para el cliente ─────────────────────────────
  const copiarEnlace = async () => {
    try {
      const r = await fetch(`${API_BASE}/vintage-pedidos/${id}/enlace-publico`, { method: "POST", headers: authHeader });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Error");
      const url = `${window.location.origin}/vintage/ver/${j.data.publicToken}`;
      try { await navigator.clipboard.writeText(url); } catch {}
      Swal.fire({
        icon: "success", title: "Enlace listo",
        html: `Se copió al portapapeles:<br/><code style="font-size:.75rem;word-break:break-all">${url}</code>
               <br/><br/><a href="https://wa.me/?text=${encodeURIComponent(`Hola ${cot.cliente?.nombre || ""}, aquí puedes ver tu pedido y pagar el saldo: ${url}`)}" target="_blank" style="color:#25D366;font-weight:700">Enviar por WhatsApp →</a>`,
        confirmButtonColor: "#540027",
      });
    } catch (e) {
      Swal.fire({ icon: "error", title: e.message });
    }
  };

  // ── Edición de la configuración ────────────────────────────────
  const abrirEditor = () => {
    setEdit({
      seleccion: { ...(cot.seleccion || {}), decoraciones: [...(cot.seleccion?.decoraciones || [])] },
      envio: { ...(cot.envio || {}) },
      fecha: cot.fecha ? new Date(cot.fecha).toISOString().slice(0, 10) : "",
      notas: cot.notas || "",
    });
    setEditando(true);
  };

  const setSel = (patch) => setEdit((e) => ({ ...e, seleccion: { ...e.seleccion, ...patch } }));
  const setEnvio = (patch) => setEdit((e) => ({ ...e, envio: { ...e.envio, ...patch } }));

  const toggleDeco = (d) => {
    setEdit((e) => {
      const actuales = e.seleccion.decoraciones || [];
      const existe = actuales.find((x) => x.slug === d.slug);
      if (existe) return { ...e, seleccion: { ...e.seleccion, decoraciones: actuales.filter((x) => x.slug !== d.slug) } };
      const primera = d.colores?.[0];
      return { ...e, seleccion: { ...e.seleccion, decoraciones: [...actuales, { slug: d.slug, nombre: d.nombre, colorNombre: primera?.nombre || "", imagenUrl: primera?.imagenUrl || "" }] } };
    });
  };

  const setColorDeco = (slug, c) =>
    setEdit((e) => ({
      ...e,
      seleccion: {
        ...e.seleccion,
        decoraciones: e.seleccion.decoraciones.map((x) => x.slug === slug ? { ...x, colorNombre: c.nombre, imagenUrl: c.imagenUrl } : x),
      },
    }));

  const guardarConfiguracion = async () => {
    setGuardandoCfg(true);
    try {
      const r = await fetch(`${API_BASE}/vintage-pedidos/${id}/configuracion`, {
        method: "PUT", headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify(edit),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "No se pudo guardar");
      Swal.fire({ icon: "success", title: "Pedido actualizado", text: "El precio se recalculó con la nueva configuración.", timer: 2000, showConfirmButton: false, background: "#fff1f2", color: "#540027" });
      setEditando(false);
      recargar();
    } catch (e) {
      Swal.fire({ icon: "error", title: e.message });
    } finally {
      setGuardandoCfg(false);
    }
  };

  if (!cot) return <div className={poppins.className}><NavbarAdmin /><div className="flex mt-16"><Asideadmin /><main className="p-8">Cargando…</main></div></div>;

  const s = cot.seleccion || {};
  const gananciaTotal = (cot.totalProductos || 0) - (cot.totalCosto || 0);

  // Nombres legibles a partir de los slugs guardados.
  const nombreDe = (lista, slug, campo = "nombre") => lista.find((x) => x.slug === slug)?.[campo] || slug || "—";
  const porcionSel = cat.porciones.find((p) => p.slug === s.porcionSlug);
  const pisosDisponibles = cat.pisos.filter((p) => p.niveles <= (porcionSel?.pisosMax || 1)).sort((a, b) => a.niveles - b.niveles);
  const selVista = editando && edit ? edit.seleccion : s;

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 md:px-8 pb-24 md:pb-8">
          <Link href="/dashboard/pedidos-vintage" className="text-xs text-accent hover:underline">← Volver</Link>
          <h1 className={`text-3xl py-3 ${sofia.className}`}>{cot.numeroOrden} — {cot.cliente?.nombre}</h1>

          <div className="grid md:grid-cols-3 gap-4">
            <section className="md:col-span-2 space-y-4">
              {/* ── Pastel que armó el cliente ── */}
              <div className="bg-white shadow rounded-lg p-5">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <h2 className="font-bold text-lg" style={{ color: "var(--burdeos)" }}>Pastel solicitado</h2>
                  {!editando ? (
                    <button onClick={abrirEditor} className="px-3 py-1.5 rounded text-xs font-semibold text-white" style={{ background: "var(--accent, #6FC9A8)" }}>
                      ✏️ Editar solicitud
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setEditando(false)} className="px-3 py-1.5 rounded text-xs font-semibold border">Cancelar</button>
                      <button onClick={guardarConfiguracion} disabled={guardandoCfg} className="px-3 py-1.5 rounded text-xs font-semibold text-white disabled:opacity-50" style={{ background: "var(--burdeos)" }}>
                        {guardandoCfg ? "Guardando…" : "Guardar y recalcular"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Imagen generada con la elección del cliente */}
                  <div>
                    <VintagePreview seleccion={selVista} cat={cat} vacio="Aún no hay imágenes cargadas para esta combinación." />
                    <p className="text-[11px] text-gray-400 mt-1 text-center">Vista generada con la selección del cliente</p>
                  </div>

                  {/* Configuración */}
                  <div>
                    {!editando ? (
                      <>
                        <Info k="Porciones" v={s.porciones || porcionSel?.porciones} />
                        <Info k="Tamaño" v={nombreDe(cat.porciones, s.porcionSlug)} />
                        <Info k="Pisos" v={nombreDe(cat.pisos, s.pisosSlug)} />
                        <Info k="Forma" v={nombreDe(cat.formas, s.formaSlug)} />
                        <Info k="Sabor" v={nombreDe(cat.sabores, s.saborSlug)} />
                        <Info k="Relleno" v={nombreDe(cat.rellenos, s.rellenoSlug)} />
                        <Info k="Cobertura" v={nombreDe(cat.coberturas, s.coberturaSlug)} />
                        <Info k="Color" v={nombreDe(cat.colores, s.colorSlug)} />
                        <Info k="Decoraciones" v={(s.decoraciones || []).map((d) => `${d.nombre || d.slug}${d.colorNombre ? ` (${d.colorNombre})` : ""}`).join(", ") || "—"} />
                        {cot.notas && <Info k="Notas del cliente" v={cot.notas} />}
                      </>
                    ) : (
                      <div className="space-y-2 text-sm">
                        <Sel label="Tamaño" value={edit.seleccion.porcionSlug} onChange={(v) => setSel({ porcionSlug: v })} options={cat.porciones} />
                        <Sel label="Pisos" value={edit.seleccion.pisosSlug} onChange={(v) => setSel({ pisosSlug: v })} options={pisosDisponibles} />
                        <Sel label="Forma" value={edit.seleccion.formaSlug} onChange={(v) => setSel({ formaSlug: v })} options={cat.formas} />
                        <Sel label="Sabor" value={edit.seleccion.saborSlug} onChange={(v) => setSel({ saborSlug: v })} options={cat.sabores} />
                        <Sel label="Relleno" value={edit.seleccion.rellenoSlug} onChange={(v) => setSel({ rellenoSlug: v })} options={cat.rellenos} />
                        <Sel label="Cobertura" value={edit.seleccion.coberturaSlug} onChange={(v) => setSel({ coberturaSlug: v })} options={cat.coberturas} />
                        <Sel label="Color" value={edit.seleccion.colorSlug} onChange={(v) => setSel({ colorSlug: v })} options={cat.colores} />

                        <div>
                          <label className="block text-xs font-semibold mb-1 text-gray-600">Decoraciones</label>
                          <div className="space-y-1.5 max-h-44 overflow-y-auto border rounded p-2">
                            {cat.decoraciones.map((d) => {
                              const elegida = (edit.seleccion.decoraciones || []).find((x) => x.slug === d.slug);
                              return (
                                <div key={d.slug}>
                                  <label className="flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--burdeos)" }}>
                                    <input type="checkbox" checked={!!elegida} onChange={() => toggleDeco(d)} />
                                    {d.nombre}
                                  </label>
                                  {elegida && (d.colores || []).length > 0 && (
                                    <div className="flex gap-1.5 mt-1 ml-5 flex-wrap">
                                      {d.colores.map((c) => (
                                        <button key={c.nombre} type="button" title={c.nombre} onClick={() => setColorDeco(d.slug, c)}
                                          style={{
                                            width: 22, height: 22, borderRadius: "50%", background: c.hex, cursor: "pointer",
                                            border: elegida.colorNombre === c.nombre ? "2.5px solid var(--burdeos)" : "1px solid #ddd",
                                          }} />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold mb-1 text-gray-600">Notas del cliente</label>
                          <textarea rows={2} className="border rounded px-3 py-2 w-full text-sm" value={edit.notas} onChange={(e) => setEdit({ ...edit, notas: e.target.value })} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Desglose ── */}
              <div className="bg-white shadow rounded-lg p-5">
                <h2 className="font-bold text-lg mb-3" style={{ color: "var(--burdeos)" }}>Desglose (costo / precio / ganancia)</h2>
                <table className="w-full text-sm">
                  <thead><tr className="text-xs uppercase text-gray-400 border-b"><th className="text-left py-1">Concepto</th><th className="text-right">Costo</th><th className="text-right">Margen</th><th className="text-right">Precio</th></tr></thead>
                  <tbody>
                    {(cot.desglose || []).map((d, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="py-1.5">{d.concepto}</td>
                        <td className="text-right text-gray-500">{money(d.costo)}</td>
                        <td className="text-right text-gray-500">{d.margen}%</td>
                        <td className="text-right font-semibold">{money(d.precio)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2"><td className="py-1.5 font-bold">Productos</td><td className="text-right">{money(cot.totalCosto)}</td><td></td><td className="text-right font-bold">{money(cot.totalProductos)}</td></tr>
                    {cot.envio?.costo > 0 && <tr><td className="py-1">Envío ({cot.envio.zona})</td><td></td><td></td><td className="text-right">{money(cot.envio.costo)}</td></tr>}
                    <tr><td className="py-1 font-bold" style={{ color: "var(--burdeos)" }}>Total</td><td></td><td></td><td className="text-right font-bold" style={{ color: "var(--burdeos)" }}>{money(cot.total)}</td></tr>
                    <tr><td className="py-1 text-green-700 font-semibold">Ganancia (productos)</td><td></td><td></td><td className="text-right text-green-700 font-semibold">{money(gananciaTotal)}</td></tr>
                  </tfoot>
                </table>
              </div>

              {/* ── Entrega y cliente ── */}
              <div className="bg-white shadow rounded-lg p-5">
                <h3 className="font-bold text-md mb-2" style={{ color: "var(--burdeos)" }}>Entrega y cliente</h3>
                {!editando ? (
                  <>
                    <Info k="Entrega" v={cot.envio?.tipo === "domicilio" ? `Domicilio · ${cot.envio?.municipio} · ${cot.envio?.colonia} · ${cot.envio?.direccion}` : "Recoger en local"} />
                    <Info k="Fecha" v={cot.fecha ? new Date(cot.fecha).toLocaleDateString("es-MX", { timeZone: "UTC" }) : "—"} />
                    <Info k="Hora" v={cot.envio?.hora || "Por confirmar"} />
                    <Info k="Teléfono" v={cot.cliente?.telefono} />
                    <Info k="Email" v={cot.cliente?.email || "—"} />
                  </>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-600">Tipo de entrega</label>
                      <select className="border rounded px-3 py-2 w-full" value={edit.envio.tipo || "recoger-local"} onChange={(e) => setEnvio({ tipo: e.target.value })}>
                        <option value="recoger-local">Recoger en local</option>
                        <option value="domicilio">A domicilio</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-600">Hora de entrega</label>
                      <select className="border rounded px-3 py-2 w-full" value={edit.envio.hora || ""} onChange={(e) => setEnvio({ hora: e.target.value })}>
                        <option value="">Por confirmar</option>
                        {HORAS_DISPONIBLES.map((h) => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-600">Fecha</label>
                      <input type="date" className="border rounded px-3 py-2 w-full" value={edit.fecha} onChange={(e) => setEdit({ ...edit, fecha: e.target.value })} />
                    </div>
                    {edit.envio.tipo === "domicilio" && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-gray-600">Municipio</label>
                          <input className="border rounded px-3 py-2 w-full" value={edit.envio.municipio || ""} onChange={(e) => setEnvio({ municipio: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-gray-600">Colonia</label>
                          <input className="border rounded px-3 py-2 w-full" value={edit.envio.colonia || ""} onChange={(e) => setEnvio({ colonia: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-gray-600">Dirección</label>
                          <input className="border rounded px-3 py-2 w-full" value={edit.envio.direccion || ""} onChange={(e) => setEnvio({ direccion: e.target.value })} />
                        </div>
                      </>
                    )}
                    <p className="sm:col-span-2 text-[11px] text-gray-500">
                      Al guardar se recalculan el desglose, el envío por zona y el saldo pendiente. El anticipo ya registrado no se toca.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-4">
              <div className="bg-white shadow rounded-lg p-5">
                <h3 className="font-bold mb-3" style={{ color: "var(--burdeos)" }}>Acciones</h3>
                <label className="block text-xs font-semibold mb-1">Status</label>
                <select className="border rounded px-3 py-2 w-full mb-3" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{STATUSES.map((x) => <option key={x}>{x}</option>)}</select>
                <label className="block text-xs font-semibold mb-1">Anticipo recibido</label>
                <input type="number" className="border rounded px-3 py-2 w-full mb-2" value={form.anticipo} onChange={(e) => setForm({ ...form, anticipo: e.target.value })} />
                <label className="block text-xs font-semibold mb-1">Método</label>
                <select className="border rounded px-3 py-2 w-full mb-2" value={form.anticipoMetodo} onChange={(e) => setForm({ ...form, anticipoMetodo: e.target.value })}>
                  <option value="">—</option><option value="transferencia">Transferencia</option><option value="efectivo">Efectivo</option><option value="stripe">Pago en línea</option><option value="otro">Otro</option>
                </select>
                <label className="block text-xs font-semibold mb-1">Referencia</label>
                <input className="border rounded px-3 py-2 w-full mb-3" value={form.anticipoReferencia} onChange={(e) => setForm({ ...form, anticipoReferencia: e.target.value })} />
                <button onClick={guardar} className="px-4 py-2 rounded text-sm font-semibold text-white w-full" style={{ background: "var(--burdeos)" }}>Guardar</button>
                {cot.saldoPendiente > 0 ? (
                  <>
                    <p className="text-[11px] mt-3 mb-1" style={{ color: "#B23A48" }}>
                      Saldo pendiente: <strong>{money(cot.saldoPendiente)}</strong>
                    </p>
                    <button onClick={liquidarSaldo} className="px-3 py-2 rounded text-xs font-semibold text-white w-full"
                      style={{ background: "var(--menta-deep, #2e9e76)" }}
                      title="Registrar que el cliente ya pagó el saldo (transferencia o efectivo)">
                      ✓ Liquidar saldo
                    </button>
                  </>
                ) : (
                  <p className="text-[11px] mt-3" style={{ color: "#1D5A45" }}>✓ Sin saldo pendiente — pedido pagado.</p>
                )}

                <button onClick={copiarEnlace} className="mt-2 px-3 py-2 rounded text-xs font-semibold w-full border"
                  style={{ borderColor: "var(--burdeos)", color: "var(--burdeos)" }}
                  title="Enlace donde el cliente ve su pedido y puede pagar el saldo en línea">
                  🔗 Enlace para el cliente
                </button>
              </div>

              <div className="bg-white shadow rounded-lg p-5">
                <h3 className="font-bold mb-3" style={{ color: "var(--burdeos)" }}>Notas internas</h3>
                <div className="space-y-2 mb-3 max-h-60 overflow-y-auto">
                  {(cot.notasInternas || []).length === 0 ? <p className="text-xs text-gray-400 italic">Sin notas</p> :
                    cot.notasInternas.map((n) => <div key={n._id} className="bg-gray-50 p-2 rounded text-xs"><p>{n.texto}</p><div className="text-[10px] text-gray-400 mt-1">{n.autorNombre || "Admin"} · {new Date(n.fecha).toLocaleDateString("es-MX")}</div></div>)}
                </div>
                <textarea rows={2} className="border rounded px-3 py-2 w-full text-sm mb-2" value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Nueva nota…" />
                <button onClick={agregarNota} disabled={!nota.trim()} className="px-3 py-1.5 rounded text-xs font-semibold text-white w-full disabled:opacity-50" style={{ background: "var(--accent, #6FC9A8)" }}>Agregar nota</button>
              </div>
            </section>
          </div>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}

function Info({ k, v }) {
  return <div className="flex justify-between text-sm py-1.5 border-b border-gray-100"><span className="text-gray-500">{k}</span><span className="font-semibold text-right max-w-[60%]">{v ?? "—"}</span></div>;
}

/** Select de catálogo por slug. */
function Sel({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1 text-gray-600">{label}</label>
      <select className="border rounded px-3 py-2 w-full" value={value || ""} onChange={(e) => onChange(e.target.value)}>
        <option value="">—</option>
        {options.map((o) => <option key={o.slug} value={o.slug}>{o.nombre}</option>)}
      </select>
    </div>
  );
}
