import React, { useEffect, useState } from "react";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import Swal from "sweetalert2";
import { useAuth } from "@/src/context";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const CATEGORIAS = {
  decoracion: "Decoración",
  relleno: "Relleno",
  cobertura: "Cobertura",
  modelado: "Modelado",
  flores: "Flores",
  impresion: "Impresión",
  otro: "Otro",
};

export default function TecnicasCreativas() {
  const [tecnicas, setTecnicas] = useState([]);
  const { userToken } = useAuth();
  const authHeader = userToken ? { Authorization: `Bearer ${userToken}` } : {};

  useEffect(() => {
    fetch(`${API_BASE}/tecnicas?todas=true`, { headers: authHeader })
      .then((r) => r.json())
      .then((d) => setTecnicas(d.data ?? []))
      .catch(console.error);
  }, [userToken]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Se eliminará esta técnica de manera permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF6F7D",
      cancelButtonColor: "#D6A7BC",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE}/tecnicas/${id}`, {
        method: "DELETE",
        headers: authHeader,
      });
      if (!res.ok) throw new Error("Error al eliminar");
      setTecnicas((prev) => prev.filter((t) => t._id !== id));
      Swal.fire({
        title: "Eliminada",
        icon: "success",
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff1f2",
        color: "#540027",
      });
    } catch {
      Swal.fire({ title: "Error", icon: "error", timer: 1800, showConfirmButton: false });
    }
  };

  const toggleActivo = async (tecnica) => {
    try {
      const res = await fetch(`${API_BASE}/tecnicas/${tecnica._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ activo: !tecnica.activo }),
      });
      if (!res.ok) throw new Error();
      const { data } = await res.json();
      setTecnicas((prev) => prev.map((t) => (t._id === data._id ? data : t)));
    } catch {
      Swal.fire({ title: "Error al actualizar", icon: "error", timer: 1800, showConfirmButton: false });
    }
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className={`text-text ${poppins.className} flex-grow w-3/4 max-w-screen-lg mx-auto`}>
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Técnicas Creativas</h1>
          <div className="overflow-x-auto shadow-md rounded-lg p-4 m-4">
            <table className="w-full text-sm text-left text-text">
              <thead className="text-xs uppercase border-b border-secondary">
                <tr>
                  {["Nombre", "Categoría", "Costo base", "Tiempo (h)", "$/porción", "Activa", "Acciones"].map((h) => (
                    <th key={h} className="px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tecnicas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-6 text-center text-gray-400">
                      Sin técnicas creativas. Agrega la primera.
                    </td>
                  </tr>
                ) : (
                  tecnicas.map((t) => (
                    <tr key={t._id} className="border-b border-secondary">
                      <td className="px-4 py-3 font-medium">{t.nombre}</td>
                      <td className="px-4 py-3">{CATEGORIAS[t.categoria] ?? t.categoria}</td>
                      <td className="px-4 py-3">${t.costoBase.toFixed(2)}</td>
                      <td className="px-4 py-3">{t.tiempoHoras}</td>
                      <td className="px-4 py-3">${t.escalaPorPorcion.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActivo(t)}
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            t.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {t.activo ? "Sí" : "No"}
                        </button>
                      </td>
                      <td className="px-4 py-3 flex gap-3">
                        <Link href={`/dashboard/tecnicas/editar/${t._id}`}>
                          <button className="text-accent hover:underline text-xs">Editar</button>
                        </Link>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end m-4 mb-16">
            <Link href="/dashboard/tecnicas/agregar">
              <button className="shadow-md text-text bg-primary hover:bg-accent hover:text-white font-medium rounded-lg text-sm px-8 py-2.5">
                Agregar técnica
              </button>
            </Link>
          </div>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}
