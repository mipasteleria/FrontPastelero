import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Swal from "sweetalert2";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { useAuth } from "@/src/context";
import { subirImagen } from "@/src/lib/imageUpload";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const inp = "border rounded px-3 py-2 w-full text-sm";
const lbl = "block text-xs font-semibold mb-1 text-gray-600 mt-2";

export default function CursoEditor() {
  const router = useRouter();
  const { id } = router.query;
  const { userToken } = useAuth();
  const authHeader = userToken ? { Authorization: `Bearer ${userToken}` } : {};

  const [curso, setCurso] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState({});   // lid → % de subida
  const pollers = useRef({});

  const recargar = async () => {
    if (!id || !userToken) return;
    const r = await fetch(`${API_BASE}/cursos/admin/${id}`, { headers: authHeader });
    const j = await r.json();
    setCurso(j.data);
  };
  useEffect(() => { recargar(); /* eslint-disable-line */ }, [id, userToken]);

  // Sondear estado de los videos "procesando" cada 15 s.
  useEffect(() => {
    if (!curso) return;
    for (const lec of curso.lecciones || []) {
      const lid = lec._id;
      if (lec.video?.estado === "procesando" && !pollers.current[lid]) {
        pollers.current[lid] = setInterval(async () => {
          try {
            const r = await fetch(`${API_BASE}/cursos/${id}/lecciones/${lid}/estado-video`, { headers: authHeader });
            const j = await r.json();
            if (j.data?.estado !== "procesando") {
              clearInterval(pollers.current[lid]);
              delete pollers.current[lid];
              recargar();
            }
          } catch {}
        }, 15000);
      }
    }
    return () => { Object.values(pollers.current).forEach(clearInterval); pollers.current = {}; };
    // eslint-disable-next-line
  }, [curso?.lecciones?.map((l) => l.video?.estado).join(",")]);

  const set = (k, v) => setCurso((c) => ({ ...c, [k]: v }));

  const guardar = async () => {
    setGuardando(true);
    try {
      const r = await fetch(`${API_BASE}/cursos/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({
          titulo: curso.titulo, slug: curso.slug, descripcion: curso.descripcion,
          precio: Number(curso.precio) || 0, thumbnailUrl: curso.thumbnailUrl,
          modalidad: curso.modalidad, fechaClase: curso.fechaClase, lugar: curso.lugar,
          cupo: Number(curso.cupo) || 0, activo: curso.activo,
        }),
      });
      if (!r.ok) throw new Error((await r.json()).message || "Error");
      Swal.fire({ icon: "success", title: "Guardado", timer: 1300, showConfirmButton: false, background: "#fff1f2", color: "#540027" });
    } catch (e) { Swal.fire({ icon: "error", title: e.message }); }
    finally { setGuardando(false); }
  };

  const agregarLeccion = async () => {
    const { value: titulo } = await Swal.fire({ title: "Nueva lección", input: "text", inputPlaceholder: "Título", showCancelButton: true, confirmButtonColor: "#540027" });
    if (!titulo) return;
    await fetch(`${API_BASE}/cursos/${id}/lecciones`, { method: "POST", headers: { "Content-Type": "application/json", ...authHeader }, body: JSON.stringify({ titulo }) });
    recargar();
  };

  const eliminarLeccion = async (lid) => {
    const ok = await Swal.fire({ title: "¿Eliminar lección?", icon: "warning", showCancelButton: true, confirmButtonColor: "#FF6F7D" });
    if (!ok.isConfirmed) return;
    await fetch(`${API_BASE}/cursos/${id}/lecciones/${lid}`, { method: "DELETE", headers: authHeader });
    recargar();
  };

  const guardarLeccion = async (lid, patch) => {
    await fetch(`${API_BASE}/cursos/${id}/lecciones/${lid}`, {
      method: "PUT", headers: { "Content-Type": "application/json", ...authHeader }, body: JSON.stringify(patch),
    });
    recargar();
  };

  // ── Subir video: URL firmada → PUT directo a GCS → transcodificar ──
  const subirVideo = async (lid, file) => {
    if (!file) return;
    try {
      setSubiendo((s) => ({ ...s, [lid]: 0 }));
      const r = await fetch(`${API_BASE}/cursos/upload-url`, {
        method: "POST", headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ fileName: file.name, contentType: file.type || "video/mp4" }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "No se pudo preparar la subida");

      // Subida directa con progreso (XMLHttpRequest para onprogress).
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", j.uploadUrl);
        xhr.setRequestHeader("Content-Type", j.contentType);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setSubiendo((s) => ({ ...s, [lid]: Math.round((e.loaded / e.total) * 100) }));
        };
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Subida falló (${xhr.status})`)));
        xhr.onerror = () => reject(new Error("Error de red subiendo el video"));
        xhr.send(file);
      });

      // Iniciar transcodificación.
      const t = await fetch(`${API_BASE}/cursos/${id}/lecciones/${lid}/transcodificar`, {
        method: "POST", headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ gcsPath: j.gcsPath }),
      });
      if (!t.ok) throw new Error((await t.json()).message || "No se pudo iniciar la transcodificación");
      Swal.fire({ icon: "success", title: "Video subido — procesando…", text: "HLS + DASH en 3 tamaños. Esto puede tardar varios minutos.", timer: 3000, showConfirmButton: false, background: "#fff1f2", color: "#540027" });
      recargar();
    } catch (e) {
      Swal.fire({ icon: "error", title: e.message });
    } finally {
      setSubiendo((s) => { const n = { ...s }; delete n[lid]; return n; });
    }
  };

  const subirThumb = async (lid, file) => {
    try {
      const { fileUrl } = await subirImagen(file, API_BASE, userToken);
      await guardarLeccion(lid, { video: { thumbnailUrl: fileUrl } });
    } catch (e) { Swal.fire({ icon: "error", title: e.message }); }
  };

  if (!curso) return <div className={poppins.className}><NavbarAdmin /><div className="flex mt-16"><Asideadmin /><main className="p-8">Cargando…</main></div></div>;

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 md:px-8 pb-24 md:pb-8">
          <Link href="/dashboard/cursos" className="text-xs text-accent hover:underline">← Volver a cursos</Link>
          <h1 className={`text-3xl py-3 ${sofia.className}`}>{curso.titulo}</h1>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Datos del curso */}
            <section className="bg-white shadow rounded-lg p-5">
              <h2 className="font-bold text-lg mb-2" style={{ color: "var(--burdeos)" }}>Datos del curso</h2>
              <label className={lbl}>Título</label>
              <input className={inp} value={curso.titulo} onChange={(e) => set("titulo", e.target.value)} />
              <label className={lbl}>Slug</label>
              <input className={inp} value={curso.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} />
              <label className={lbl}>Descripción</label>
              <textarea className={inp} rows={3} value={curso.descripcion} onChange={(e) => set("descripcion", e.target.value)} />
              <label className={lbl}>Precio (MXN)</label>
              <input type="number" className={inp} value={curso.precio} onChange={(e) => set("precio", e.target.value)} />

              <label className={lbl}>Modalidad</label>
              <select className={inp} value={curso.modalidad} onChange={(e) => set("modalidad", e.target.value)}>
                <option value="en-linea">En línea (pre-grabado)</option>
                <option value="presencial">Presencial (se graba en clase)</option>
              </select>
              {curso.modalidad === "presencial" && (
                <>
                  <label className={lbl}>Fecha de la clase</label>
                  <input type="date" className={inp} value={curso.fechaClase ? String(curso.fechaClase).slice(0, 10) : ""} onChange={(e) => set("fechaClase", e.target.value)} />
                  <label className={lbl}>Lugar</label>
                  <input className={inp} value={curso.lugar} onChange={(e) => set("lugar", e.target.value)} />
                  <label className={lbl}>Cupo</label>
                  <input type="number" className={inp} value={curso.cupo} onChange={(e) => set("cupo", e.target.value)} />
                </>
              )}

              <label className={lbl}>Portada del curso</label>
              <div className="flex items-center gap-2">
                {curso.thumbnailUrl && <img src={curso.thumbnailUrl} alt="" className="w-16 h-16 object-cover rounded" />}
                <label className="cursor-pointer text-xs px-3 py-2 rounded border border-dashed border-gray-400 text-gray-600 hover:bg-gray-50">
                  {curso.thumbnailUrl ? "Cambiar" : "Subir"}
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    try { const { fileUrl } = await subirImagen(f, API_BASE, userToken); set("thumbnailUrl", fileUrl); }
                    catch (err) { Swal.fire({ icon: "error", title: err.message }); }
                  }} />
                </label>
              </div>

              <label className="flex items-center gap-2 mt-3 text-sm">
                <input type="checkbox" checked={!!curso.activo} onChange={(e) => set("activo", e.target.checked)} />
                Publicado (visible en /cursos)
              </label>

              <button onClick={guardar} disabled={guardando} className="mt-4 px-4 py-2 rounded text-sm font-semibold text-white w-full disabled:opacity-50" style={{ background: "var(--burdeos)" }}>
                {guardando ? "Guardando…" : "Guardar curso"}
              </button>
            </section>

            {/* Lecciones */}
            <section className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg" style={{ color: "var(--burdeos)" }}>Lecciones ({(curso.lecciones || []).length})</h2>
                <button onClick={agregarLeccion} className="px-3 py-1.5 rounded text-xs font-semibold text-white" style={{ background: "var(--accent, #6FC9A8)" }}>+ Agregar lección</button>
              </div>

              {(curso.lecciones || []).map((lec) => (
                <Leccion key={lec._id} lec={lec} subiendoPct={subiendo[lec._id]}
                  onVideo={(f) => subirVideo(lec._id, f)}
                  onThumb={(f) => subirThumb(lec._id, f)}
                  onSave={(patch) => guardarLeccion(lec._id, patch)}
                  onDelete={() => eliminarLeccion(lec._id)} />
              ))}
              {(curso.lecciones || []).length === 0 && (
                <div className="bg-white shadow rounded p-6 text-center text-gray-400 text-sm">Agrega la primera lección para subir su video.</div>
              )}
            </section>
          </div>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}

const ESTADO_VIDEO = {
  sin_video: { txt: "Sin video", cls: "bg-gray-100 text-gray-500" },
  procesando: { txt: "⏳ Procesando…", cls: "bg-amber-100 text-amber-700" },
  listo: { txt: "✓ Listo (HLS + DASH)", cls: "bg-green-100 text-green-700" },
  error: { txt: "✕ Error", cls: "bg-red-100 text-red-700" },
};

function Leccion({ lec, subiendoPct, onVideo, onThumb, onSave, onDelete }) {
  const [titulo, setTitulo] = useState(lec.titulo);
  const [caps, setCaps] = useState(lec.video?.capitulos || []);
  const est = ESTADO_VIDEO[lec.video?.estado || "sin_video"];

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <input className="border rounded px-2 py-1.5 text-sm font-semibold flex-grow" value={titulo}
          onChange={(e) => setTitulo(e.target.value)} onBlur={() => titulo !== lec.titulo && onSave({ titulo })} />
        <span className={`text-xs font-semibold px-2 py-1 rounded ${est.cls}`}>{est.txt}</span>
        <button onClick={onDelete} className="text-red-400 text-xs">✕</button>
      </div>
      {lec.video?.estado === "error" && <p className="text-xs text-red-500 mt-1">{lec.video.errorMsg}</p>}

      {/* Subida de video */}
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        {subiendoPct != null ? (
          <div className="flex-grow">
            <div className="h-2 bg-gray-100 rounded overflow-hidden"><div className="h-2 rounded" style={{ width: `${subiendoPct}%`, background: "var(--rosa)" }} /></div>
            <p className="text-[11px] text-gray-500 mt-1">Subiendo video… {subiendoPct}%</p>
          </div>
        ) : (
          <label className="cursor-pointer text-xs px-3 py-2 rounded border border-dashed border-gray-400 text-gray-600 hover:bg-gray-50">
            {lec.video?.estado === "listo" ? "🎬 Reemplazar video" : "🎬 Subir video"}
            <input type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; onVideo(f); }} />
          </label>
        )}

        {/* Thumbnail de la lección */}
        <div className="flex items-center gap-2">
          {lec.video?.thumbnailUrl && <img src={lec.video.thumbnailUrl} alt="" className="w-12 h-8 object-cover rounded" />}
          <label className="cursor-pointer text-xs px-3 py-2 rounded border border-dashed border-gray-400 text-gray-600 hover:bg-gray-50">
            🖼 Thumbnail
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; f && onThumb(f); }} />
          </label>
        </div>
      </div>

      {/* Capítulos (saltos del player) */}
      <details className="mt-3">
        <summary className="text-xs font-semibold text-gray-600 cursor-pointer">Capítulos / saltos ({caps.length})</summary>
        <div className="mt-2 space-y-1.5">
          {caps.map((c, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input className="border rounded px-2 py-1 text-xs flex-grow" placeholder="Título del capítulo" value={c.titulo}
                onChange={(e) => setCaps(caps.map((x, idx) => idx === i ? { ...x, titulo: e.target.value } : x))} />
              <input type="number" min="0" className="border rounded px-2 py-1 text-xs w-24" placeholder="Segundos" value={c.segundos}
                onChange={(e) => setCaps(caps.map((x, idx) => idx === i ? { ...x, segundos: Number(e.target.value) || 0 } : x))} />
              <button onClick={() => setCaps(caps.filter((_, idx) => idx !== i))} className="text-red-400 text-xs">✕</button>
            </div>
          ))}
          <div className="flex gap-2">
            <button onClick={() => setCaps([...caps, { titulo: "", segundos: 0 }])} className="text-xs text-accent font-semibold">+ Agregar capítulo</button>
            <button onClick={() => onSave({ video: { capitulos: caps } })} className="text-xs font-semibold px-2 py-1 rounded text-white" style={{ background: "var(--burdeos)" }}>Guardar capítulos</button>
          </div>
        </div>
      </details>
    </div>
  );
}
