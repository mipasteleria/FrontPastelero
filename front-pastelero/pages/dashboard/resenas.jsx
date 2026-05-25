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

function Stars({ rating }) {
  return (
    <span style={{ display: "inline-flex", gap: 1, lineHeight: 1, fontSize: 14 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ color: rating >= n ? "#E8B43A" : "#E5DCD2" }}>★</span>
      ))}
    </span>
  );
}

function fechaCorta(d) {
  if (!d) return "";
  const f = new Date(d);
  return `${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear()}`;
}

export default function DashboardResenas() {
  const { userToken } = useAuth();
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo]     = useState("");        // "" | "postre" | "galleta"
  const [filtroVisible, setFiltroVisible] = useState("");      // "" | "true" | "false"

  async function cargar() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtroTipo)    params.set("tipo", filtroTipo);
      if (filtroVisible) params.set("visible", filtroVisible);
      const r = await fetch(`${API_BASE}/resenas/admin?${params}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const j = await r.json();
      setResenas(j?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { cargar(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [filtroTipo, filtroVisible, userToken]);

  const toggleVisible = async (r) => {
    try {
      const res = await fetch(`${API_BASE}/resenas/${r._id}/visible`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
        body: JSON.stringify({ visible: !r.visible }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await cargar();
    } catch (e) {
      Swal.fire({ icon: "error", title: "No se pudo actualizar", background: "#fff1f2", color: "#540027" });
    }
  };

  const borrar = async (r) => {
    const c = await Swal.fire({
      icon: "warning",
      title: `¿Borrar reseña de ${r.usuario?.nombre || "este cliente"}?`,
      text: "Acción irreversible. También se borrará la imagen del bucket.",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      background: "#fff1f2",
      color: "#540027",
    });
    if (!c.isConfirmed) return;
    try {
      const res = await fetch(`${API_BASE}/resenas/${r._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await cargar();
    } catch (e) {
      Swal.fire({ icon: "error", title: "No se pudo borrar", background: "#fff1f2", color: "#540027" });
    }
  };

  const totales = {
    total: resenas.length,
    visibles: resenas.filter((r) => r.visible).length,
    ocultas: resenas.filter((r) => !r.visible).length,
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className={`text-text ${poppins.className} flex-grow w-full px-4 md:px-8 max-w-screen-2xl mx-auto`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
            <h1 className={`text-4xl ${sofia.className}`}>Reseñas</h1>
            <div className="flex gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
              <span><strong>{totales.total}</strong> totales</span>
              <span>·</span>
              <span><strong style={{ color: "#1D5A45" }}>{totales.visibles}</strong> visibles</span>
              <span>·</span>
              <span><strong style={{ color: "#9c2a44" }}>{totales.ocultas}</strong> ocultas</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 px-4 mb-2">
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="bg-gray-50 border border-secondary text-sm rounded-full px-4 py-2"
            >
              <option value="">Todos los tipos</option>
              <option value="postre">Postres</option>
              <option value="galleta">Galletas NY</option>
            </select>
            <select
              value={filtroVisible}
              onChange={(e) => setFiltroVisible(e.target.value)}
              className="bg-gray-50 border border-secondary text-sm rounded-full px-4 py-2"
            >
              <option value="">Todas</option>
              <option value="true">Solo visibles</option>
              <option value="false">Solo ocultas</option>
            </select>
          </div>

          <section className="px-4 mt-2 pb-10">
            {loading ? (
              <p>Cargando…</p>
            ) : resenas.length === 0 ? (
              <div className="border border-dashed border-secondary rounded-2xl p-8 text-center text-gray-600">
                No hay reseñas con esos filtros.
              </div>
            ) : (
              <div className="overflow-x-auto border border-secondary rounded-2xl bg-white">
                <table className="w-full text-sm">
                  <thead style={{ background: "#fff1f2", color: "#540027" }}>
                    <tr>
                      <th className="text-left p-3">Producto</th>
                      <th className="text-left p-3">Cliente</th>
                      <th className="text-left p-3">Rating</th>
                      <th className="text-left p-3">Texto</th>
                      <th className="text-center p-3">Foto</th>
                      <th className="text-center p-3">Fecha</th>
                      <th className="text-center p-3">Visible</th>
                      <th className="text-right p-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resenas.map((r) => (
                      <tr key={r._id} className="border-t border-secondary" style={{ opacity: r.visible ? 1 : 0.55 }}>
                        <td className="p-3">
                          <div className="font-semibold">{r.producto?.nombre || "—"}</div>
                          <div className="text-xs text-gray-500">{r.producto?.tipo === "galleta" ? "Galletas NY" : "Postre"} · {r.producto?.slug}</div>
                        </td>
                        <td className="p-3">
                          <div>{r.usuario?.nombre || "—"}</div>
                          <div className="text-xs text-gray-500">{r.usuario?.email}</div>
                        </td>
                        <td className="p-3"><Stars rating={r.rating} /></td>
                        <td className="p-3 max-w-md">
                          {r.texto ? (
                            <div style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", fontSize: "0.85rem", lineHeight: 1.5 }}>
                              {r.texto}
                            </div>
                          ) : <span className="text-gray-400 italic">(sin texto)</span>}
                        </td>
                        <td className="p-3 text-center">
                          {r.imagenUrl ? (
                            <a href={r.imagenUrl} target="_blank" rel="noopener noreferrer">
                              <div
                                style={{
                                  width: 48, height: 48, borderRadius: 8,
                                  background: `var(--crema) url(${r.imagenUrl}) center/cover no-repeat`,
                                  border: "1px solid var(--border-color)",
                                  display: "inline-block",
                                }}
                              />
                            </a>
                          ) : "—"}
                        </td>
                        <td className="p-3 text-center text-xs text-gray-600">{fechaCorta(r.createdAt)}</td>
                        <td className="p-3 text-center">
                          {r.visible ? (
                            <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700 }}>Visible</span>
                          ) : (
                            <span style={{ background: "#fee2e2", color: "#991b1b", padding: "2px 8px", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700 }}>Oculta</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => toggleVisible(r)}
                            className="px-3 py-1 rounded-full border border-secondary mr-2 hover:bg-rosa-4 text-xs"
                            style={{ color: "var(--burdeos)" }}
                          >
                            {r.visible ? "Ocultar" : "Mostrar"}
                          </button>
                          <button
                            type="button"
                            onClick={() => borrar(r)}
                            className="px-3 py-1 rounded-full text-white hover:opacity-90 text-xs"
                            style={{ background: "#dc2626" }}
                          >
                            Borrar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}
