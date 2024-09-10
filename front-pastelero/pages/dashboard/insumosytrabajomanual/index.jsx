import React, { useEffect, useState } from "react";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import axios from "axios";
import Swal from "sweetalert2";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function InsumosyTrabajoManual() {
  const [insumos, setInsumos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const response = await axios.get(`${API_BASE}/insumos`);
        setInsumos(response.data);
      } catch (error) {
        console.error("Error fetching insumos:", error);
      }
    };

    fetchInsumos();
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el insumo de manera permanente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FF6F7D",
        cancelButtonColor: "#D6A7BC",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });
  
      if (result.isConfirmed) {
        await axios.delete(`${API_BASE}/insumos/${id}`);
  
        Swal.fire({
          title: "Eliminado",
          text: "Insumo eliminado con éxito.",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#fff1f2",
          color: "#540027",
        }).then(() => {
          setInsumos((prevInsumos) => prevInsumos.filter((insumo) => insumo._id !== id));
        });
      }
    } catch (error) {
      console.error("Error deleting insumo:", error);
      Swal.fire({
        title: "Error",
        text: "Error al eliminar el insumo.",
        icon: "error",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff1f2",
        color: "#540027",
      });
    }
  };
  
  // Lógica de paginación
  const totalPages = Math.ceil(insumos.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInsumos = insumos.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className={`text-text ${poppins.className} flex-grow w-3/4 max-w-screen-lg mx-auto`}>
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Mis insumos y trabajo manual</h1>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between overflow-x-auto shadow-md rounded-lg p-4 m-4">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm text-left rtl:text-right text-text">
                <thead className="text-xs uppercase bg-transparent dark:bg-transparent">
                  <tr>
                    <th scope="col" className="px-6 py-3 border-b border-secondary">ID</th>
                    <th scope="col" className="px-6 py-3 border-b border-secondary">Nombre</th>
                    <th scope="col" className="px-6 py-3 border-b border-secondary">Cantidad</th>
                    <th scope="col" className="px-6 py-3 border-b border-secondary">Costo</th>
                    <th scope="col" className="px-6 py-3 border-b border-secondary">Unidad</th>
                    <th scope="col" className="px-6 py-3 border-b border-secondary">Precio por gr/ml</th>
                    <th scope="col" className="px-6 py-3 border-b border-secondary">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInsumos.length > 0 ? (
                    currentInsumos.map((insumo) => (
                      <tr key={insumo._id} className="odd:bg-transparent even:bg-transparent border-b dark:border-gray-700">
                        <td className="px-6 py-4 border-b border-secondary">{insumo._id}</td>
                        <td className="px-6 py-4 border-b border-secondary">{insumo.name}</td>
                        <td className="px-6 py-4 border-b border-secondary">{insumo.amount}</td>
                        <td className="px-6 py-4 border-b border-secondary">{insumo.cost}</td>
                        <td className="px-6 py-4 border-b border-secondary">{insumo.unit}</td>
                        <td className="px-6 py-4 border-b border-secondary">
                          {insumo.amount && insumo.cost ? (insumo.cost / insumo.amount).toFixed(2) : "N/A"}
                        </td>
                        <td className="px-6 py-4 border-b border-secondary grid grid-cols-2 gap-2">
                          <Link href={`/dashboard/insumosytrabajomanual/editarinsumosotrabajo/${insumo._id}`}>
                            <button className="text-accent dark:text-white hover:underline">
                              <svg
                              className="w-6 h-6"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </Link>
                          <button onClick={() => handleDelete(insumo._id)} className="text-red-500 hover:text-red-700">
                          <svg
                          className="w-6 h-6 text-accent dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                            />
                          </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 border-b border-secondary text-center">No hay insumos disponibles</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
          <Link className="flex justify-end mb-16" href="/dashboard/insumosytrabajomanual/agregarinsumosotrabajo">
            <button
              type="submit"
              className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center ml-2 m-6"
            >
              Agregar insumo o trabajo manual
            </button>
          </Link>
        </main>
        <FooterDashboard />
      </div>
    </div>
  );
}
