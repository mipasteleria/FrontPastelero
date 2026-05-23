import { useEffect, useState } from "react";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import Swal from "sweetalert2";
import { useAuth } from "@/src/context";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const HREF_SUGERIDOS = [
  { value: "/enduser/galletas-ny",    label: "Galletas NY" },
  { value: "/enduser/pastel-vintage", label: "Pastel Vintage" },
  { value: "/cotizacion",             label: "Cotización personalizada" },
  { value: "/cursos",                 label: "Cursos" },
];

// Lado mayor máximo (px) tras redimensionar. 1200 es suficiente para que
// la imagen se vea nítida en el círculo del hero (donde se renderiza a
// ~400px), y mantiene el archivo bajo ~500KB típicamente — muy por
// debajo del límite de body de Vercel (~4.5 MB) que estaba truncando
// los PNG originales y haciendo que se vieran cortados.
const MAX_LADO_PX = 1200;

/**
 * Redimensiona un File de imagen al lado mayor MAX_LADO_PX manteniendo
 * proporción y transparencia. Devuelve un File PNG nuevo. Si la imagen
 * ya es menor que MAX_LADO_PX en ambas dimensiones, igual la re-encodea
 * para garantizar que el archivo sea PNG limpio (sin metadata pesada).
 */
function redimensionarImagen(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const escala = Math.min(1, MAX_LADO_PX / Math.max(w, h));
      const targetW = Math.round(w * escala);
      const targetH = Math.round(h * escala);
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, targetW, targetH);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("No se pudo procesar la imagen"));
          const nombreSinExt = file.name.replace(/\.[^.]+$/, "") || "imagen";
          resolve(new File([blob], `${nombreSinExt}.png`, { type: "image/png" }));
        },
        "image/png"
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen"));
    };
    img.src = url;
  });
}

export default function HomeConfig() {
  const { userToken } = useAuth();
  const [cfg, setCfg] = useState({
    imagenHeroUrl: "",
    imagenHeroFileName: "",
    favoritoSemanaHref: "/enduser/galletas-ny",
    nuevoSaborHref:     "/enduser/galletas-ny",
  });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);

  /* ── Load current config ── */
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/home-config`);
        const j = await r.json();
        if (j?.data) setCfg((prev) => ({ ...prev, ...j.data }));
      } catch (e) {
        console.error("Error cargando home-config:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── Save hrefs ── */
  const guardarHrefs = async () => {
    setSaving(true);
    try {
      const r = await fetch(`${API_BASE}/home-config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
        body: JSON.stringify({
          favoritoSemanaHref: cfg.favoritoSemanaHref,
          nuevoSaborHref:     cfg.nuevoSaborHref,
        }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      setCfg((prev) => ({ ...prev, ...j.data }));
      Swal.fire({ icon: "success", title: "Guardado", timer: 1500, showConfirmButton: false, background: "#fff1f2", color: "#540027" });
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: "error", title: "No se pudo guardar", text: String(e.message || e), background: "#fff1f2", color: "#540027" });
    } finally {
      setSaving(false);
    }
  };

  /* ── Upload image + persist URL ── */
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      Swal.fire({ icon: "warning", title: "Debe ser una imagen (PNG recomendado, sin fondo)", background: "#fff1f2", color: "#540027" });
      return;
    }
    setUploading(true);
    try {
      // 1) Redimensionar en cliente. Sin esto, un PNG original de >4.5MB
      //    se trunca en el límite de body de Vercel y llega corrupto al
      //    back → la imagen final se ve cortada en una línea horizontal
      //    recta. Con redimensionar a max 1200px el archivo final pesa
      //    ~200-500KB y nunca topa con el límite.
      const fileResized = await redimensionarImagen(file);

      // 2) Subir a GCS via POST /upload
      const fd = new FormData();
      fd.append("files", fileResized);
      const upRes = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${userToken}` },
        body: fd,
      });
      if (!upRes.ok) throw new Error("Error al subir el archivo");
      const upJson = await upRes.json();
      const uploaded = Array.isArray(upJson) ? upJson[0] : upJson;
      if (!uploaded?.fileUrl) throw new Error("Respuesta de upload incompleta");

      // 3) Guardar la URL en home-config
      const cfgRes = await fetch(`${API_BASE}/home-config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
        body: JSON.stringify({
          imagenHeroUrl:      uploaded.fileUrl,
          imagenHeroFileName: uploaded.fileName || "",
        }),
      });
      if (!cfgRes.ok) throw new Error("Error al guardar la imagen en la configuración");
      const cfgJson = await cfgRes.json();
      setCfg((prev) => ({ ...prev, ...cfgJson.data }));
      Swal.fire({ icon: "success", title: "Imagen actualizada", timer: 1500, showConfirmButton: false, background: "#fff1f2", color: "#540027" });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "No se pudo subir", text: String(err.message || err), background: "#fff1f2", color: "#540027" });
    } finally {
      setUploading(false);
      e.target.value = ""; // permite re-subir el mismo archivo
    }
  };

  /* ── Remove image ── */
  const quitarImagen = async () => {
    const confirm = await Swal.fire({
      icon: "question",
      title: "¿Quitar la imagen del hero?",
      text: "Volverá a mostrarse el emoji 🎂 mientras no haya nueva imagen.",
      showCancelButton: true,
      confirmButtonText: "Sí, quitar",
      cancelButtonText: "Cancelar",
      background: "#fff1f2",
      color: "#540027",
    });
    if (!confirm.isConfirmed) return;
    setSaving(true);
    try {
      const r = await fetch(`${API_BASE}/home-config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
        body: JSON.stringify({ imagenHeroUrl: "", imagenHeroFileName: "" }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      setCfg((prev) => ({ ...prev, ...j.data }));
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: "error", title: "No se pudo quitar", background: "#fff1f2", color: "#540027" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className="flex-grow md:w-3/4 mb-14 max-w-screen-lg mx-auto">
          <h1 className={`text-4xl p-6 ${sofia.className}`}>Configuración del Home</h1>

          {loading ? (
            <p className="px-6">Cargando…</p>
          ) : (
            <div className="space-y-8 px-6 pb-10">

              {/* ── Imagen del hero ────────────────────────── */}
              <section className="border border-secondary rounded-2xl p-6 bg-white">
                <h2 className={`text-2xl mb-2 ${sofia.className}`}>Imagen del hero</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Reemplaza el emoji 🎂 que aparece en el círculo central del home. Sube un PNG con fondo transparente para que se vea el fondo de la animación.
                </p>

                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div
                    style={{
                      width: 180, height: 180, borderRadius: "50%",
                      background: "var(--crema, #FFF6EC)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "1px dashed #ddd", overflow: "hidden",
                    }}
                  >
                    {cfg.imagenHeroUrl ? (
                      // Mismo approach que en pages/index.jsx: <div> con
                      // background-image en lugar de <img>, para evitar el
                      // bug donde Tailwind preflight (`img { height: auto }`)
                      // ignora el maxHeight y la imagen se ve cortada.
                      <div
                        role="img"
                        aria-label="Imagen del hero"
                        style={{
                          width: "80%",
                          height: "80%",
                          backgroundImage: `url(${cfg.imagenHeroUrl})`,
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: "4rem" }}>🎂</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-burdeos text-white font-bold cursor-pointer hover:opacity-90 transition" style={{ background: "var(--burdeos)" }}>
                      <input type="file" accept="image/png,image/webp,image/jpeg" onChange={handleFileChange} disabled={uploading || saving} style={{ display: "none" }} />
                      {uploading ? "Subiendo…" : (cfg.imagenHeroUrl ? "Reemplazar imagen" : "Subir imagen")}
                    </label>
                    {cfg.imagenHeroUrl && (
                      <button
                        onClick={quitarImagen}
                        disabled={uploading || saving}
                        className="ml-3 px-4 py-2 rounded-full font-bold border border-secondary hover:bg-rosa-4 transition"
                        style={{ color: "var(--burdeos)" }}
                      >
                        Quitar imagen
                      </button>
                    )}
                    <p className="text-xs text-gray-500">PNG (recomendado), WEBP o JPG. Se redimensiona automáticamente a 1200 px de lado mayor para optimizar.</p>
                  </div>
                </div>
              </section>

              {/* ── Favorito de la semana ─────────────────── */}
              <section className="border border-secondary rounded-2xl p-6 bg-white">
                <h2 className={`text-2xl mb-2 ${sofia.className}`}>Favorito de la semana</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Cuando el cliente da click en el chip "Favorito de la semana" del home, lo llevamos a esta URL. Útil para resaltar un producto en particular.
                </p>
                <label className="block mb-2 text-sm font-medium">URL destino</label>
                <input
                  type="text"
                  value={cfg.favoritoSemanaHref}
                  onChange={(e) => setCfg((p) => ({ ...p, favoritoSemanaHref: e.target.value }))}
                  className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  placeholder="/enduser/galletas-ny"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Sugerencias:{" "}
                  {HREF_SUGERIDOS.map((s, i) => (
                    <button
                      key={s.value}
                      onClick={() => setCfg((p) => ({ ...p, favoritoSemanaHref: s.value }))}
                      type="button"
                      className="underline hover:no-underline"
                      style={{ color: "var(--burdeos)", marginRight: 10 }}
                    >
                      {s.label}
                    </button>
                  ))}
                </p>
              </section>

              {/* ── Nuevo sabor ───────────────────────────── */}
              <section className="border border-secondary rounded-2xl p-6 bg-white">
                <h2 className={`text-2xl mb-2 ${sofia.className}`}>Nuevo sabor</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Destino del chip "Nuevo sabor" del home.
                </p>
                <label className="block mb-2 text-sm font-medium">URL destino</label>
                <input
                  type="text"
                  value={cfg.nuevoSaborHref}
                  onChange={(e) => setCfg((p) => ({ ...p, nuevoSaborHref: e.target.value }))}
                  className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  placeholder="/enduser/galletas-ny"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Sugerencias:{" "}
                  {HREF_SUGERIDOS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setCfg((p) => ({ ...p, nuevoSaborHref: s.value }))}
                      type="button"
                      className="underline hover:no-underline"
                      style={{ color: "var(--burdeos)", marginRight: 10 }}
                    >
                      {s.label}
                    </button>
                  ))}
                </p>
              </section>

              <button
                onClick={guardarHrefs}
                disabled={saving || uploading}
                className="px-6 py-3 rounded-full text-white font-bold transition disabled:opacity-50"
                style={{ background: "var(--burdeos)" }}
              >
                {saving ? "Guardando…" : "Guardar URLs"}
              </button>
            </div>
          )}
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}
