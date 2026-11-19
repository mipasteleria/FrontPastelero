import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import CatalogoCrudPage from "@/src/components/cotizacionCatalogos/CatalogoCrudPage";
import { useAuth } from "@/src/context";
import { subirImagen } from "@/src/lib/imageUpload";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const DEFAULT = {
  slug: "",
  nombre: "",
  descripcion: "",
  emoji: "🍰",
  imagenUrl: "",
  imagenFileName: "",
  recetaId: "",
  costoManual: 0,
  activo: true,
  orden: 0,
};

const money = (n) => `$${Number(n || 0).toFixed(2)}`;

export default function PostresPage() {
  const { userToken } = useAuth();
  const [recetas, setRecetas] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  // Costeo calculado por el back con el MISMO helper que usa la cotización
  // real, para que lo que se ve aquí sea lo que se le cobra al cliente.
  const [costeo, setCosteo] = useState({});
  const [markupGlobal, setMarkupGlobal] = useState(null);

  const cargarCosteo = useCallback(async () => {
    if (!userToken) return;
    try {
      const r = await fetch(`${API_BASE}/cotizacion-catalogos/postres/costeo`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (!r.ok) return;
      const j = await r.json();
      setMarkupGlobal(j.markupGlobal ?? null);
      setCosteo(Object.fromEntries((j.data || []).map((p) => [String(p._id), p])));
    } catch (e) {
      console.error("No se pudo cargar el costeo:", e);
    }
  }, [userToken]);

  useEffect(() => {
    if (!userToken) return;
    fetch(`${API_BASE}/recetas/recetas`, { headers: { Authorization: `Bearer ${userToken}` } })
      .then((r) => r.json())
      .then((j) => setRecetas(j.data || j || []))
      .catch(console.error);
    cargarCosteo();
  }, [userToken, cargarCosteo]);

  const recostear = async (id) => {
    try {
      const r = await fetch(`${API_BASE}/cotizacion-catalogos/postres/${id}/recostear`, {
        method: "POST",
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Error");
      await cargarCosteo();
      Swal.fire({
        icon: "success",
        title: `Recosteado: ${money(j.data?.costoUnitarioSnapshot)} / porción`,
        timer: 2200,
        showConfirmButton: false,
        background: "#fff1f2",
        color: "#540027",
      });
    } catch (e) {
      Swal.fire({ icon: "error", title: e.message, timer: 2200, showConfirmButton: false });
    }
  };

  const subirFoto = async (e, form, setForm) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    try {
      const { fileUrl, fileName } = await subirImagen(file, API_BASE, userToken);
      setForm({ ...form, imagenUrl: fileUrl, imagenFileName: fileName });
      Swal.fire({
        icon: "success",
        title: "Foto subida",
        text: "No olvides guardar el postre.",
        timer: 1800,
        showConfirmButton: false,
        background: "#fff1f2",
        color: "#540027",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "No se pudo subir",
        text: String(err.message || err),
        background: "#fff1f2",
        color: "#540027",
      });
    } finally {
      setSubiendo(false);
      e.target.value = "";
    }
  };

  return (
    <CatalogoCrudPage
      tipo="postres"
      labelSingular="Postre"
      labelPlural="Postres (mesa de postres)"
      defaultDoc={DEFAULT}
      /* Foto si la hay; si no, el emoji como antes. */
      renderRowExtra={(d) =>
        d.imagenUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={d.imagenUrl}
            alt={d.nombre}
            style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 10, display: "block" }}
          />
        ) : (
          <span style={{ fontSize: 22 }}>{d.emoji || "🍰"}</span>
        )
      }
      columnas={[
        {
          key: "receta",
          label: "Receta",
          render: (d) => {
            const c = costeo[String(d._id)];
            if (c?.recetaNombre) {
              return (
                <span>
                  {c.recetaNombre}
                  <span className="block text-[10px] text-gray-400">
                    rinde {c.recetaPorciones} porciones
                  </span>
                </span>
              );
            }
            return <span className="text-gray-400 italic">manual</span>;
          },
        },
        {
          key: "costeo",
          label: "Costo → precio / porción",
          render: (d) => {
            const c = costeo[String(d._id)];
            if (!c) return <span className="text-xs text-gray-400">—</span>;
            return (
              <div className="text-xs leading-5">
                <div>
                  Costo: <strong>{money(c.costoUnitario)}</strong>
                </div>
                <div className="text-gray-500">
                  + margen {c.margenPct}%{" "}
                  <span className="text-[10px]">
                    ({c.margenFuente === "receta" ? "de la receta" : "global"})
                  </span>
                </div>
                <div style={{ color: "#1D5A45" }}>
                  Ganancia: <strong>{money(c.gananciaUnitaria)}</strong>
                </div>
                <div
                  style={{ color: "var(--burdeos)", borderTop: "1px solid #eee", marginTop: 2, paddingTop: 2 }}
                >
                  Se cobra: <strong>{money(c.precioUnitario)}</strong>
                </div>
              </div>
            );
          },
        },
        {
          key: "recostear",
          label: "Recosteo",
          render: (d) =>
            d.recetaId ? (
              <button onClick={() => recostear(d._id)} className="text-xs text-accent hover:underline">
                Recostear
              </button>
            ) : (
              <span className="text-xs text-gray-300">—</span>
            ),
        },
      ]}
      renderFormFields={({ form, setForm }) => (
        <>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Foto del postre</label>
            {form.imagenUrl ? (
              <div className="flex items-center gap-3 mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.imagenUrl}
                  alt="Vista previa"
                  style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 10 }}
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, imagenUrl: "", imagenFileName: "" })}
                  className="text-xs text-red-600 hover:underline"
                >
                  Quitar foto
                </button>
              </div>
            ) : null}
            <input
              type="file"
              accept="image/*"
              disabled={subiendo}
              onChange={(e) => subirFoto(e, form, setForm)}
              className="text-xs"
            />
            <div className="text-[10px] text-gray-400 mt-1">
              {subiendo ? "Subiendo…" : "Opcional. Si no subes foto se usa el emoji."}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Emoji opcional</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={form.emoji || ""}
              onChange={(e) => setForm({ ...form, emoji: e.target.value })}
              placeholder="🍰"
              maxLength={4}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Receta vinculada (opcional)</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={form.recetaId?._id || form.recetaId || ""}
              onChange={(e) => setForm({ ...form, recetaId: e.target.value || null })}
            >
              <option value="">— Sin receta (costo manual) —</option>
              {recetas.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.nombre_receta} ({r.portions} porciones, margen {r.profit_margin}%)
                </option>
              ))}
            </select>
            <div className="text-[10px] text-gray-400 mt-1">
              El costo de la receta es costo puro. El margen se aplica al cotizar: se usa el de la
              receta, y si no tiene, el global
              {markupGlobal != null ? ` (${markupGlobal}%)` : ""}.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">
              Costo manual / porción (fallback)
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
              Solo se usa si no hay receta o si la receta aún no se ha recosteado.
            </div>
          </div>
        </>
      )}
    />
  );
}
