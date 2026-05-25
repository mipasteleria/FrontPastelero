import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useAuth } from "@/src/context";
import { subirImagen } from "@/src/lib/imageUpload";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/* ── Componente: render de las estrellas ── */
function Stars({ rating, size = 18, color = "#E8B43A", muted = "#E5DCD2" }) {
  return (
    <span style={{ display: "inline-flex", gap: 1, fontSize: size, lineHeight: 1 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ color: rating >= n ? color : muted }}>★</span>
      ))}
    </span>
  );
}

/* ── Componente: input de rating clickeable ── */
function RatingInput({ value, onChange, size = 32 }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "inline-flex", gap: 4, fontSize: size, lineHeight: 1 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            color: (hover || value) >= n ? "#E8B43A" : "#E5DCD2",
            transition: "color 100ms",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function formatearFechaCorta(d) {
  if (!d) return "";
  const f = new Date(d);
  return `${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear()}`;
}

/**
 * <Resenas tipo="postre" productoId="..." productoSlug="..." productoNombre="..." />
 *
 * Componente reusable para mostrar y crear reseñas de un producto.
 * Si el usuario está logueado, ofrece el form. El back verifica que
 * haya comprado antes de aceptar (si no, devuelve 403 con mensaje
 * que mostramos al usuario).
 */
export default function Resenas({ tipo, productoId, productoSlug, productoNombre }) {
  const { isLoggedIn, userToken, userEmail } = useAuth();

  const [resenas, setResenas]   = useState([]);
  const [rating, setRating]     = useState({ promedio: 0, total: 0 });
  const [loading, setLoading]   = useState(true);

  // Form state
  const [miRating, setMiRating] = useState(0);
  const [miTexto, setMiTexto]   = useState("");
  const [miImagen, setMiImagen] = useState({ url: "", fileName: "" });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [yaResene, setYaResene] = useState(false);

  // Identificador a usar en el endpoint: slug si existe, sino id.
  const identifier = productoSlug || productoId;

  /* ── Cargar reseñas ── */
  async function cargar() {
    if (!identifier) return;
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/resenas/producto/${tipo}/${identifier}`);
      const j = await r.json();
      const list = j?.data || [];
      setResenas(list);
      setRating(j?.rating || { promedio: 0, total: 0 });

      // ¿El usuario logueado ya reseñó este producto?
      if (isLoggedIn && userEmail) {
        const mia = list.find(
          (rs) => (rs.usuario?.email || "").toLowerCase() === userEmail.toLowerCase()
        );
        if (mia) {
          setYaResene(true);
          setMiRating(mia.rating || 0);
          setMiTexto(mia.texto || "");
          setMiImagen({ url: mia.imagenUrl || "", fileName: mia.imagenFileName || "" });
        } else {
          setYaResene(false);
        }
      }
    } catch (e) {
      console.error("Error cargando reseñas:", e);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { cargar(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [tipo, identifier, isLoggedIn, userEmail]);

  /* ── Subir imagen ── */
  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { fileUrl, fileName } = await subirImagen(file, API_BASE, userToken);
      setMiImagen({ url: fileUrl, fileName });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "No se pudo subir", text: String(err.message || err), background: "#fff1f2", color: "#540027" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  /* ── Submit ── */
  const enviar = async () => {
    if (!miRating || miRating < 1) {
      return Swal.fire({ icon: "warning", title: "Elige una calificación (1 a 5 estrellas)", background: "#fff1f2", color: "#540027" });
    }
    setSubmitting(true);
    try {
      const r = await fetch(`${API_BASE}/resenas`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
        body: JSON.stringify({
          tipo,
          productoId,
          rating: miRating,
          texto: miTexto,
          imagenUrl: miImagen.url,
          imagenFileName: miImagen.fileName,
        }),
      });
      const j = await r.json();
      if (!r.ok) {
        if (r.status === 403) {
          return Swal.fire({
            icon: "info",
            title: "Solo clientes verificados",
            text: j?.message || "Necesitamos comprobar tu compra de este producto antes de aceptar tu reseña.",
            background: "#fff1f2",
            color: "#540027",
          });
        }
        throw new Error(j?.message || `HTTP ${r.status}`);
      }
      await cargar();
      Swal.fire({ icon: "success", title: yaResene ? "Reseña actualizada" : "¡Gracias por tu reseña!", timer: 1800, showConfirmButton: false, background: "#fff1f2", color: "#540027" });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "No se pudo publicar", text: String(err.message || err), background: "#fff1f2", color: "#540027" });
    } finally {
      setSubmitting(false);
    }
  };

  const borrarMia = async () => {
    const mia = resenas.find((rs) => (rs.usuario?.email || "").toLowerCase() === (userEmail || "").toLowerCase());
    if (!mia) return;
    const c = await Swal.fire({
      icon: "warning",
      title: "¿Borrar tu reseña?",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      background: "#fff1f2",
      color: "#540027",
    });
    if (!c.isConfirmed) return;
    try {
      const r = await fetch(`${API_BASE}/resenas/${mia._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setMiRating(0); setMiTexto(""); setMiImagen({ url: "", fileName: "" });
      setYaResene(false);
      await cargar();
    } catch (err) {
      Swal.fire({ icon: "error", title: "No se pudo borrar", background: "#fff1f2", color: "#540027" });
    }
  };

  return (
    <section style={{ marginTop: "3rem" }}>
      {/* Header con resumen */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--burdeos)", margin: 0 }}>
          Reseñas
        </h2>
        {rating.total > 0 && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <Stars rating={Math.round(rating.promedio)} size={20} />
            <span style={{ fontWeight: 700, color: "var(--burdeos)" }}>{rating.promedio}</span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              ({rating.total} {rating.total === 1 ? "reseña" : "reseñas"})
            </span>
          </div>
        )}
      </div>

      {/* Form (solo si está logueado) */}
      {isLoggedIn ? (
        <div style={{ background: "var(--bg-raised)", border: "1px solid var(--border-color)", borderRadius: "var(--r-xl)", padding: "1.25rem", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--burdeos)", margin: "0 0 12px" }}>
            {yaResene ? "Edita tu reseña" : `¿Probaste ${productoNombre}? Cuéntanos.`}
          </p>

          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: "0.78rem", color: "var(--text-soft)", marginBottom: 4 }}>Calificación *</p>
            <RatingInput value={miRating} onChange={setMiRating} />
          </div>

          <textarea
            placeholder="¿Qué te gustó? ¿Cómo lo recibiste? Opcional…"
            rows={3}
            maxLength={1000}
            value={miTexto}
            onChange={(e) => setMiTexto(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "var(--r-md)",
              border: "1px solid var(--border-strong)",
              fontFamily: "inherit",
              fontSize: "0.9rem",
              resize: "vertical",
              minHeight: 70,
              color: "var(--color-text)",
              marginBottom: 4,
            }}
          />
          <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "right", margin: 0, marginBottom: 12 }}>{miTexto.length}/1000</p>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            {miImagen.url && (
              <div
                style={{
                  width: 72, height: 72, borderRadius: 12,
                  background: `var(--crema) url(${miImagen.url}) center/cover no-repeat`,
                  border: "1px solid var(--border-color)",
                }}
              />
            )}
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold cursor-pointer" style={{ color: "var(--burdeos)", border: "1.5px solid var(--border-strong)" }}>
              <input type="file" accept="image/*" onChange={onFileChange} disabled={uploading} style={{ display: "none" }} />
              {uploading ? "Subiendo…" : (miImagen.url ? "Cambiar foto" : "Agregar foto")}
            </label>
            {miImagen.url && (
              <button
                type="button"
                onClick={() => setMiImagen({ url: "", fileName: "" })}
                disabled={uploading}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "0.78rem", cursor: "pointer", textDecoration: "underline" }}
              >
                Quitar foto
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <button
              onClick={enviar}
              disabled={submitting || uploading || !miRating}
              style={{
                padding: "10px 24px",
                borderRadius: "var(--r-pill)",
                background: miRating ? "var(--burdeos)" : "var(--border-strong)",
                color: "#fff",
                border: "none",
                fontWeight: 800,
                fontSize: "0.88rem",
                cursor: submitting || !miRating ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Publicando…" : (yaResene ? "Actualizar reseña" : "Publicar reseña")}
            </button>
            {yaResene && (
              <button
                onClick={borrarMia}
                disabled={submitting || uploading}
                style={{ padding: "10px 18px", borderRadius: "var(--r-pill)", background: "transparent", color: "#dc2626", border: "1px solid #fecaca", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
              >
                Borrar
              </button>
            )}
          </div>

          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 10 }}>
            Las reseñas se publican inmediatamente. Solo aceptamos reseñas de clientes que han comprado este producto.
          </p>
        </div>
      ) : (
        <div style={{ background: "#fff1f2", border: "1px dashed var(--border-strong)", borderRadius: "var(--r-xl)", padding: "1rem 1.25rem", marginBottom: "1.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--burdeos)", margin: 0 }}>
            <Link href="/login" style={{ color: "var(--burdeos)", fontWeight: 700, textDecoration: "underline" }}>Inicia sesión</Link> para dejar una reseña verificada por compra.
          </p>
        </div>
      )}

      {/* Lista de reseñas */}
      {loading ? (
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Cargando reseñas…</p>
      ) : resenas.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Aún no hay reseñas. ¡Sé el primero!</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {resenas.map((r) => (
            <div key={r._id} style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "1rem 1.25rem", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <Stars rating={r.rating} size={16} />
                  <p style={{ fontWeight: 700, color: "var(--color-text)", margin: "4px 0 0" }}>{r.usuario?.nombre || "Cliente"}</p>
                </div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  ✓ Compra verificada · {formatearFechaCorta(r.createdAt)}
                </span>
              </div>
              {r.texto && (
                <p style={{ fontSize: "0.9rem", color: "var(--text-soft)", lineHeight: 1.6, margin: "6px 0 0", whiteSpace: "pre-line" }}>{r.texto}</p>
              )}
              {r.imagenUrl && (
                <div style={{
                  width: 140, height: 140, borderRadius: 12,
                  background: `var(--crema) url(${r.imagenUrl}) center/cover no-repeat`,
                  marginTop: 10,
                  border: "1px solid var(--border-color)",
                }} />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
