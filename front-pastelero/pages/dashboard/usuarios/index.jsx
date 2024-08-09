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
    fetch("https://pasteleros-back.vercel.app/users/list")
      .then((res) => res.json())
      .then((info) => setUserInfo(info.data || [])); // Asegúrate de que sea un array
  }, []);

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex flex-row">
        <Asideadmin />
        <main className="flex-grow w-3/4 max-w-screen-lg mx-auto mb-16">
          <h1 className={`text-4xl p-4 ${sofia.className}`}>
            Mis usuarios
          </h1>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-4">
            <table className="w-full text-sm text-left rtl:text-right">
              <thead className="text-xs uppercase bg-rose-50">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all-search"
                        type="checkbox"
                        className="w-4 h-4 text-accent bg-gray-100 border-secondary rounded focus:ring-accent"
                      />
                      <label htmlFor="checkbox-all-search" className="sr-only">
                        Select All
                      </label>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">Nombre</th>
                  <th scope="col" className="px-6 py-3">Role</th>
                  <th scope="col" className="px-6 py-3">Permisos</th>
                  <th scope="col" className="px-6 py-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {usersInfo.map((userInfo) => (
                  <tr key={`userInfo-${userInfo.name}`} className="bg-white">
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id={`checkbox-table-search-${userInfo.id}`}
                          type="checkbox"
                          className="w-4 h-4 text-accent bg-gray-100 border-gray-300 rounded focus:ring-accent"
                        />
                        <label
                          htmlFor={`checkbox-table-search-${userInfo.id}`}
                          className="sr-only"
                        >
                          Select
                        </label>
                      </div>
                    </td>
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
                        {(userInfo.permissions || []).map((perm) => (
                          <p key={perm}>{perm}</p>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/usuarios/editar/${userInfo.id}`}
                        className="font-medium text-accent hover:underline"
                      >
                        Editar usuario
                      </Link>
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
