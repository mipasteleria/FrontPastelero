import { useState, useEffect } from "react";
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

// Función para formatear fechas consistentemente
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES").format(date); // Formato DD/MM/YYYY
};

export default function Costeorecetas() {
  const [recetas, setRecetas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;
  const { userToken } = useAuth();

  // Reset a página 1 cuando cambia la búsqueda.
  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  // Obtener recetas desde la API al montar el componente
  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const res = await fetch(`${API_BASE}/recetas/recetas`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setRecetas(data.data || []);
      } catch (error) {
        console.error("Error fetching recetas:", error);
      }
    };

    fetchRecetas();
  }, []);

  const handleDelete = async (recetaId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la receta de manera permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF6F7D",
      cancelButtonColor: "#D6A7BC",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE}/recetas/recetas/${recetaId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (res.ok) {
          Swal.fire({
            title: "Eliminado",
            text: "La receta ha sido eliminada.",
            icon: "success",
            timer: 2000,
            background: "#fff1f2",
            color: "#540027",
            timerProgressBar: true,
            showConfirmButton: false,
          }).then(() => {
            setRecetas((prevRecetas) =>
              prevRecetas.filter((receta) => receta._id !== recetaId)
            );
          });
        } else {
          throw new Error("Error al eliminar la receta");
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar la receta. Por favor, inténtelo nuevamente.",
          icon: "error",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    }
  };

  // Filtro por nombre o id (insensible a acentos/mayúsculas).
  const normaliza = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const queryNorm = normaliza(searchQuery);
  const filteredRecetas = queryNorm
    ? recetas.filter((r) => normaliza(r.nombre_receta).includes(queryNorm) || String(r._id).includes(queryNorm))
    : recetas;

  // Lógica de paginación (sobre filtradas).
  const totalPages = Math.max(1, Math.ceil(filteredRecetas.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const indexOfLastItem = safeCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecetas = filteredRecetas.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className={`text-text ${poppins.className} flex-grow w-full px-4 md:px-8 max-w-screen-2xl mx-auto`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
            <h1 className={`text-4xl ${sofia.className}`}>Mis recetas</h1>
            <div className="relative w-full md:w-96">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o id…"
                className="bg-gray-50 border border-secondary text-sm rounded-full focus:ring-accent focus:border-accent block w-full pl-10 p-2.5"
              />
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
              </svg>
            </div>
          </div>
          {searchQuery && (
            <p className="px-4 text-sm text-gray-600 -mt-2 mb-2">
              {filteredRecetas.length} resultado{filteredRecetas.length === 1 ? "" : "s"} para <strong>&ldquo;{searchQuery}&rdquo;</strong>
              {filteredRecetas.length === 0 && (
                <button onClick={() => setSearchQuery("")} className="ml-3 underline" style={{ color: "var(--burdeos)" }}>
                  Limpiar búsqueda
                </button>
              )}
            </p>
          )}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between overflow-x-auto shadow-md rounded-lg p-4 m-4">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm text-left rtl:text-right text-text">
                <thead className="text-xs uppercase bg-transparent dark:bg-transparent">
                  <tr>
                    <th scope="col" className="px-6 py-3 border-b border-secondary">ID</th>
                    <th scope="col" className="px-6 py-3 border-b border-secondary">Nombre</th>
                    <th scope="col" className="px-6 py-3 border-b border-secondary">Creación</th>
                    <th scope="col" className="px-6 py-3 border-b border-secondary">Costo Total</th>
                    <th scope="col" className="px-6 py-3 border-b border-secondary">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecetas.map((receta) => (
                    <tr
                      key={receta._id}
                      className="odd:bg-transparent even:bg-transparent border-b dark:border-gray-700"
                    >
                      <td className="px-6 py-4 border-b border-secondary">{receta._id}</td>
                      <td className="px-6 py-4 border-b border-secondary">{receta.nombre_receta}</td>
                      <td className="px-6 py-4 border-b border-secondary">{formatDate(receta.createdAt)}</td>
                      <td className="px-6 py-4 border-b border-secondary">{receta.total_cost || "N/A"}</td>
                      <td className="px-6 py-4 border-b border-secondary grid grid-cols-3 gap-1">
                        <Link href={`/dashboard/costeorecetas/${receta._id}`}>
                            <svg className="w-6 h-6 text-accent dark:text-white my-2 mx-.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                              <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                              <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </Link>
                        <Link href={`/dashboard/costeorecetas/editarreceta/${receta._id}`}>
                          <svg className="w-6 h-6 text-accent dark:text-white my-2 mx-.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z" clipRule="evenodd" />
                          </svg>
                        </Link>
                        <button onClick={() => handleDelete(receta._id)}>
                          <svg className="w-6 h-6 text-accent dark:text-white my-2 mx-.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Paginación */}
          <nav aria-label="Page navigation example" className="m-4">
            <ul className="inline-flex -space-x-px text-sm ml-auto">
              <li>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-text bg-white border border-e-0 border-secondary rounded-s-lg hover:bg-gray-100 hover:text-accent dark:bg-gray-800 dark:border-secondary dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Anterior
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index}>
                  <button
                    onClick={() => handlePageChange(index + 1)}
                    className={`flex items-center justify-center px-3 h-8 leading-tight text-text bg-white border border-secondary hover:bg-gray-100 hover:text-accent dark:bg-gray-800 dark:border-secondary dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                      currentPage === index + 1 ? "bg-blue-50 text-accent" : ""
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center px-3 h-8 leading-tight text-text bg-white border border-secondary rounded-e-lg hover:bg-gray-100 hover:text-accent dark:bg-gray-800 dark:border-secondary dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
          <Link className="flex justify-center md:justify-start" href={"/dashboard/costeorecetas/nuevareceta"}>
            <button className="m-10 mb-20 shadow-md text-white bg-accent hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-64 sm:w-auto px-16 py-2.5 text-center">
              Nueva Receta
            </button>
          </Link>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}
