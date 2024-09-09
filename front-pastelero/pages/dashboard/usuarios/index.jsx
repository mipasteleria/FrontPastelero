import Link from "next/link";
import { useEffect, useState } from "react";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import Swal from "sweetalert2";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdministradorUsuarios() {
  const [usersInfo, setUserInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE}/users/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((info) => setUserInfo(info.data || []));
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el usuario de manera permanente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FF6F7D",
        cancelButtonColor: "#D6A7BC",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_BASE}/users/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          Swal.fire({
            title: "Eliminado",
            text: "Usuario eliminado con éxito.",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            background: "#fff1f2",
            color: "#540027",
          }).then(() => {
            setUserInfo((prevUsers) => prevUsers.filter((user) => user._id !== id));
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Error al eliminar el usuario.",
            icon: "error",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            background: "#fff1f2",
            color: "#540027",
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "Error al eliminar el usuario.",
        icon: "error",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff1f2",
        color: "#540027",
      });
    }
  };

  const totalPages = Math.ceil(usersInfo.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = usersInfo.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className="flex-grow w-3/4 max-w-screen-lg mx-auto mb-16">
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Mis usuarios</h1>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right">
              <thead className="text-xs uppercase bg-rose-50">
                <tr>
                  <th className="p-1"></th>
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Rol</th>
                  <th className="px-6 py-3">Permisos</th>
                  <th className="px-6 py-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((userInfo) => (
                  <tr key={`userInfo-${userInfo._id}`} className="bg-white">
                    <td className="w-4 p-2"></td>
                    <th
                      scope="row"
                      className="flex items-center px-6 py-2 whitespace-nowrap"
                    >
                      <div className="ps-3">
                        <div className="text-base font-semibold">
                          {userInfo.name}
                        </div>
                        <div>{userInfo.lastname}</div>
                        <div className="font-normal">{userInfo.email}</div>
                      </div>
                    </th>
                    <td className="px-6 py-2">{userInfo.role}</td>
                    <td className="px-6 py-2">
                      <div className="flex flex-col gap-1">
                        {(Array.isArray(userInfo.permissions)
                          ? userInfo.permissions
                          : []
                        ).map((perm) => (
                          <p key={perm}>{perm}</p>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <Link
                        href={`/dashboard/usuarios/editarusuario/${userInfo._id}`}
                        className="font-medium text-accent hover:underline"
                      >
                        {/* SVG para editar */}
                        <svg
                          className="w-6 h-6 text-accent dark:text-white"
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
                      </Link>
                      <button
                        onClick={() => handleDeleteUser(userInfo._id)}
                        className="text-red-500 hover:underline"
                      >
                        {/* SVG para eliminar */}
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
                ))}
              </tbody>
            </table>
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
          <Link
            href="/dashboard/usuarios/nuevousuario"
            className="flex justify-end mb-8"
          >
            <button
              type="button"
              className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-64 px-16 py-2.5 text-center mt-10 ml-2"
            >
              Agregar usuario
            </button>
          </Link>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}
