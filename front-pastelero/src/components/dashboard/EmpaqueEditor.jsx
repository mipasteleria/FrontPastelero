import { useEffect, useState } from "react";

/**
 * Deja los renglones listos para guardar: los inputs del form entregan
 * strings, y Mongoose rechaza `insumoId: ""` como ObjectId. También tira
 * los renglones en blanco que el admin agregó y no llenó.
 */
export function normalizarEmpaque(items) {
  return (Array.isArray(items) ? items : [])
    .map((it) => ({
      concepto: (it.concepto || "").trim(),
      insumoId: it.insumoId || null,
      costoManual: Number(it.costoManual) || 0,
      cantidad: Number(it.cantidad) || 0,
    }))
    .filter((it) => it.insumoId || it.costoManual > 0 || it.concepto);
}

/**
 * Editor de renglones de empaque (bolsa, etiqueta, caja, listón…).
 *
 * Cada renglón se puede ligar a un insumo de materia prima — así el costo
 * se lee en vivo y se actualiza solo cuando sube el precio del proveedor —
 * o capturarse a mano cuando no vale la pena darlo de alta como insumo.
 *
 * El costo unitario de un insumo es `cost / amount`: el precio por unidad
 * de la presentación en que se compra (un paquete de 100 bolsas a $120
 * cuesta $1.20 la bolsa).
 *
 * Se usa igual en Galletas NY y en Postres / Galletas artesanales; el
 * total es informativo, el cálculo autoritativo lo hace el backend.
 *
 * @param {Array}    value    renglones [{ concepto, insumoId, costoManual, cantidad }]
 * @param {Function} onChange recibe el nuevo arreglo
 * @param {string}   apiBase  base de la API para cargar insumos
 * @param {object}   authHeader headers con el Bearer token
 */
export default function EmpaqueEditor({ value, onChange, apiBase, authHeader = {}, accent = "#C86B7F" }) {
  const items = Array.isArray(value) ? value : [];
  const [insumos, setInsumos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const r = await fetch(`${apiBase}/insumos`, { headers: authHeader });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();
        const list = Array.isArray(j) ? j : (j?.data || []);
        if (vivo) { setInsumos(list); setError(""); }
      } catch (e) {
        // Sin insumos el editor sigue sirviendo con costos manuales, pero
        // hay que decirlo: si no, el admin ve el dropdown vacío y supone
        // que no tiene materia prima dada de alta.
        if (vivo) setError("No se pudo cargar la materia prima. Puedes capturar los costos a mano.");
      } finally {
        if (vivo) setCargando(false);
      }
    })();
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase]);

  const porId = new Map(insumos.map((i) => [String(i._id), i]));

  /** Costo unitario de un renglón, replicando la lógica del backend. */
  const unitarioDe = (item) => {
    const ins = item.insumoId ? porId.get(String(item.insumoId)) : null;
    if (ins) return (Number(ins.cost) || 0) / (Number(ins.amount) || 1);
    return Number(item.costoManual) || 0;
  };

  const total = items.reduce((a, it) => a + unitarioDe(it) * (Number(it.cantidad) || 0), 0);

  const actualizar = (idx, cambios) => {
    onChange(items.map((it, i) => (i === idx ? { ...it, ...cambios } : it)));
  };
  const agregar = () => onChange([...items, { concepto: "", insumoId: "", costoManual: "", cantidad: 1 }]);
  const quitar = (idx) => onChange(items.filter((_, i) => i !== idx));

  const inputChico = {
    width: "100%",
    padding: "6px 8px",
    borderRadius: 8,
    border: "1px solid #E7D4DA",
    fontSize: "0.8rem",
    background: "#fff",
  };

  return (
    <div style={{ border: "1px solid #F0DFE4", borderRadius: 12, padding: 12, background: "#FFFBFC" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-soft)" }}>
          Empaque <em style={{ fontWeight: 400, color: "var(--text-muted)" }}>(bolsa, etiqueta, caja…)</em>
        </span>
        <button
          type="button"
          onClick={agregar}
          style={{ fontSize: "0.72rem", fontWeight: 700, color: accent, background: "none", border: `1px dashed ${accent}`, borderRadius: 999, padding: "3px 10px", cursor: "pointer" }}
        >
          + Agregar renglón
        </button>
      </div>

      {error && <p style={{ fontSize: "0.7rem", color: "#B4484B", margin: "0 0 8px" }}>{error}</p>}

      {items.length === 0 && (
        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: 0 }}>
          Sin empaque capturado. Agrega un renglón por cada cosa que empaca el producto;
          si lo ligas a materia prima, el costo se actualiza solo cuando suba el precio.
        </p>
      )}

      {items.map((it, idx) => {
        const unitario = unitarioDe(it);
        const ligado = Boolean(it.insumoId);
        return (
          <div
            key={idx}
            style={{ display: "grid", gridTemplateColumns: "1.1fr 1.4fr 0.7fr 0.7fr auto", gap: 6, alignItems: "center", marginBottom: 6 }}
          >
            <input
              type="text"
              placeholder="Concepto"
              value={it.concepto || ""}
              onChange={(e) => actualizar(idx, { concepto: e.target.value })}
              style={inputChico}
            />
            <select
              value={it.insumoId || ""}
              onChange={(e) => actualizar(idx, { insumoId: e.target.value })}
              style={inputChico}
              disabled={cargando || insumos.length === 0}
            >
              <option value="">— Costo manual —</option>
              {insumos.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name} (${((Number(i.cost) || 0) / (Number(i.amount) || 1)).toFixed(2)}/{i.unit})
                </option>
              ))}
            </select>
            {ligado ? (
              <span style={{ fontSize: "0.78rem", textAlign: "right", color: "var(--text-muted)" }} title="Costo leído de materia prima">
                ${unitario.toFixed(2)}
              </span>
            ) : (
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="$0.00"
                value={it.costoManual ?? ""}
                onChange={(e) => actualizar(idx, { costoManual: e.target.value })}
                style={inputChico}
              />
            )}
            <input
              type="number"
              step="0.01"
              min="0"
              value={it.cantidad ?? 1}
              onChange={(e) => actualizar(idx, { cantidad: e.target.value })}
              style={inputChico}
              title="Cantidad"
            />
            <button
              type="button"
              onClick={() => quitar(idx)}
              title="Quitar renglón"
              style={{ background: "none", border: "none", color: "#B4484B", cursor: "pointer", fontSize: "1rem", lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        );
      })}

      {items.length > 0 && (
        <div style={{ borderTop: "1px solid #F0DFE4", marginTop: 8, paddingTop: 6, textAlign: "right", fontSize: "0.8rem", fontWeight: 800, color: "var(--text-soft)" }}>
          Empaque total: ${total.toFixed(2)}
        </div>
      )}
    </div>
  );
}
