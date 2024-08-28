import Link from "next/link";
import { useEffect, useState } from "react";
import NavbarDashboard from "@/src/components/navbardashboard";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function AdministradorUsuarios() {
  const [usersInfo, setUserInfo] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/users/list", {
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
      const token = localStorage.getItem("token"); // Obtener el token
  
      const response = await fetch(`http://localhost:3001/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agregar el token en el encabezado
        },
      });
  
      if (response.ok) {
        alert("Usuario eliminado con éxito");
        setUserInfo(usersInfo.filter((user) => user._id !== id));
      } else {
        alert("Error al eliminar el usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar el usuario");
    }
  };
  

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex flex-row">
        <Asideadmin />
        <main className="flex-grow w-3/4 max-w-screen-lg mx-auto mb-16">
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Mis usuarios</h1>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-4">
            <table className="w-full text-sm text-left rtl:text-right">
              <thead className="text-xs uppercase bg-rose-50">
                <tr>
                  <th className="p-4"></th>
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Rol</th>
                  <th className="px-6 py-3">Permisos</th>
                  <th className="px-6 py-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {usersInfo.map((userInfo) => (
                  <tr key={`userInfo-${userInfo._id}`} className="bg-white">
                    <td className="w-4 p-4"></td>
                    <th
                      scope="row"
                      className="flex items-center px-6 py-4 whitespace-nowrap"
                    >
                      <div className="ps-3">
                        <div className="text-base font-semibold">
                          {userInfo.name}
                        </div>
                        <div>{userInfo.lastname}</div>
                        <div className="font-normal">{userInfo.email}</div>
                      </div>
                    </th>
                    <td className="px-6 py-4">{userInfo.role}</td>
                    <td className="px-6 py-4">
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
                        <svg
                          class="w-6 h-6 text-accent dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
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
          <Link
            href="/dashboard/usuarios/nuevousuario"
            className="flex justify-end mb-20"
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
