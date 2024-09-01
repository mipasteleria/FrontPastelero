import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Costeorecetas({ recetas }) {
  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin 
      className="fixed top-0 w-full z-50" />
      <div 
      className="flex flex-row mt-16">
        <Asideadmin />
        <main
          className={`text-text ${poppins.className} flex-grow w-3/4 max-w-screen-lg mx-auto`}
        >
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Mis recetas</h1>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between overflow-x-auto shadow-md rounded-lg p-4 m-4">
            <div 
            className="overflow-x-auto w-full">
              <table 
              className="w-full text-sm text-left rtl:text-right text-text">
                <thead 
                className="text-xs uppercase bg-transparent dark:bg-transparent">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 border-b border-secondary"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 border-b border-secondary"
                    >
                      Nombre
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 border-b border-secondary"
                    >
                      Creación
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 border-b border-secondary"
                    >
                      Costo Total
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 border-b border-secondary"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recetas.map((receta) => (
                    <tr
                      key={receta._id}
                      className="odd:bg-transparent odd:dark:bg-transparent even:bg-transparent even:dark:bg-transparent border-b dark:border-gray-700"
                    >
                      <td className="px-6 py-4 border-b border-secondary">
                        <span className="ml-2 whitespace-nowrap font-medium dark:text-white">
                          {receta._id}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-b border-secondary">
                        {receta.nombre_receta}
                      </td>
                      <td className="px-6 py-4 border-b border-secondary">
                        {new Date(receta.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 border-b border-secondary">
                        {receta.total_cost || "N/A"}
                      </td>
                      <td className="px-6 py-4 border-b border-secondary grid grid-cols-3 gap-1">
                        <Link href={`/dashboard/costeorecetas/${receta._id}`}>
                          <svg
                            className="w-6 h-6 text-accent dark:text-white my-2 mx-.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeWidth="2"
                              d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                            />
                            <path
                              stroke="currentColor"
                              strokeWidth="2"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </Link>
                        <Link
                          href={`/dashboard/costeorecetas/editarreceta/${receta._id}`}
                        >
                          <svg
                            className="w-6 h-6 text-accent dark:text-white my-2 mx-.5"
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
                          onClick={async () => {
                            if (
                              confirm(
                                "¿Estás seguro de que deseas eliminar esta receta?"
                              )
                            ) {
                              try {
                                const res = await fetch(
                                  `http://localhost:3001/recetas/recetas/${receta._id}`,
                                  {
                                    method: "DELETE",
                                  }
                                );
                                if (res.ok) {
                                  alert("Receta eliminada");
                                  window.location.reload();
                                } else {
                                  throw new Error(
                                    "Error al eliminar la receta"
                                  );
                                }
                              } catch (error) {
                                console.error(error);
                                alert("No se pudo eliminar la receta");
                              }
                            }
                          }}
                        >
                          <svg
                          className="w-6 h-6 text-accent dark:text-white my-2 mx-.5"
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
          </div>
          <Link
            className="flex justify-center md:justify-start"
            href={"/dashboard/costeorecetas/nuevareceta"}
          >
            <button 
            className="m-10 mb-20 shadow-md text-white bg-accent hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-64 sm:w-auto px-16 py-2.5 text-center">
              Nueva Receta
            </button>
          </Link>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}

// Fetching data for server-side rendering or static generation

export async function getServerSideProps() {
  const res = await fetch("http://localhost:3001/recetas/recetas", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  return {
    props: {
      recetas: data.data || [],
    },
  };
}
