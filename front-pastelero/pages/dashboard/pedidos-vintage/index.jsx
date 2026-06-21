import { useEffect, useMemo, useState } from "react";
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

const COLOR = { "Pendiente": "#E8B43A", "Agendado": "#6FC9A8", "Entregado": "#6FA8C9", "Cancelado": "#FF6F7D" };
const fU = (d) => d ? new Date(d).toLocaleDateString("es-MX", { timeZone: "UTC" }) : "—";

export default function PedidosVintageList() {
  const { userToken } = useAuth();
  const [docs, setDocs] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [q, setQ] = useState("");
  const [fStatus, setFStatus] = useState("");
  const authHeader = userToken ? { Authorization: `Bearer ${userToken}` } : {};

  useEffect(() => {
    if (!userToken) return;
    fetch(`${API_BASE}/vintage-pedidos`, { headers: authHeader })
      .then((r) => r.json()).then((j) => setDocs(j.data || [])).catch(console.error).finally(() => setCargando(false));
    // eslint-disable-next-line
  }, [userToken]);

  const filtrados = useMemo(() => docs.filter((c) => {
    const t = q.trim().toLowerCase();
    if (t && !(c.cliente?.nombre || "").toLowerCase().includes(t) && !(c.numeroOrden || "").toLowerCase().includes(t)) return false;
    if (fStatus && c.status !== fStatus) return false;
    return true;
  }), [docs, q, fStatus]);

  const eliminar = async (c) => {
    const ok = await Swal.fire({ title: "¿Eliminar pedido?", html: `${c.numeroOrden} — ${c.cliente?.nombre}`, icon: "warning", showCancelButton: true, confirmButtonColor: "#FF6F7D", confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar", background: "#fff1f2", color: "#540027" });
    if (!ok.isConfirmed) return;
    const r = await fetch(`${API_BASE}/vintage-pedidos/${c._id}`, { method: "DELETE", headers: authHeader });
    if (r.ok) setDocs((p) => p.filter((x) => x._id !== c._id));
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 md:px-8 pb-24 md:pb-8">
          <h1 className={`text-4xl py-4 ${sofia.className}`}>Pedidos Pastel Vintage</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <input className="border rounded px-3 py-2 text-sm flex-grow min-w-[200px]" placeholder="Buscar por nombre o # orden…" value={q} onChange={(e) => setQ(e.target.value)} />
            <select className="border rounded px-3 py-2 text-sm" value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
              <option value="">Todos los status</option>
              {["Pendiente", "Agendado con el 50%", "Agendado con el 100%", "Entregado", "Cancelado"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          {cargando ? <p className="text-gray-400">Cargando…</p> : filtrados.length === 0 ? (
            <div className="bg-white shadow rounded p-8 text-center text-gray-400">Sin pedidos.</div>
          ) : (
            <div className="shadow-md rounded-lg overflow-x-auto bg-white">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase border-b border-secondary">
                  <tr><th className="px-4 py-3"># Orden</th><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Entrega</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Acciones</th></tr>
                </thead>
                <tbody>
                  {filtrados.map((c) => {
                    const key = (c.status || "").startsWith("Agendado") ? "Agendado" : c.status;
                    return (
                      <tr key={c._id} className="border-b border-secondary">
                        <td className="px-4 py-3 font-mono text-xs">{c.numeroOrden || "—"}</td>
                        <td className="px-4 py-3 font-medium"><div>{c.cliente?.nombre}</div><div className="text-xs text-gray-400">{c.cliente?.telefono}</div></td>
                        <td className="px-4 py-3">{fU(c.fecha)}</td>
                        <td className="px-4 py-3 font-semibold">${Number(c.total || 0).toLocaleString("es-MX")}</td>
                        <td className="px-4 py-3"><span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: (COLOR[key] || "#999") + "22", color: COLOR[key] || "#666" }}>{c.status}</span></td>
                        <td className="px-4 py-3"><div className="flex gap-3"><Link href={`/dashboard/pedidos-vintage/${c._id}`} className="text-accent hover:underline text-xs font-semibold">Ver</Link><button onClick={() => eliminar(c)} className="text-red-500 text-xs font-semibold">Eliminar</button></div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}
