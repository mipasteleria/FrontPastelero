import { useEffect, useState } from "react";
import CatalogoCrudPage from "@/src/components/cotizacionCatalogos/CatalogoCrudPage";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const DEFAULT = {
  slug: "", nombre: "", porciones: 12, pisosMax: 1, anticipacionDias: 5,
  costoBase: 0, margenBase: 0, insumoBaseId: "",
  costoDomo: 0, margenDomo: 0, insumoDomoId: "",
  costoBranding: 0, margenBranding: 0, insumoBrandingId: "",
  activo: true, orden: 0,
};

const Num = ({ label, k, form, setForm, step = "1" }) => (
  <div>
    <label className="block text-xs font-semibold mb-1 text-gray-600">{label}</label>
    <input type="number" step={step} min="0" className="border rounded px-3 py-2 w-full"
      value={form[k] ?? 0} onChange={(e) => setForm({ ...form, [k]: Number(e.target.value) })} />
  </div>
);

// Costo unitario del insumo: costo del paquete / unidades por paquete.
const unitario = (ins) => (Number(ins?.cost) || 0) / (Number(ins?.amount) || 1);

/**
 * Costo de un concepto (Base/Domo/Branding): manual o vinculado a materia
 * prima. Con insumo vinculado, la cotización siempre usa el costo unitario
 * vigente del insumo (se actualiza solo si cambias el precio en Insumos).
 */
function CostoConcepto({ titulo, costoKey, margenKey, insumoKey, form, setForm, insumos }) {
  const vinculado = !!form[insumoKey];
  const ins = insumos.find((i) => i._id === form[insumoKey]);

  return (
    <div className="md:col-span-2 border rounded-lg p-3">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
        <p className="text-xs font-bold text-gray-600 uppercase">{titulo}</p>
        <div className="flex rounded-full border overflow-hidden text-xs font-semibold">
          <button type="button"
            className={`px-3 py-1 ${!vinculado ? "text-white" : "text-gray-500"}`}
            style={{ background: !vinculado ? "var(--burdeos)" : "transparent" }}
            onClick={() => setForm({ ...form, [insumoKey]: "" })}>
            Costo manual
          </button>
          <button type="button"
            className={`px-3 py-1 ${vinculado ? "text-white" : "text-gray-500"}`}
            style={{ background: vinculado ? "var(--burdeos)" : "transparent" }}
            onClick={() => {
              // Al activar, preselecciona el primero para que se vea el efecto.
              if (!form[insumoKey] && insumos[0]) setForm({ ...form, [insumoKey]: insumos[0]._id });
            }}>
            Desde materia prima
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {vinculado ? (
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Insumo (materia prima)</label>
            <select className="border rounded px-3 py-2 w-full"
              value={form[insumoKey] || ""}
              onChange={(e) => setForm({ ...form, [insumoKey]: e.target.value })}>
              {insumos.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name} — ${unitario(i).toFixed(2)} c/u
                </option>
              ))}
            </select>
            {ins && (
              <p className="text-[11px] text-gray-500 mt-1">
                Costo unitario actual: <strong>${unitario(ins).toFixed(2)}</strong> (paquete ${ins.cost} ÷ {ins.amount}).
                Si actualizas el insumo, este costo se actualiza solo.
              </p>
            )}
          </div>
        ) : (
          <Num label="Costo manual" k={costoKey} form={form} setForm={setForm} step="0.01" />
        )}
        <Num label="Margen (%)" k={margenKey} form={form} setForm={setForm} />
      </div>
    </div>
  );
}

/**
 * Panel para editar el costo extra por número de pisos (2 y 3). Vive aquí
 * porque el máximo de pisos se define por tamaño — así todo lo de pisos se
 * gestiona en una sola pantalla (la tarjeta "Pisos" del menú se retiró).
 * Usa el catálogo /vintage-catalogos/pisos existente.
 */
function PanelPisos({ userToken }) {
  const [pisos, setPisos] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const authHeader = userToken ? { Authorization: `Bearer ${userToken}` } : {};

  const recargar = () => {
    fetch(`${API_BASE}/vintage-catalogos/pisos?incluyeInactivos=true`, { headers: authHeader })
      .then((r) => r.json())
      .then((j) => setPisos((j.data || []).sort((a, b) => a.niveles - b.niveles)))
      .catch(() => {});
  };
  useEffect(recargar, [userToken]); // eslint-disable-line

  const upd = (id, patch) => setPisos((ps) => ps.map((p) => (p._id === id ? { ...p, ...patch } : p)));

  const guardar = async () => {
    setGuardando(true);
    try {
      await Promise.all(pisos.map((p) =>
        fetch(`${API_BASE}/vintage-catalogos/pisos/${p._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeader },
          body: JSON.stringify({ costo: Number(p.costo) || 0, margen: Number(p.margen) || 0, activo: p.activo }),
        })
      ));
      recargar();
    } finally {
      setGuardando(false);
    }
  };

  // Si el catálogo está vacío (instalación nueva), crear los 3 niveles
  // estándar — antes se creaban desde la página "Pisos", ya retirada.
  const crearEstandar = async () => {
    setGuardando(true);
    try {
      const defs = [
        { slug: "1-piso", nombre: "1 piso", niveles: 1, costo: 0, margen: 0, orden: 0 },
        { slug: "2-pisos", nombre: "2 pisos", niveles: 2, costo: 0, margen: 0, orden: 1 },
        { slug: "3-pisos", nombre: "3 pisos", niveles: 3, costo: 0, margen: 0, orden: 2 },
      ];
      await Promise.all(defs.map((d) =>
        fetch(`${API_BASE}/vintage-catalogos/pisos`, {
          method: "POST", headers: { "Content-Type": "application/json", ...authHeader },
          body: JSON.stringify({ ...d, activo: true }),
        })
      ));
      recargar();
    } finally {
      setGuardando(false);
    }
  };

  if (pisos.length === 0) {
    return (
      <div className="shadow-md rounded-lg p-4 md:p-6 mb-6" style={{ background: "#fff", border: "1px solid var(--border-color)" }}>
        <div className="text-sm font-bold mb-1" style={{ color: "var(--burdeos)" }}>Costo extra por pisos</div>
        <p className="text-xs text-gray-500 mb-3">Aún no hay niveles de pisos configurados.</p>
        <button onClick={crearEstandar} disabled={guardando} className="px-4 py-2 rounded text-sm font-semibold text-white disabled:opacity-50" style={{ background: "var(--burdeos)" }}>
          {guardando ? "Creando…" : "Crear niveles estándar (1, 2 y 3 pisos)"}
        </button>
      </div>
    );
  }

  return (
    <div className="shadow-md rounded-lg p-4 md:p-6 mb-6" style={{ background: "#fff", border: "1px solid var(--border-color)" }}>
      <div className="text-sm font-bold mb-1" style={{ color: "var(--burdeos)" }}>Costo extra por pisos</div>
      <p className="text-xs text-gray-500 mb-3">
        Se suma al total cuando el cliente elige 2 o 3 pisos (1 piso va incluido en la base).
        El máximo de pisos disponible se define abajo, en cada tamaño.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {pisos.map((p) => (
          <div key={p._id} className="border rounded-lg p-3">
            <p className="text-xs font-bold text-gray-600 uppercase mb-2">{p.nombre}</p>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Costo extra</label>
            <input type="number" step="0.01" min="0" className="border rounded px-3 py-2 w-full mb-2"
              value={p.costo ?? 0} onChange={(e) => upd(p._id, { costo: e.target.value })} />
            <label className="block text-xs font-semibold mb-1 text-gray-600">Margen (%)</label>
            <input type="number" min="0" className="border rounded px-3 py-2 w-full"
              value={p.margen ?? 0} onChange={(e) => upd(p._id, { margen: e.target.value })} />
          </div>
        ))}
      </div>
      <button onClick={guardar} disabled={guardando}
        className="mt-3 px-4 py-2 rounded text-sm font-semibold text-white disabled:opacity-50"
        style={{ background: "var(--burdeos)" }}>
        {guardando ? "Guardando…" : "Guardar costos de pisos"}
      </button>
    </div>
  );
}

export default function VintagePorcionesPage() {
  const [insumos, setInsumos] = useState([]);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    try { setUserToken(localStorage.getItem("token")); } catch {}
    fetch(`${API_BASE}/insumos`)
      .then((r) => r.json())
      .then((j) => {
        const list = Array.isArray(j) ? j : j.data || [];
        setInsumos(list.sort((a, b) => (a.name || "").localeCompare(b.name || "")));
      })
      .catch(() => {});
  }, []);

  const costoCol = (d, costoKey, insumoKey) => {
    const ins = insumos.find((i) => i._id === d[insumoKey]);
    return ins ? `$${unitario(ins).toFixed(2)}↗` : `$${d[costoKey]}`;
  };

  return (
    <CatalogoCrudPage
      basePath="vintage-catalogos"
      tipo="porciones"
      labelSingular="Tamaño"
      labelPlural="Porciones (vintage)"
      headerExtra={<PanelPisos userToken={userToken} />}
      defaultDoc={DEFAULT}
      columnas={[
        { key: "porciones", label: "Porciones", render: (d) => d.porciones },
        { key: "pisosMax", label: "Pisos máx", render: (d) => d.pisosMax },
        { key: "anticipacionDias", label: "Anticip. (días háb.)", render: (d) => d.anticipacionDias },
        {
          key: "costoBase", label: "Base/Domo/Brand",
          render: (d) => `${costoCol(d, "costoBase", "insumoBaseId")} / ${costoCol(d, "costoDomo", "insumoDomoId")} / ${costoCol(d, "costoBranding", "insumoBrandingId")}`,
        },
      ]}
      renderFormFields={({ form, setForm }) => (
        <>
          <Num label="Porciones" k="porciones" form={form} setForm={setForm} />
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Pisos máximos</label>
            <select className="border rounded px-3 py-2 w-full" value={form.pisosMax} onChange={(e) => setForm({ ...form, pisosMax: Number(e.target.value) })}>
              <option value={1}>1 piso</option>
              <option value={2}>Hasta 2 pisos</option>
              <option value={3}>Hasta 3 pisos</option>
            </select>
          </div>
          <Num label="Anticipación (días hábiles)" k="anticipacionDias" form={form} setForm={setForm} />
          <div className="md:col-span-2 border-t pt-2 mt-1 text-xs font-bold text-gray-500 uppercase">
            Costos incluidos (cada uno con su margen)
          </div>
          <CostoConcepto titulo="Base" costoKey="costoBase" margenKey="margenBase" insumoKey="insumoBaseId" form={form} setForm={setForm} insumos={insumos} />
          <CostoConcepto titulo="Domo" costoKey="costoDomo" margenKey="margenDomo" insumoKey="insumoDomoId" form={form} setForm={setForm} insumos={insumos} />
          <CostoConcepto titulo="Branding" costoKey="costoBranding" margenKey="margenBranding" insumoKey="insumoBrandingId" form={form} setForm={setForm} insumos={insumos} />
        </>
      )}
    />
  );
}
