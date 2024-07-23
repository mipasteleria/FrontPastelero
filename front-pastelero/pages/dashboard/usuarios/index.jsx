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
    fetch("http://localhost:3001/users/list")
      .then((res) => res.json())
      .then((info) => setUserInfo(info.data));
  }, []);
  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex flex-row">
        <Asideadmin />
        <main className="flex-grow w-3/4 max-w-screen-lg mx-auto mb-16">
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Mis usuarios</h1>
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg m-4">
            <table class="w-full text-sm text-left rtl:text-right">
              <thead class="text-xs uppercase bg-rose-50">
                <tr>
                  <th scope="col" class="p-4">
                    <div class="flex items-center">
                      <input
                        id="checkbox-all-search"
                        type="checkbox"
                        class="w-4 h-4 text-accent bg-gray-100 border-secondary rounded focus:ring-accent"
                      />
                      <label for="checkbox-all-search" class="sr-only">
                        checkbox
                      </label>
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Nombre
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Role
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Permisos
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {usersInfo.map((userInfo, index) => {
                  return (
                    <tr
                      key={`userInfo-${userInfo.name}`}
                      class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td class="w-4 p-4">
                        <div class="flex items-center">
                          <input
                            id="checkbox-table-search-1"
                            type="checkbox"
                            class="w-4 h-4 text-accent bg-gray-100 border-gray-300 rounded focus:ring-accent"
                          />
                          <label for="checkbox-table-search-1" class="sr-only">
                            checkbox
                          </label>
                        </div>
                      </td>
                      <th
                        scope="row"
                        class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        <div class="ps-3">
                          <div class="text-base font-semibold">
                            {userInfo.name}
                          </div>
                          <div>{userInfo.lastname}</div>
                          <div class="font-normal text-gray-500">
                            {userInfo.email}
                          </div>
                        </div>
                      </th>
                      <td class="px-6 py-4">Role</td>
                      <td class="px-6 py-4">
                        <div class="flex flex-col gap-1">
                          <p>Revisar cotización</p>
                          <p>Aceptar cotización</p>
                          <p>Añadir insumos</p>
                          <p>Acceso al Home</p>
                          <p>Acceso al Dashboard</p>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <Link
                          href="#"
                          class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Editar usuario
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
        <FooterDashboard />
      </div>
    </div>
  );
}
