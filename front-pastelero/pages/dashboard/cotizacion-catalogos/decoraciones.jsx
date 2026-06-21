import { useEffect, useState } from "react";
import CatalogoCrudPage from "@/src/components/cotizacionCatalogos/CatalogoCrudPage";
import { useAuth } from "@/src/context";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const DEFAULT = {
  slug: "",
  nombre: "",
  descripcion: "",
  emoji: "🎀",
  tecnicaCreativaId: "",
  costoManual: 0,
  activo: true,
  orden: 0,
};

export default function DecoracionesPage() {
  const { userToken } = useAuth();
  const [tecnicas, setTecnicas] = useState([]);

  useEffect(() => {
    if (!userToken) return;
    // ?todas=true para incluir las inactivas — el admin debe ver todas
    // al asignar técnica creativa.
    fetch(`${API_BASE}/tecnicas?todas=true`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
      .then((r) => r.json())
      .then((j) => setTecnicas(j.data || []))
      .catch(console.error);
  }, [userToken]);

  return (
    <CatalogoCrudPage
      tipo="decoraciones"
      labelSingular="Decoración"
      labelPlural="Decoraciones"
      defaultDoc={DEFAULT}
      renderRowExtra={(d) => (
        <span style={{ fontSize: "1.4rem" }}>{d.emoji || "🎀"}</span>
      )}
      columnas={[
        {
          key: "tecnica",
          label: "Técnica creativa",
          render: (d) => {
            const idStr = d.tecnicaCreativaId?._id || d.tecnicaCreativaId;
            const t = tecnicas.find((x) => String(x._id) === String(idStr));
            return t ? t.nombre : <span className="text-gray-400 italic">manual</span>;
          },
        },
        {
          key: "costo",
          label: "Costo",
          render: (d) => {
            if (!d.tecnicaCreativaId) return `$${Number(d.costoManual ?? 0).toFixed(2)}`;
            const idStr = d.tecnicaCreativaId?._id || d.tecnicaCreativaId;
            const t = tecnicas.find((x) => String(x._id) === String(idStr));
            if (!t) return <span className="text-xs text-gray-500">según técnica</span>;
            const base = Number(t.costoBase ?? 0);
            const escala = Number(t.escalaPorPorcion ?? 0);
            return (
              <span className="text-xs">
                ${base.toFixed(2)} base{escala > 0 ? ` + $${escala.toFixed(2)}/porción` : ""}
              </span>
            );
          },
        },
      ]}
      renderFormFields={({ form, setForm }) => (
        <>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Emoji</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={form.emoji || ""}
              onChange={(e) => setForm({ ...form, emoji: e.target.value })}
              placeholder="🎀"
              maxLength={4}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">
              Técnica creativa vinculada (opcional)
            </label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={form.tecnicaCreativaId || ""}
              onChange={(e) => setForm({ ...form, tecnicaCreativaId: e.target.value || null })}
            >
              <option value="">— Sin técnica (costo manual) —</option>
              {tecnicas.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.nombre} ({t.categoria})
                </option>
              ))}
            </select>
            <div className="text-[10px] text-gray-400 mt-1">
              Si eliges técnica, el costo escala con las porciones al costear la cotización.
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1 text-gray-600">
              Costo manual
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="border rounded px-3 py-2 w-full"
              value={form.costoManual ?? 0}
              onChange={(e) => setForm({ ...form, costoManual: Number(e.target.value) })}
            />
            <div className="text-[10px] text-gray-400 mt-1">
              Costo plano sumado al total (no escala con porciones). Si hay técnica vinculada,
              el costeo usa la técnica; si no, usa este costo manual.
            </div>
          </div>
        </>
      )}
    />
  );
}
