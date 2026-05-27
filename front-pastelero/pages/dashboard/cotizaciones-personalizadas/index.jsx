import { useEffect, useState } from "react";
import Link from "next/link";
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
  "Agendado": "#6FC9A8",
  "Cancelado": "#FF6F7D",
};

/**
 * /dashboard/cotizaciones-personalizadas — listado admin de las
 * cotizaciones del flujo rediseñado (modelo CotizacionPersonalizada).
 *
 * NOTA: este es el flujo nuevo. Las viejas (pastelCotiza/cupcake/snack)
 * siguen en /dashboard/cotizaciones.
 */
export default function CotizacionesPersonalizadasList() {
  const { userToken } = useAuth();
  const [docs, setDocs] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!userToken) return;
    fetch(`${API_BASE}/cotizacion-personalizada`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
      .then((r) => r.json())
      .then((j) => setDocs(j.data || []))
      .catch(console.error)
      .finally(() => setCargando(false));
  }, [userToken]);

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 md:px-8 pb-24 md:pb-8">
          <h1 className={`text-4xl py-4 ${sofia.className}`}>Cotizaciones personalizadas</h1>
          <p className="text-sm text-gray-500 -mt-2 mb-4">
            Solicitudes del flujo rediseñado de <code className="px-1 bg-gray-100 rounded">/cotizacion</code>.
            Las viejas (pastel/cupcake/snack) están en{" "}
            <Link href="/dashboard/cotizaciones" className="text-accent hover:underline">/dashboard/cotizaciones</Link>.
          </p>

          {cargando ? (
            <p className="text-gray-400 mt-4">Cargando…</p>
          ) : docs.length === 0 ? (
            <div className="bg-white shadow rounded p-8 text-center text-gray-400">
              Aún no hay cotizaciones del nuevo flujo.
            </div>
          ) : (
            <div className="shadow-md rounded-lg overflow-x-auto" style={{ background: "#fff" }}>
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase border-b border-secondary">
                  <tr>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Evento</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Inv.</th>
                    <th className="px-4 py-3">Niveles</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Recibida</th>
                    <th className="px-4 py-3">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((c) => {
                    const statusKey = (c.status || "").startsWith("Agendado")
                      ? "Agendado"
                      : c.status;
                    return (
                      <tr key={c._id} className="border-b border-secondary">
                        <td className="px-4 py-3 font-medium">
                          <div>{c.cliente?.nombre || "—"}</div>
                          <div className="text-xs text-gray-400">{c.cliente?.telefono}</div>
                        </td>
                        <td className="px-4 py-3 capitalize">{c.evento?.tipo || "—"}</td>
                        <td className="px-4 py-3">
                          {c.evento?.fecha ? new Date(c.evento.fecha).toLocaleDateString("es-MX") : "—"}
                        </td>
                        <td className="px-4 py-3">{c.evento?.invitados ?? "—"}</td>
                        <td className="px-4 py-3">{c.niveles}</td>
                        <td className="px-4 py-3">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded"
                            style={{
                              background: (STATUS_COLORS[statusKey] || "#999") + "22",
                              color: STATUS_COLORS[statusKey] || "#666",
                            }}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {new Date(c.createdAt).toLocaleDateString("es-MX")}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/dashboard/cotizaciones-personalizadas/${c._id}`}
                            className="text-accent hover:underline text-xs font-semibold"
                          >
                            Ver detalle
                          </Link>
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
