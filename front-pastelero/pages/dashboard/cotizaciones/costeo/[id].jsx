import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import Link from "next/link";
import Swal from "sweetalert2";
import { useAuth } from "@/src/context";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const SOURCE_URL = { pastel: "pricecake", cupcake: "pricecupcake", snack: "pricesnack" };

export default function CosteoCotizacion() {
  const router = useRouter();
  const { id, source } = router.query;
  const { userToken } = useAuth();
  const authHeader = userToken ? { Authorization: `Bearer ${userToken}` } : {};

  const [cotizacion, setCotizacion] = useState(null);
  const [recetas, setRecetas] = useState([]);
  const [tecnicas, setTecnicas] = useState([]);

  // Form state
  const [recetaId, setRecetaId] = useState("");
  const [selectedTecnicas, setSelectedTecnicas] = useState([]);
  const [margenDeseado, setMargenDeseado] = useState(30);
  const [ivaPercent, setIvaPercent] = useState(16);

  // Result state
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(false);

  const endpoint = source ? SOURCE_URL[source] : null;

  useEffect(() => {
    if (!id || !endpoint) return;
    Promise.all([
      fetch(`${API_BASE}/${endpoint}/${id}`, { headers: authHeader }).then((r) => r.json()),
      fetch(`${API_BASE}/recetas/recetas`, { headers: authHeader }).then((r) => r.json()),
      fetch(`${API_BASE}/tecnicas`, { headers: authHeader }).then((r) => r.json()),
    ])
      .then(([cotRes, recRes, tecRes]) => {
        setCotizacion(cotRes.data);
        setRecetas(recRes.data ?? []);
        setTecnicas(tecRes.data ?? []);
        // Pre-fill if snapshot already exists
        if (cotRes.data?.costeoSnapshot) {
          const s = cotRes.data.costeoSnapshot;
          setSnapshot(s);
          setRecetaId(s.recetaId ?? "");
          setSelectedTecnicas(s.tecnicas?.map((t) => t.tecnicaId) ?? []);
          setMargenDeseado(s.margenDeseado ?? 30);
          setIvaPercent(s.ivaPercent ?? 16);
        }
      })
      .catch(console.error);
  }, [id, endpoint, userToken]);

  const toggleTecnica = (tecnicaId) => {
    setSelectedTecnicas((prev) =>
      prev.includes(tecnicaId) ? prev.filter((t) => t !== tecnicaId) : [...prev, tecnicaId]
    );
  };

  const handleCalcular = async () => {
    if (!recetaId) {
      Swal.fire({ title: "Selecciona una receta", icon: "warning", timer: 1800, showConfirmButton: false });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${endpoint}/${id}/costeo`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ recetaId, tecnicaIds: selectedTecnicas, margenDeseado, ivaPercent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSnapshot(data.data);
    } catch (err) {
      Swal.fire({ title: "Error", text: err.message, icon: "error", timer: 2000, showConfirmButton: false });
    } finally {
      setLoading(false);
    }
  };

  const porciones = cotizacion
    ? source === "snack"
      ? parseInt(cotizacion.people, 10) * parseInt(cotizacion.portionsPerPerson, 10)
      : parseInt(cotizacion.portions, 10)
    : 0;

  if (!cotizacion) return <p className="p-8">Cargando...</p>;

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className={`text-text ${poppins.className} flex-grow w-3/4 max-w-screen-lg mx-auto pb-20`}>
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Costeo de cotización</h1>

          {/* Resumen cotización */}
          <div className="m-4 p-4 bg-rose-50 rounded-xl">
            <p className="font-semibold">{cotizacion.contactName}</p>
            <p className="text-sm text-gray-600">
              {source?.charAt(0).toUpperCase() + source?.slice(1)} · {porciones} porciones · Entrega: {cotizacion.deliveryDate}
            </p>
            <p className="text-sm">Precio cotizado: <strong>${cotizacion.precio ?? "—"} MXN</strong></p>
          </div>

          {/* Selección de receta */}
          <div className="m-4">
            <label className="block mb-2 text-sm font-medium">Receta base</label>
            <select
              value={recetaId}
              onChange={(e) => setRecetaId(e.target.value)}
              className="bg-gray-50 border border-secondary text-sm rounded-lg block w-full max-w-md p-2.5"
            >
              <option value="">Seleccionar receta...</option>
              {recetas.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.nombre_receta} — rinde {r.portions} porciones / ${r.total_cost?.toFixed(2)} MXN
                </option>
              ))}
            </select>
            {recetaId && (
              <p className="text-xs text-gray-500 mt-1">
                Recetas necesarias: <strong>{Math.ceil(porciones / (recetas.find((r) => r._id === recetaId)?.portions ?? 1))}</strong>
              </p>
            )}
          </div>

          {/* Técnicas creativas */}
          <div className="m-4">
            <p className="text-sm font-medium mb-2">Técnicas creativas</p>
            {tecnicas.length === 0 ? (
              <p className="text-sm text-gray-400">Sin técnicas registradas.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl">
                {tecnicas.map((t) => (
                  <label key={t._id} className="flex items-center gap-2 p-2 rounded border border-secondary hover:bg-rose-50 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={selectedTecnicas.includes(t._id)}
                      onChange={() => toggleTecnica(t._id)}
                      className="w-4 h-4 accent-accent"
                    />
                    <span>
                      <span className="font-medium">{t.nombre}</span>
                      <span className="text-gray-400 ml-1">
                        ${t.costoBase} base · {t.tiempoHoras}h · ${t.escalaPorPorcion}/porción
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Margen e IVA */}
          <div className="m-4 flex gap-6 flex-wrap">
            <div>
              <label className="block mb-1 text-sm font-medium">Margen deseado (%)</label>
              <input
                type="number" min="0" max="200" step="1"
                value={margenDeseado}
                onChange={(e) => setMargenDeseado(Number(e.target.value))}
                className="bg-gray-50 border border-secondary text-sm rounded-lg p-2.5 w-28"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">IVA (%)</label>
              <input
                type="number" min="0" max="30" step="1"
                value={ivaPercent}
                onChange={(e) => setIvaPercent(Number(e.target.value))}
                className="bg-gray-50 border border-secondary text-sm rounded-lg p-2.5 w-24"
              />
            </div>
          </div>

          <div className="m-4">
            <button
              onClick={handleCalcular}
              disabled={loading}
              className="shadow-md text-text bg-primary hover:bg-accent hover:text-white font-medium rounded-lg text-sm px-10 py-2.5 disabled:opacity-50"
            >
              {loading ? "Calculando..." : "Calcular costeo"}
            </button>
          </div>

          {/* Resultados */}
          {snapshot && (
            <div className="m-4 p-6 bg-rose-50 rounded-xl space-y-2">
              <h2 className={`text-2xl font-bold mb-4 ${sofia.className}`}>Resultado del costeo</h2>
              <p className="text-sm text-gray-500">Calculado el {new Date(snapshot.fechaCosteo).toLocaleString("es-MX")}</p>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <Detail label="Porciones" value={snapshot.porciones} />
                <Detail label="Receta base" value={snapshot.recetaNombre} />
                <Detail label="Rendimiento por receta" value={`${snapshot.recetaRendimiento} porciones`} />
                <Detail label="Recetas necesarias" value={snapshot.recetasNecesarias} />
                <Detail label="Costo de recetas" value={`$${snapshot.costoReceta?.toFixed(2)} MXN`} />
                <Detail label="Costo fijo del pedido" value={`$${snapshot.costoFijoSnapshot?.toFixed(2)} MXN`} />
              </div>

              {snapshot.tecnicas?.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-sm mb-2">Técnicas aplicadas:</p>
                  <table className="text-sm w-full max-w-lg">
                    <thead>
                      <tr className="text-xs text-gray-500 border-b">
                        <th className="text-left py-1">Técnica</th>
                        <th className="text-right py-1">Costo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {snapshot.tecnicas.map((t, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-1">{t.nombre}</td>
                          <td className="text-right">${t.costoCalculado?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-4 border-t pt-4 grid grid-cols-2 gap-4">
                <Detail label="Costo de técnicas" value={`$${snapshot.costoTecnicasTotal?.toFixed(2)} MXN`} />
                <Detail label="Costo total" value={`$${snapshot.costoTotal?.toFixed(2)} MXN`} bold />
                <Detail label={`Margen (${snapshot.margenDeseado}%)`} value={`+$${(snapshot.precioSugerido - snapshot.costoTotal).toFixed(2)} MXN`} />
                <Detail label="Precio sugerido (sin IVA)" value={`$${snapshot.precioSugerido?.toFixed(2)} MXN`} />
                <Detail label={`IVA (${snapshot.ivaPercent}%)`} value={`$${snapshot.ivaImporte?.toFixed(2)} MXN`} />
                <Detail
                  label="Precio final (con IVA)"
                  value={`$${snapshot.precioFinal?.toFixed(2)} MXN`}
                  bold
                  highlight
                />
                <Detail
                  label="Ganancia neta"
                  value={`$${snapshot.gananciaNeta?.toFixed(2)} MXN`}
                  bold
                />
              </div>
            </div>
          )}

          <div className="m-4">
            <Link href="/dashboard/cotizaciones">
              <button className="shadow-md text-white bg-accent hover:bg-secondary font-medium rounded-lg text-sm px-10 py-2.5">
                Regresar a cotizaciones
              </button>
            </Link>
          </div>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}

function Detail({ label, value, bold, highlight }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-sm ${bold ? "font-bold" : ""} ${highlight ? "text-accent text-base" : ""}`}>{value}</p>
    </div>
  );
}
