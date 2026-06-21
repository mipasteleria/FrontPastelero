import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Swal from "sweetalert2";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { useAuth } from "@/src/context";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const STATUSES = ["Pendiente", "Agendado con el 50%", "Agendado con el 100%", "Entregado", "Cancelado"];
const money = (n) => `$${Number(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function PedidoVintageDetalle() {
  const router = useRouter();
  const { id } = router.query;
  const { userToken } = useAuth();
  const [cot, setCot] = useState(null);
  const [form, setForm] = useState({ status: "", anticipo: "", anticipoMetodo: "", anticipoReferencia: "" });
  const [nota, setNota] = useState("");
  const authHeader = userToken ? { Authorization: `Bearer ${userToken}` } : {};

  const recargar = async () => {
    if (!id) return;
    const r = await fetch(`${API_BASE}/vintage-pedidos/${id}`, { headers: authHeader });
    const j = await r.json();
    setCot(j.data);
    setForm({ status: j.data?.status || "Pendiente", anticipo: j.data?.anticipo ?? "", anticipoMetodo: j.data?.anticipoMetodo || "", anticipoReferencia: j.data?.anticipoReferencia || "" });
  };
  useEffect(() => { recargar(); /* eslint-disable-line */ }, [id, userToken]);

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

  if (!cot) return <div className={poppins.className}><NavbarAdmin /><div className="flex mt-16"><Asideadmin /><main className="p-8">Cargando…</main></div></div>;

  const s = cot.seleccion || {};
  const gananciaTotal = (cot.totalProductos || 0) - (cot.totalCosto || 0);

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 md:px-8 pb-24 md:pb-8">
          <Link href="/dashboard/pedidos-vintage" className="text-xs text-accent hover:underline">← Volver</Link>
          <h1 className={`text-3xl py-3 ${sofia.className}`}>{cot.numeroOrden} — {cot.cliente?.nombre}</h1>

          <div className="grid md:grid-cols-3 gap-4">
            <section className="md:col-span-2 bg-white shadow rounded-lg p-5">
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

              <h3 className="font-bold text-md mt-5 mb-2" style={{ color: "var(--burdeos)" }}>Configuración</h3>
              <Info k="Porciones" v={s.porciones} /><Info k="Pisos" v={s.pisosSlug || "1"} /><Info k="Forma" v={s.formaSlug || "—"} />
              <Info k="Sabor" v={s.saborSlug || "—"} /><Info k="Relleno" v={s.rellenoSlug || "—"} /><Info k="Cobertura" v={s.coberturaSlug || "—"} />
              <Info k="Color" v={s.colorSlug || "—"} />
              <Info k="Decoraciones" v={(s.decoraciones || []).map((d) => `${d.nombre || d.slug}${d.colorNombre ? ` (${d.colorNombre})` : ""}`).join(", ") || "—"} />
              {cot.notas && <Info k="Notas del cliente" v={cot.notas} />}

              <h3 className="font-bold text-md mt-5 mb-2" style={{ color: "var(--burdeos)" }}>Entrega y cliente</h3>
              <Info k="Entrega" v={cot.envio?.tipo === "domicilio" ? `Domicilio · ${cot.envio?.municipio} · ${cot.envio?.colonia} · ${cot.envio?.direccion}` : "Recoger en local"} />
              <Info k="Fecha" v={cot.fecha ? new Date(cot.fecha).toLocaleDateString("es-MX", { timeZone: "UTC" }) : "—"} />
              <Info k="Teléfono" v={cot.cliente?.telefono} /><Info k="Email" v={cot.cliente?.email || "—"} />
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
