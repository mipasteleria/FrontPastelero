import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { useEffect, useState } from "react";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function Conocenuestrosproductos() {
  const [userCotizacion, setUserCotizacion] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const fetchData = async () => {
        try {
          const [cakeRes, cupcakeRes, snackRes] = await Promise.all([
            fetch(`${API_BASE}/pricecake`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch(`${API_BASE}/pricecupcake`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch(`${API_BASE}/pricesnack`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

          if (cakeRes.ok && cupcakeRes.ok && snackRes.ok) {
            const [cakeData, cupcakeData, snackData] = await Promise.all([
              cakeRes.json(),
              cupcakeRes.json(),
              snackRes.json(),
            ]);

            setUserCotizacion([
              ...cakeData.data.map((item) => ({ ...item, type: "Pastel" })),
              ...cupcakeData.data.map((item) => ({ ...item, type: "Cupcake" })),
              ...snackData.data.map((item) => ({ ...item, type: "Snack" })),
            ]);
          } else {
            throw new Error("Failed to fetch data");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsAuthenticated(false);
        }
      };

      fetchData();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (!isAuthenticated) {
    return <div>You are not authenticated. Please log in.</div>;
  }

  const deleteCotizacion = async (id, source) => {
    try {
      const token = localStorage.getItem("token");
      let url;

      // Validar el valor de source y asignar la URL correspondiente
      switch (source) {
        case "cake":
          url = `${API_BASE}/pricecake/${id}`;
          break;
        case "cupcake":
          url = `${API_BASE}/pricecupcake/${id}`;
          break;
        case "snack":
          url = `${API_BASE}/pricesnack/${id}`;
          break;
        default:
          console.error("Invalid source: ", source);
          return;
      }

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Actualizar el estado después de la eliminación
        setUserCotizacion(
          userCotizacion.filter((cotizacion) => cotizacion._id !== id)
        );
      } else {
        console.error("Failed to delete the item. Status:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while deleting the item:", error);
    }
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin 
      className="fixed top-0 w-full z-50" />
      <div 
      className="flex flex-row mt-16">
        <Asideadmin />
        <main 
        className={`text-text ${poppins.className} flex-grow w-3/4`}>
          <h1 
          className={`text-4xl p-4 ${sofia.className}`}>
            Mis cotizaciones
          </h1>
          <div 
          className="flex flex-col md:flex-row items-start md:items-center justify-between overflow-x-auto shadow-md rounded-lg p-4 m-4">
            <div 
            className="overflow-x-auto w-full">
              <table 
              className="w-full text-sm text-left rtl:text-right text-text">
                <thead 
                className="text-xs uppercase bg-transparent dark:bg-transparent">
                  <tr>
                    {[
                      "ID",
                      "Cliente",
                      "Creación",
                      "Solicitud",
                      "Estado",
                      "Acciones",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 border-b border-secondary"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {userCotizacion.map((cotizacion) => (
                    <tr
                      key={`cotizacion-${cotizacion._id}`}
                      className="border-b dark:border-gray-700"
                    >
                      {[
                        "_id",
                        "contactName",
                        "createdAt",
                        "priceType",
                        "status",
                      ].map((field) => (
                        <td
                          key={field}
                          className="px-6 py-4 border-b border-secondary"
                        >
                          {cotizacion[field]}
                        </td>
                      ))}
                      <td className="px-6 py-4 border-b border-secondary grid grid-cols-3 gap-6">
                        <Link
                          href={`/dashboard/cotizaciones/${
                            cotizacion._id
                          }?type=${
                            cotizacion.type
                          }&source=${cotizacion.type.toLowerCase()}`}
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
                          href={`/dashboard/cotizaciones/editarcotizacion/${
                            cotizacion._id
                          }?type=${
                            cotizacion.type
                          }&source=${cotizacion.type.toLowerCase()}`}
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
                          onClick={() =>
                            deleteCotizacion(
                              cotizacion._id,
                              cotizacion.type.toLowerCase()
                            )
                          }
                          className="text-red-600 hover:text-red-800 my-2 mx-.5"
                        >
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
          </div>
          <nav 
          aria-label="Page navigation example" 
          className="m-4">
            <ul 
            className="inline-flex -space-x-px text-sm ml-auto">
              {["Previous", "1", "2", "3", "4", "5", "Next"].map(
                (item, index) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className={`flex items-center justify-center px-3 h-8 leading-tight text-text bg-white border border-secondary ${
                        index === 0 ? "rounded-s-lg" : ""
                      } ${index === 6 ? "rounded-e-lg" : ""} ${
                        item === "3"
                          ? "text-accent bg-blue-50"
                          : "hover:bg-gray-100 hover:text-accent"
                      }`}
                      aria-current={item === "3" ? "page" : undefined}
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>
          <Link
            className="flex justify-center md:justify-end"
            href={"/dashboard/cotizaciones/cotizacionmanual"}
          >
            <button 
            className="m-10 shadow-md text-white bg-accent hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-64 sm:w-auto px-16 py-2.5 text-center">
              Crear cotización manual
            </button>
          </Link>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}
