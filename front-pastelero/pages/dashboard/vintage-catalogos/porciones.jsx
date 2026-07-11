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

export default function VintagePorcionesPage() {
  const [insumos, setInsumos] = useState([]);

  useEffect(() => {
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
