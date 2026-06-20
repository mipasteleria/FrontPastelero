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

const STATUS_COLORS = {
  "Pendiente": "#E8B43A",
  "Cotizada": "#C77DA0",
  "Agendado": "#6FC9A8",
  "Entregado": "#6FA8C9",
  "Cancelado": "#FF6F7D",
};

const STATUS_OPCIONES = [
  "Pendiente", "Cotizada", "Agendado · revisión", "Agendado · producción", "Entregado", "Cancelado",
];

const fmtFechaUTC = (d) => d ? new Date(d).toLocaleDateString("es-MX", { timeZone: "UTC" }) : "—";
const aISO = (d) => d ? new Date(d).toISOString().slice(0, 10) : "";

export default function CotizacionesPersonalizadasList() {
  const { userToken } = useAuth();
  const [docs, setDocs] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [q, setQ] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fFecha, setFFecha] = useState("");

  const authHeader = userToken ? { Authorization: `Bearer ${userToken}` } : {};

  useEffect(() => {
    if (!userToken) return;
    fetch(`${API_BASE}/cotizacion-personalizada`, { headers: authHeader })
      .then((r) => r.json())
      .then((j) => setDocs(j.data || []))
      .catch(console.error)
      .finally(() => setCargando(false));
    // eslint-disable-next-line
  }, [userToken]);

  const filtrados = useMemo(() => {
    const texto = q.trim().toLowerCase();
    return docs.filter((c) => {
      if (texto) {
        const enNombre = (c.cliente?.nombre || "").toLowerCase().includes(texto);
        const enOrden = (c.numeroOrden || "").toLowerCase().includes(texto);
        if (!enNombre && !enOrden) return false;
      }
      if (fStatus && c.status !== fStatus) return false;
      if (fFecha && aISO(c.evento?.fecha) !== fFecha) return false;
      return true;
    });
  }, [docs, q, fStatus, fFecha]);

  const eliminar = async (c) => {
    const ok = await Swal.fire({
      title: "¿Eliminar cotización?",
      html: `Se eliminará <strong>${c.numeroOrden || ""}</strong> de ${c.cliente?.nombre || "—"}. Esta acción no se puede deshacer.`,
      icon: "warning", showCancelButton: true, confirmButtonColor: "#FF6F7D", cancelButtonColor: "#D6A7BC",
      confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar", background: "#fff1f2", color: "#540027",
    });
    if (!ok.isConfirmed) return;
    try {
      const r = await fetch(`${API_BASE}/cotizacion-personalizada/${c._id}`, { method: "DELETE", headers: authHeader });
      if (!r.ok) throw new Error((await r.json()).message || "Error");
      setDocs((prev) => prev.filter((x) => x._id !== c._id));
      Swal.fire({ icon: "success", title: "Eliminada", timer: 1400, showConfirmButton: false, background: "#fff1f2", color: "#540027" });
    } catch (e) {
      Swal.fire({ icon: "error", title: e.message, timer: 2200, showConfirmButton: false });
    }
  };

  const inputCls = "border rounded px-3 py-2 text-sm";

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 md:px-8 pb-24 md:pb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
            <h1 className={`text-4xl ${sofia.className}`}>Cotizaciones</h1>
            <Link href="/cotizacion" className="px-4 py-2 rounded text-sm font-semibold text-white shadow-md" style={{ background: "var(--burdeos)" }}>
              + Nueva cotización manual
            </Link>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mb-4">
            <input className={`${inputCls} flex-grow min-w-[200px]`} placeholder="Buscar por nombre o número de orden…" value={q} onChange={(e) => setQ(e.target.value)} />
            <select className={inputCls} value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
              <option value="">Todos los status</option>
              {STATUS_OPCIONES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="date" className={inputCls} value={fFecha} onChange={(e) => setFFecha(e.target.value)} title="Filtrar por fecha de evento" />
            {(q || fStatus || fFecha) && (
              <button onClick={() => { setQ(""); setFStatus(""); setFFecha(""); }} className="text-sm text-accent hover:underline px-2">Limpiar</button>
            )}
          </div>

          {cargando ? (
            <p className="text-gray-400 mt-4">Cargando…</p>
          ) : filtrados.length === 0 ? (
            <div className="bg-white shadow rounded p-8 text-center text-gray-400">
              {docs.length === 0 ? "Aún no hay cotizaciones." : "Ninguna cotización coincide con los filtros."}
            </div>
          ) : (
            <div className="shadow-md rounded-lg overflow-x-auto" style={{ background: "#fff" }}>
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase border-b border-secondary">
                  <tr>
                    <th className="px-4 py-3"># Orden</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Evento</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Recibida</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((c) => {
                    const statusKey = (c.status || "").startsWith("Agendado") ? "Agendado" : c.status;
                    return (
                      <tr key={c._id} className="border-b border-secondary">
                        <td className="px-4 py-3 font-mono text-xs">{c.numeroOrden || "—"}</td>
                        <td className="px-4 py-3 font-medium">
                          <div>{c.cliente?.nombre || "—"}</div>
                          <div className="text-xs text-gray-400">{c.cliente?.telefono}</div>
                        </td>
                        <td className="px-4 py-3 capitalize">{c.evento?.tipo || "—"}</td>
                        <td className="px-4 py-3">{fmtFechaUTC(c.evento?.fecha)}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: (STATUS_COLORS[statusKey] || "#999") + "22", color: STATUS_COLORS[statusKey] || "#666" }}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString("es-MX")}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-3 items-center">
                            <Link href={`/dashboard/cotizaciones-personalizadas/${c._id}`} className="text-accent hover:underline text-xs font-semibold">Ver</Link>
                            <button onClick={() => eliminar(c)} className="text-red-500 hover:text-red-700 text-xs font-semibold">Eliminar</button>
                          </div>
                        </td>
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
