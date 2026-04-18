import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Productos() {
  const [productos, setProductos] = useState([]);

  const cargar = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/productos?todos=true`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    setProductos(json.data || []);
  };

  useEffect(() => { cargar(); }, []);

  const toggleActivo = async (p) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_BASE}/productos/${p._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ activo: !p.activo }),
    });
    cargar();
  };

  const eliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#fff1f2",
      color: "#540027",
    });
    if (!result.isConfirmed) return;
    const token = localStorage.getItem("token");
    await fetch(`${API_BASE}/productos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    cargar();
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin />
      <div className="flex mt-16">
        <Asideadmin />
        <main className="flex-grow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className={`text-3xl ${sofia.className}`}>Productos del Home</h1>
            <Link
              href="/dashboard/productos/agregar"
              className="bg-primary text-text font-semibold px-4 py-2 rounded-lg hover:bg-accent hover:text-white transition-colors"
            >
              + Agregar
            </Link>
          </div>
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full text-sm text-center">
              <thead className="text-xs uppercase bg-rose-50">
                <tr>
                  {["Orden", "Nombre", "Descripción", "Fotos", "Activo", "Acciones"].map((h) => (
                    <th key={h} className="px-4 py-3 border-b border-secondary">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p._id} className="border-b border-secondary hover:bg-rose-50">
                    <td className="px-4 py-3">{p.orden}</td>
                    <td className="px-4 py-3 font-semibold">{p.nombre}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{p.descripcion || "—"}</td>
                    <td className="px-4 py-3">{p.fotos?.length || 0}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActivo(p)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          p.activo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.activo ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td className="px-4 py-3 flex gap-2 justify-center">
                      <Link
                        href={`/dashboard/productos/editar/${p._id}`}
                        className="bg-rose-200 text-text px-3 py-1 rounded-lg hover:bg-accent hover:text-white text-xs"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => eliminar(p._id)}
                        className="bg-rose-200 text-text px-3 py-1 rounded-lg hover:bg-red-600 hover:text-white text-xs"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {productos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-gray-400">
                      No hay productos. <Link href="/dashboard/productos/agregar" className="underline text-accent">Agrega el primero.</Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}
