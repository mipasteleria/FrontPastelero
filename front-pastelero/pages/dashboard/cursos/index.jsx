import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { useAuth } from "@/src/context";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CursosAdmin() {
  const { userToken } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const authHeader = userToken ? { Authorization: `Bearer ${userToken}` } : {};

  const recargar = () => {
    if (!userToken) return;
    fetch(`${API_BASE}/cursos/admin`, { headers: authHeader })
      .then((r) => r.json()).then((j) => setCursos(j.data || [])).finally(() => setCargando(false));
  };
  useEffect(recargar, [userToken]); // eslint-disable-line

  const crear = async () => {
    const { value: titulo } = await Swal.fire({
      title: "Nuevo curso", input: "text", inputPlaceholder: "Título del curso",
      showCancelButton: true, confirmButtonColor: "#540027", confirmButtonText: "Crear",
    });
    if (!titulo) return;
    const slug = titulo.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const r = await fetch(`${API_BASE}/cursos`, {
      method: "POST", headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({ titulo, slug }),
    });
    const j = await r.json();
    if (r.ok) window.location.href = `/dashboard/cursos/${j.data._id}`;
    else Swal.fire({ icon: "error", title: j.message });
  };

  const eliminar = async (c) => {
    const ok = await Swal.fire({ title: "¿Eliminar curso?", text: c.titulo, icon: "warning", showCancelButton: true, confirmButtonColor: "#FF6F7D", confirmButtonText: "Sí, eliminar" });
    if (!ok.isConfirmed) return;
    await fetch(`${API_BASE}/cursos/${c._id}`, { method: "DELETE", headers: authHeader });
    recargar();
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 md:px-8 pb-24 md:pb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
            <h1 className={`text-4xl ${sofia.className}`}>Cursos</h1>
            <button onClick={crear} className="px-4 py-2 rounded text-sm font-semibold text-white shadow-md" style={{ background: "var(--burdeos)" }}>
              + Nuevo curso
            </button>
          </div>
          <p className="text-sm text-gray-500 -mt-2 mb-4">
            En línea (video pre-grabado) o presencial (grabado en clase). Ambos con video y descargables.
          </p>

          {cargando ? <p className="text-gray-400">Cargando…</p> : cursos.length === 0 ? (
            <div className="bg-white shadow rounded p-8 text-center text-gray-400">Aún no hay cursos. Crea el primero.</div>
          ) : (
            <div className="shadow-md rounded-lg overflow-x-auto bg-white">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase border-b border-secondary">
                  <tr>
                    <th className="px-4 py-3">Curso</th>
                    <th className="px-4 py-3">Modalidad</th>
                    <th className="px-4 py-3">Precio</th>
                    <th className="px-4 py-3">Lecciones</th>
                    <th className="px-4 py-3">Publicado</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cursos.map((c) => (
                    <tr key={c._id} className="border-b border-secondary">
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          {c.thumbnailUrl && <img src={c.thumbnailUrl} alt="" className="w-10 h-10 object-cover rounded" />}
                          <div>
                            <div>{c.titulo}</div>
                            <div className="text-xs text-gray-400">{c.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{c.modalidad === "presencial" ? "Presencial" : "En línea"}</td>
                      <td className="px-4 py-3">${Number(c.precio || 0).toLocaleString("es-MX")}</td>
                      <td className="px-4 py-3">{(c.lecciones || []).length}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${c.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {c.activo ? "Sí" : "Borrador"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <Link href={`/dashboard/cursos/${c._id}`} className="text-accent hover:underline text-xs font-semibold">Editar</Link>
                          <button onClick={() => eliminar(c)} className="text-red-500 text-xs font-semibold">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}
