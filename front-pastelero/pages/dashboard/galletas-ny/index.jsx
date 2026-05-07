import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { useAuth } from "@/src/context";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/* ─── Default values for new flavor form ─────────────────────── */
const NEW_FLAVOR = {
  slug: "",
  nombre: "",
  descripcion: "Chocolate belga",
  precio: 35,
  stock: 0,
  emoji: "🍪",
  bg: "linear-gradient(135deg,#FFE2E7,#FFC3C9)",
  imagen: "",
  tag: "",
  tagColor: "",
  tagText: "",
  esTemporada: false,
  activo: true,
  orden: 0,
};

/* Predefined gradient swatches for quick pick */
const GRADIENT_PRESETS = [
  { label: "Rosa",       value: "linear-gradient(135deg,#FFE2E7,#FFC3C9)" },
  { label: "Mantequilla",value: "linear-gradient(135deg,#FFE99B,#FFC9A5)" },
  { label: "Menta",      value: "linear-gradient(135deg,#B8E6D3,#D4E3A8)" },
  { label: "Durazno",    value: "linear-gradient(135deg,#FFC9A5,#FFA1AA)" },
  { label: "Lavanda",    value: "linear-gradient(135deg,#D9C4E8,#FFC3C9)" },
  { label: "Matcha",     value: "linear-gradient(135deg,#B8E6D3,#D9C4E8)" },
  { label: "Choco",      value: "linear-gradient(135deg,#6B3F2A,#D9A87B)" },
  { label: "Fresa",      value: "linear-gradient(135deg,#FFA1AA,#FF6F7D)" },
];

/* Helper: stock state badge */
function stockBadge(stock) {
  if (stock <= 0) return { label: "Agotado",   color: "#fff",          bg: "#9c2a44" };
  if (stock < 6)  return { label: "¡Pocas!",   color: "#6B4F1A",       bg: "#FFE99B" };
  return            { label: "Disponible", color: "#1D5A45",       bg: "#B8E6D3" };
}

/**
 * Redimensiona y comprime una imagen en el navegador antes de subirla.
 * Vercel tiene un límite de 4.5 MB en requests serverless, así que las
 * fotos de cámara (5-10 MB típicas) se rechazaban con 413. Esto las
 * reduce a max 800×800 px @ 85% JPEG (~100-300 KB típico) sin perder
 * calidad visible para una foto de producto.
 */
async function resizeImage(file, { maxSize = 800, quality = 0.85 } = {}) {
  return new Promise((resolve, reject) => {
    const img    = new Image();
    const reader = new FileReader();

    reader.onload  = (e) => { img.src = e.target.result; };
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));

    img.onload  = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      // Escalar manteniendo aspect ratio
      if (width > height && width > maxSize) {
        height = Math.round((height / width) * maxSize);
        width  = maxSize;
      } else if (height > maxSize) {
        width  = Math.round((width / height) * maxSize);
        height = maxSize;
      }
      canvas.width  = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      // Fondo blanco para PNGs con transparencia (de otra forma quedan negras al pasar a JPG)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("No se pudo comprimir la imagen"));
          const base = file.name.replace(/\.[^.]+$/, "") || "image";
          resolve(new File([blob], `${base}.jpg`, { type: "image/jpeg" }));
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => reject(new Error("Imagen inválida o corrupta"));

    reader.readAsDataURL(file);
  });
}

export default function GalletasAdminPage() {
  const { userToken } = useAuth();
  const authHeader = userToken ? { Authorization: `Bearer ${userToken}` } : {};

  const [sabores, setSabores]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState(null); // sabor being edited
  const [formData, setFormData]     = useState(NEW_FLAVOR);
  const [stockDelta, setStockDelta] = useState({});   // saborId -> "+25" or "-3"
  const [uploadBusy, setUploadBusy] = useState(false);

  /* ── Load all flavors (including inactive) ── */
  const loadSabores = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/galletaSabores?todos=true`, { headers: authHeader });
      setSabores(res.data.data || []);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudieron cargar los sabores" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userToken) loadSabores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userToken]);

  /* ── Open form for create ── */
  const openCreate = () => {
    setEditing(null);
    setFormData(NEW_FLAVOR);
    setShowForm(true);
  };

  /* ── Open form for edit ── */
  const openEdit = (s) => {
    setEditing(s);
    setFormData({
      slug:        s.slug,
      nombre:      s.nombre,
      descripcion: s.descripcion,
      precio:      s.precio,
      stock:       s.stock,
      emoji:       s.emoji,
      bg:          s.bg,
      imagen:      s.imagen || "",
      tag:         s.tag || "",
      tagColor:    s.tagColor || "",
      tagText:     s.tagText || "",
      esTemporada: !!s.esTemporada,
      activo:      s.activo !== false,
      orden:       s.orden || 0,
    });
    setShowForm(true);
  };

  /* ── Image upload to GCS via /upload ──
   * Comprime cualquier imagen > 800px / 1MB en el navegador antes de
   * subirla, para evitar el 413 que devuelve Vercel en archivos grandes.
   */
  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploadBusy(true);
    try {
      // Validar tipo
      if (!file.type.startsWith("image/")) {
        throw new Error("El archivo seleccionado no es una imagen");
      }

      // Redimensionar SIEMPRE: garantizamos archivos pequeños y consistentes
      const compressed = await resizeImage(file, { maxSize: 800, quality: 0.85 });

      const fd = new FormData();
      fd.append("files", compressed);
      const res = await axios.post(`${API_BASE}/upload`, fd, {
        headers: { ...authHeader, "Content-Type": "multipart/form-data" },
      });
      const url = res.data?.[0]?.fileUrl;
      if (url) setFormData((prev) => ({ ...prev, imagen: url }));
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "No se pudo subir la imagen";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    } finally {
      setUploadBusy(false);
    }
  };

  /* ── Save (create or update) ── */
  const handleSave = async (e) => {
    e?.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API_BASE}/galletaSabores/${editing._id}`, formData, { headers: authHeader });
      } else {
        await axios.post(`${API_BASE}/galletaSabores`, formData, { headers: authHeader });
      }
      Swal.fire({
        icon: "success",
        title: editing ? "Sabor actualizado" : "Sabor creado",
        timer: 1500,
        showConfirmButton: false,
        background: "#fff1f2", color: "#540027",
      });
      setShowForm(false);
      loadSabores();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || err.message,
      });
    }
  };

  /* ── Stock quick-adjust (delta) ── */
  const handleStockDelta = async (sabor) => {
    const raw = String(stockDelta[sabor._id] || "").trim();
    const delta = parseInt(raw, 10);
    if (!raw || isNaN(delta) || delta === 0) {
      return Swal.fire({ icon: "warning", title: "Ingresa un número (+ o −)", timer: 1500, showConfirmButton: false });
    }
    try {
      await axios.patch(
        `${API_BASE}/galletaSabores/${sabor._id}/stock`,
        { delta },
        { headers: authHeader }
      );
      setStockDelta((prev) => ({ ...prev, [sabor._id]: "" }));
      loadSabores();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || err.message });
    }
  };

  /* ── Toggle activo (soft delete) ── */
  const handleToggleActivo = async (sabor) => {
    try {
      await axios.put(
        `${API_BASE}/galletaSabores/${sabor._id}`,
        { activo: !sabor.activo },
        { headers: authHeader }
      );
      loadSabores();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || err.message });
    }
  };

  /* ── Permanent delete ── */
  const handleDelete = async (sabor) => {
    const result = await Swal.fire({
      title: "¿Eliminar permanentemente?",
      text: `"${sabor.nombre}" se borrará de la base de datos. Esto no afecta pedidos históricos.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF6F7D",
      cancelButtonColor: "#D6A7BC",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API_BASE}/galletaSabores/${sabor._id}?force=true`, { headers: authHeader });
      loadSabores();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || err.message });
    }
  };

  /* ── Slug auto-suggestion from nombre ── */
  const suggestSlug = (nombre) =>
    String(nombre || "")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40);

  return (
    <div className={`${nunito.className} flex min-h-screen`} style={{ background: "var(--bg-sunken)" }}>
      <Asideadmin />
      <div className="flex-1 flex flex-col">
        <NavbarAdmin />
        <main className="flex-1 p-6" style={{ maxWidth: 1400, margin: "0 auto", width: "100%" }}>

          {/* ── Header ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ fontSize: "0.7rem", color: "var(--rosa)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, marginBottom: 6 }}>Catálogo · Galletas NY</p>
              <h1 className={sofia.className} style={{ fontSize: "2.5rem", color: "var(--burdeos)", lineHeight: 1 }}>Sabores e inventario</h1>
              <p style={{ color: "var(--text-soft)", marginTop: 6, fontSize: "0.9rem" }}>
                Cuando un sabor llegue a 0 piezas se oculta automáticamente del cliente. Cuando quede con menos de 6, se muestra "¡Quedan pocas!"
              </p>
            </div>
            <button
              onClick={openCreate}
              style={{ padding: "12px 24px", borderRadius: "var(--r-pill)", background: "var(--burdeos)", color: "#fff", border: "none", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", boxShadow: "var(--shadow-sm)" }}
            >
              + Nuevo sabor
            </button>
          </div>

          {/* ── List ── */}
          {loading ? (
            <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "3rem", textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)" }}>Cargando…</p>
            </div>
          ) : sabores.length === 0 ? (
            <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "3rem", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🍪</div>
              <h2 className={sofia.className} style={{ fontSize: "1.5rem", color: "var(--burdeos)", marginBottom: 8 }}>Aún no hay sabores</h2>
              <p style={{ color: "var(--text-soft)", marginBottom: "1rem" }}>Da de alta tu primer sabor para que aparezca en la página de Galletas NY.</p>
              <button onClick={openCreate} style={{ padding: "10px 22px", borderRadius: "var(--r-pill)", background: "var(--burdeos)", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}>+ Crear sabor</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "1rem" }}>
              {sabores.map((s) => {
                const badge = stockBadge(s.stock);
                return (
                  <div key={s._id} style={{
                    background: "var(--bg-raised)",
                    borderRadius: "var(--r-xl)",
                    padding: "1.25rem",
                    boxShadow: "var(--shadow-sm)",
                    border: !s.activo ? "2px dashed var(--border-strong)" : "2px solid transparent",
                    opacity: s.activo ? 1 : 0.6,
                  }}>
                    {/* Top row */}
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                      {s.imagen ? (
                        <img src={s.imagen} alt={s.nombre} style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", flexShrink: 0 }}>{s.emoji}</div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontWeight: 800, color: "var(--burdeos)", fontSize: "1rem", marginBottom: 2, lineHeight: 1.2 }}>{s.nombre}</h3>
                        <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 6 }}><code>{s.slug}</code></p>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--burdeos)" }}>${s.precio}</span>
                          <span style={{ padding: "2px 8px", fontSize: "0.65rem", fontWeight: 700, background: badge.bg, color: badge.color, borderRadius: "var(--r-pill)" }}>{badge.label}</span>
                          {s.tag && <span style={{ padding: "2px 8px", fontSize: "0.65rem", fontWeight: 700, background: s.tagColor || "var(--rosa)", color: s.tagText || "#fff", borderRadius: "var(--r-pill)" }}>{s.tag}</span>}
                          {s.esTemporada && <span style={{ padding: "2px 8px", fontSize: "0.65rem", fontWeight: 700, background: "#FFE99B", color: "#6B4F1A", borderRadius: "var(--r-pill)" }}>Temporada</span>}
                          {!s.activo && <span style={{ padding: "2px 8px", fontSize: "0.65rem", fontWeight: 700, background: "var(--border-strong)", color: "#fff", borderRadius: "var(--r-pill)" }}>Oculto</span>}
                        </div>
                      </div>
                    </div>

                    {/* Stock row */}
                    <div style={{ background: "#fff1f2", borderRadius: "var(--r-md)", padding: "10px 12px", margin: "0.75rem 0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>Stock</span>
                        <span className={sofia.className} style={{ fontSize: "1.5rem", color: "var(--burdeos)" }}>{s.stock} pz</span>
                      </div>
                      <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                        <input
                          type="number"
                          placeholder="±"
                          value={stockDelta[s._id] || ""}
                          onChange={(e) => setStockDelta((prev) => ({ ...prev, [s._id]: e.target.value }))}
                          style={{ flex: 1, padding: "6px 10px", border: "1px solid var(--border-color)", borderRadius: "var(--r-md)", fontSize: "0.85rem", background: "#fff" }}
                        />
                        <button
                          onClick={() => handleStockDelta(s)}
                          style={{ padding: "6px 14px", background: "var(--burdeos)", color: "#fff", border: "none", borderRadius: "var(--r-md)", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}
                        >
                          Aplicar
                        </button>
                      </div>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 4 }}>
                        Ej: <code>+25</code> para sumar, <code>-3</code> para restar
                      </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(s)} style={{ flex: 1, padding: "8px 12px", background: "var(--bg-sunken)", color: "var(--burdeos)", border: "1px solid var(--border-color)", borderRadius: "var(--r-md)", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}>Editar</button>
                      <button onClick={() => handleToggleActivo(s)} style={{ flex: 1, padding: "8px 12px", background: s.activo ? "#FFE99B" : "#B8E6D3", color: s.activo ? "#6B4F1A" : "#1D5A45", border: "none", borderRadius: "var(--r-md)", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}>{s.activo ? "Ocultar" : "Activar"}</button>
                      <button onClick={() => handleDelete(s)} style={{ padding: "8px 12px", background: "#fff", color: "#9c2a44", border: "1px solid #f3c9d4", borderRadius: "var(--r-md)", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}>🗑</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
        <FooterDashboard />
      </div>

      {/* ── Modal: create / edit ── */}
      {showForm && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
          style={{ position: "fixed", inset: 0, background: "rgba(40,10,20,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", zIndex: 1000 }}
        >
          <form
            onSubmit={handleSave}
            style={{ background: "var(--bg-raised)", borderRadius: "var(--r-2xl)", maxWidth: 640, width: "100%", maxHeight: "92vh", overflow: "auto", padding: "1.75rem", boxShadow: "var(--shadow-xl)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 className={sofia.className} style={{ fontSize: "1.6rem", color: "var(--burdeos)" }}>{editing ? "Editar sabor" : "Nuevo sabor"}</h2>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: "transparent", border: "none", fontSize: "1.5rem", color: "var(--text-muted)", cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {/* Nombre */}
              <label style={{ gridColumn: "1 / -1" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-soft)", display: "block", marginBottom: 4 }}>Nombre *</span>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => {
                    const nombre = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      nombre,
                      // Auto-suggest slug only when creating
                      slug: editing ? prev.slug : suggestSlug(nombre),
                    }));
                  }}
                  style={inputStyle}
                />
              </label>

              {/* Slug */}
              <label>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-soft)", display: "block", marginBottom: 4 }}>Slug * {editing && <em style={{ color: "var(--text-muted)" }}>(no editable)</em>}</span>
                <input
                  type="text"
                  required
                  disabled={!!editing}
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: suggestSlug(e.target.value) }))}
                  style={{ ...inputStyle, fontFamily: "monospace", fontSize: "0.85rem" }}
                />
              </label>

              {/* Emoji */}
              <label>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-soft)", display: "block", marginBottom: 4 }}>Emoji</span>
                <input
                  type="text"
                  value={formData.emoji}
                  onChange={(e) => setFormData((prev) => ({ ...prev, emoji: e.target.value }))}
                  style={{ ...inputStyle, fontSize: "1.4rem", textAlign: "center" }}
                />
              </label>

              {/* Descripción */}
              <label style={{ gridColumn: "1 / -1" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-soft)", display: "block", marginBottom: 4 }}>Descripción</span>
                <input
                  type="text"
                  value={formData.descripcion}
                  onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
                  style={inputStyle}
                />
              </label>

              {/* Precio */}
              <label>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-soft)", display: "block", marginBottom: 4 }}>Precio (MXN) *</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.5"
                  value={formData.precio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, precio: parseFloat(e.target.value) || 0 }))}
                  style={inputStyle}
                />
              </label>

              {/* Stock inicial — solo en creación */}
              {!editing && (
                <label>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-soft)", display: "block", marginBottom: 4 }}>Stock inicial</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData((prev) => ({ ...prev, stock: parseInt(e.target.value, 10) || 0 }))}
                    style={inputStyle}
                  />
                </label>
              )}

              {/* Imagen */}
              <label style={{ gridColumn: "1 / -1" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-soft)", display: "block", marginBottom: 4 }}>Imagen del sabor (opcional — sino se usa el emoji)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files?.[0])}
                  style={{ ...inputStyle, padding: "8px 12px" }}
                />
                {uploadBusy && <p style={{ fontSize: "0.75rem", color: "var(--rosa)", marginTop: 4 }}>Subiendo…</p>}
                {formData.imagen && (
                  <div style={{ marginTop: 6, display: "flex", gap: 8, alignItems: "center" }}>
                    <img src={formData.imagen} alt="preview" style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }} />
                    <button type="button" onClick={() => setFormData((p) => ({ ...p, imagen: "" }))} style={{ background: "transparent", border: "none", color: "var(--rosa)", cursor: "pointer", fontSize: "0.78rem", fontWeight: 700 }}>Quitar imagen</button>
                  </div>
                )}
              </label>

              {/* Gradiente — visual */}
              <div style={{ gridColumn: "1 / -1" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-soft)", display: "block", marginBottom: 4 }}>Color del fondo</span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {GRADIENT_PRESETS.map((g) => (
                    <button
                      type="button"
                      key={g.label}
                      onClick={() => setFormData((p) => ({ ...p, bg: g.value }))}
                      style={{ width: 40, height: 40, borderRadius: "50%", background: g.value, border: formData.bg === g.value ? "3px solid var(--burdeos)" : "2px solid var(--border-color)", cursor: "pointer" }}
                      title={g.label}
                    />
                  ))}
                </div>
              </div>

              {/* Tag */}
              <label>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-soft)", display: "block", marginBottom: 4 }}>Etiqueta (opcional)</span>
                <input
                  type="text"
                  placeholder="Bestseller, Nuevo, Favorito…"
                  value={formData.tag}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tag: e.target.value }))}
                  style={inputStyle}
                />
              </label>

              {/* Orden */}
              <label>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-soft)", display: "block", marginBottom: 4 }}>Orden visual</span>
                <input
                  type="number"
                  value={formData.orden}
                  onChange={(e) => setFormData((prev) => ({ ...prev, orden: parseInt(e.target.value, 10) || 0 }))}
                  style={inputStyle}
                />
              </label>

              {/* Toggles */}
              <label style={{ display: "flex", alignItems: "center", gap: 8, gridColumn: "1 / -1", cursor: "pointer" }}>
                <input type="checkbox" checked={formData.esTemporada} onChange={(e) => setFormData((p) => ({ ...p, esTemporada: e.target.checked }))} />
                <span style={{ fontSize: "0.85rem", color: "var(--text-soft)" }}>Sabor de temporada / Edición limitada</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, gridColumn: "1 / -1", cursor: "pointer" }}>
                <input type="checkbox" checked={formData.activo} onChange={(e) => setFormData((p) => ({ ...p, activo: e.target.checked }))} />
                <span style={{ fontSize: "0.85rem", color: "var(--text-soft)" }}>Visible para el cliente</span>
              </label>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: "1.25rem", justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: "10px 20px", background: "transparent", color: "var(--text-soft)", border: "1px solid var(--border-color)", borderRadius: "var(--r-pill)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>Cancelar</button>
              <button type="submit" style={{ padding: "10px 24px", background: "var(--burdeos)", color: "#fff", border: "none", borderRadius: "var(--r-pill)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", boxShadow: "var(--shadow-sm)" }}>{editing ? "Guardar cambios" : "Crear sabor"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid var(--border-color)",
  borderRadius: "var(--r-md)",
  fontSize: "0.9rem",
  fontFamily: "var(--font-nunito)",
  background: "#fff",
  color: "var(--burdeos)",
  outline: "none",
  boxSizing: "border-box",
};
