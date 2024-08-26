import Link from "next/link";
import NavbarDashboard from "@/src/components/navbardashboard";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { useEffect, useState } from "react";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Conocenuestrosproductos() {
  const [userCotizacion, setUserCotizacion] = useState([]);
  const [cotizacionType, setCotizacionType] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const fetchData = async () => {
        try {
          const [cakeRes, cupcakeRes, snackRes] = await Promise.all([
            fetch("https://pasteleros-back.vercel.app/pricecake", {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch("https://pasteleros-back.vercel.app/pricecupcake", {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch("https://pasteleros-back.vercel.app/pricesnack", {
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
              ...cakeData.data.map(item => ({ ...item, type: 'Pastel' })),
              ...cupcakeData.data.map(item => ({ ...item, type: 'Cupcake' })),
              ...snackData.data.map(item => ({ ...item, type: 'Snack' })),
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
        case 'cake':
          url = `https://pasteleros-back.vercel.app/pricecake/${id}`;
          break;
        case 'cupcake':
          url = `https://pasteleros-back.vercel.app/pricecupcake/${id}`;
          break;
        case 'snack':
          url = `https://pasteleros-back.vercel.app/pricesnack/${id}`;
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
        setUserCotizacion(userCotizacion.filter(cotizacion => cotizacion._id !== id));
      } else {
        console.error("Failed to delete the item. Status:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while deleting the item:", error);
    }
  };
  
  

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex">
        <Asideadmin />
        <main className={`text-text ${poppins.className} flex-grow w-3/4`}>
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Mis cotizaciones</h1>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between overflow-x-auto shadow-md rounded-lg p-4 m-4">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm text-left rtl:text-right text-text">
                <thead className="text-xs uppercase bg-transparent dark:bg-transparent">
                  <tr>
                    {["ID", "Cliente", "Creación", "Solicitud", "Acciones"].map((header) => (
                      <th key={header} className="px-6 py-3 border-b border-secondary">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {userCotizacion.map((cotizacion) => (
                    <tr key={`cotizacion-${cotizacion._id}`} className="border-b dark:border-gray-700">
                      {["_id", "contactName", "createdAt"].map((field) => (
                        <td key={field} className="px-6 py-4 border-b border-secondary">
                          {cotizacion[field]}
                        </td>
                      ))}
                      <td className="px-6 py-4 border-b border-secondary">{cotizacion.type}</td>
                      <td className="px-6 py-4 border-b border-secondary grid grid-cols-3 gap-6">
                        <Link href={`/dashboard/cotizaciones/${cotizacion._id}?type=${cotizacion.type}&source=${cotizacion.source}`}>
                          <svg className="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                            <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        </Link>
                        <Link href={`/dashboard/cotizaciones/${cotizacion._id}?type=${cotizacion.type}&source=${cotizacion.source}`}>
                          <svg className="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                            <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        </Link>
                        <button onClick={() => deleteCotizacion(cotizacion._id, cotizacion.type.toLowerCase())} className="text-red-600 hover:text-red-800">
                          <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeWidth="2" d="M19 13H5m6-6h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Zm0 0H7m7 0v14" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <nav aria-label="Page navigation example" className="m-4">
            <ul className="inline-flex -space-x-px text-sm ml-auto">
              {["Previous", "1", "2", "3", "4", "5", "Next"].map((item, index) => (
                <li key={item}>
                  <Link
                    href="#"
                    className={`flex items-center justify-center px-3 h-8 leading-tight text-text bg-white border border-secondary ${index === 0 ? "rounded-s-lg" : ""} ${index === 6 ? "rounded-e-lg" : ""} ${item === "3" ? "text-accent bg-blue-50" : "hover:bg-gray-100 hover:text-accent"} dark:bg-gray-800 dark:border-secondary dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                    aria-current={item === "3" ? "page" : undefined}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}
