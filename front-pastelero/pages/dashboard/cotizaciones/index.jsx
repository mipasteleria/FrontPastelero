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

  useEffect(() => {
    const fetchData = async () => {
      const [cakeRes, cupcakeRes, snackRes] = await Promise.all([
        fetch("https://pasteleros-back.vercel.app/pricecake"),
        fetch("https://pasteleros-back.vercel.app/pricecupcake"),
        fetch("https://pasteleros-back.vercel.app/pricesnack")
      ]);
      const [cakeData, cupcakeData, snackData] = await Promise.all([
        cakeRes.json(),
        cupcakeRes.json(),
        snackRes.json()
      ]);

      setUserCotizacion([
        ...cakeData.data.map(item => ({ ...item, type: 'Pastel' })),
        ...cupcakeData.data.map(item => ({ ...item, type: 'Cupcake' })),
        ...snackData.data.map(item => ({ ...item, type: 'Snack' }))
      ]);
    };

    fetchData();
  }, []);

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
                      <Link href={`/dashboard/cotizaciones/${cotizacion._id}?type=${cotizacion.type}`}>
                        <svg className="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                          <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </Link>
                        <Link href="/dashboard/cotizaciones/generarcotizacion">
                          <svg className="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z" clipRule="evenodd" />
                          </svg>
                        </Link>
                        <Link href="/dashboard/costeorecetas/editarreceta">
                          <svg className="w-6 h-6 text-accent dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                          </svg>
                        </Link>
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
          <div className="flex justify-end m-4">
            {[
              { href: "/dashboard/cotizaciones/cotizacionmanual", label: "Crear Cotización Manual", className: "w-full sm:w-auto px-8 py-2.5" },
              { href: "/dashboard/cotizaciones/cotizacionmanual", label: "Aprobar y Enviar", className: "w-full sm:w-auto px-16 py-2.5" }
            ].map(({ href, label, className }) => (
              <Link key={label} href={href}>
                <button type="submit" className={`shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm ${className} text-center ml-2`}>
                  {label}
                </button>
              </Link>
            ))}
          </div>
        </main>
        <FooterDashboard />
      </div>
    </div>
  );
}
