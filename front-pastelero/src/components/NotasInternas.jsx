import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

/**
 * Componente reutilizable para mostrar y gestionar notas internas de admin.
 *
 * Props:
 *   - apiBaseEndpoint: URL del recurso padre (ej. `${API_BASE}/galletaPedidos/abc123`)
 *                      El componente le pegará `/notas-internas` para POST/GET
 *                      y `/notas-internas/:notaId` para DELETE.
 *   - authHeader:      objeto con Authorization para axios.
 *   - initialNotas:    (opcional) array inicial de notas; si se provee, el
 *                      componente NO hace fetch inicial. Si NO se provee
 *                      (o es null), el componente hace su propio GET para
 *                      cargarlas. Útil cuando el padre ya tiene las notas
 *                      vs cuando solo tiene el id del padre.
 *   - titulo:          override del título de la sección (default "Notas internas").
 *
 * El componente maneja su propio estado interno: al agregar o borrar,
 * actualiza inmediatamente la UI sin que el padre tenga que refetchear.
 */
export default function NotasInternas({ apiBaseEndpoint, authHeader, initialNotas = null, titulo = "Notas internas" }) {
  const [notas, setNotas]       = useState(initialNotas || []);
  const [texto, setTexto]       = useState("");
  const [busy, setBusy]         = useState(false);
  const [loading, setLoading]   = useState(initialNotas === null);

  // Si el padre no nos pasó initialNotas, las cargamos solos vía GET.
  useEffect(() => {
    if (initialNotas !== null) return;
    if (!apiBaseEndpoint) return;
    let cancel = false;
    (async () => {
      try {
        const res = await axios.get(`${apiBaseEndpoint}/notas-internas`, { headers: authHeader });
        if (!cancel) setNotas(res.data.data || []);
      } catch (err) {
        if (!cancel) console.error("[NotasInternas] error fetch:", err.response?.data?.message || err.message);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBaseEndpoint]);

  const fechaCorta = (d) => {
    if (!d) return "";
    const f = new Date(d);
    return f.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }) +
           " · " + f.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  };

  const agregar = async (e) => {
    e?.preventDefault?.();
    const t = texto.trim();
    if (!t || busy) return;
    setBusy(true);
    try {
      const res = await axios.post(
        `${apiBaseEndpoint}/notas-internas`,
        { texto: t },
        { headers: authHeader }
      );
      setNotas((prev) => [...prev, res.data.data]);
      setTexto("");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "No se pudo guardar la nota",
        text: err.response?.data?.message || err.message,
        background: "#fff1f2",
        color: "#540027",
        confirmButtonColor: "#9c2a44",
      });
    } finally {
      setBusy(false);
    }
  };

  const borrar = async (notaId) => {
    const result = await Swal.fire({
      title: "¿Eliminar esta nota?",
      text: "Las notas internas son parte del historial. ¿Confirmas?",
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#9c2a44",
      cancelButtonColor: "#3a3a3a",
      background: "#fff1f2",
      color: "#540027",
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${apiBaseEndpoint}/notas-internas/${notaId}`, { headers: authHeader });
      setNotas((prev) => prev.filter((n) => String(n._id) !== String(notaId)));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "No se pudo eliminar",
        text: err.response?.data?.message || err.message,
        background: "#fff1f2",
        color: "#540027",
        confirmButtonColor: "#9c2a44",
      });
    }
  };

  return (
    <div className="no-print" style={{
      background: "#fff",
      borderRadius: 14,
      padding: "1.25rem",
      border: "1px solid #f3c9d4",
      marginTop: "1rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <h3 style={{ color: "#540027", fontSize: "1.05rem", fontWeight: 800, margin: 0 }}>
          📝 {titulo}
        </h3>
        <span style={{ fontSize: "0.7rem", color: "#a78891", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
          Solo admin · {notas.length} {notas.length === 1 ? "nota" : "notas"}
        </span>
      </div>

      {loading && (
        <p style={{ color: "#a78891", fontSize: "0.82rem", marginBottom: 14, fontStyle: "italic" }}>
          Cargando notas...
        </p>
      )}

      {/* Lista de notas (orden cronológico, más recientes primero) */}
      {!loading && notas.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 14px", display: "flex", flexDirection: "column", gap: 8 }}>
          {[...notas].reverse().map((n) => (
            <li key={n._id} style={{
              background: "#fff8e1",
              border: "1px solid #ffe0a0",
              borderRadius: 10,
              padding: "10px 12px",
              fontSize: "0.88rem",
              lineHeight: 1.5,
            }}>
              <div style={{ color: "#540027", whiteSpace: "pre-wrap" }}>{n.texto}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, fontSize: "0.7rem", color: "#a78891" }}>
                <span>
                  {n.autorNombre || n.autorEmail || "Admin"} · {fechaCorta(n.fecha)}
                </span>
                <button
                  type="button"
                  onClick={() => borrar(n._id)}
                  style={{ background: "transparent", border: "none", color: "#9c2a44", cursor: "pointer", fontSize: "0.7rem", fontWeight: 700, padding: 0 }}
                  aria-label="Eliminar nota"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : !loading ? (
        <p style={{ color: "#a78891", fontSize: "0.82rem", marginBottom: 14, fontStyle: "italic" }}>
          Sin notas aún. Agrega la primera con info que no entra en otros campos (ej. método de pago, contacto alterno).
        </p>
      ) : null}

      {/* Agregar nueva nota */}
      <form onSubmit={agregar} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Nueva nota interna..."
          rows={2}
          maxLength={1000}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1.5px solid #f3c9d4",
            borderRadius: 10,
            fontSize: "0.88rem",
            fontFamily: "inherit",
            resize: "vertical",
            background: "#fff",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.7rem", color: "#a78891" }}>
            {texto.length}/1000
          </span>
          <button
            type="submit"
            disabled={!texto.trim() || busy}
            style={{
              padding: "8px 20px",
              background: "#540027",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: (!texto.trim() || busy) ? "not-allowed" : "pointer",
              opacity: (!texto.trim() || busy) ? 0.5 : 1,
            }}
          >
            {busy ? "Guardando…" : "Agregar nota"}
          </button>
        </div>
      </form>
    </div>
  );
}
