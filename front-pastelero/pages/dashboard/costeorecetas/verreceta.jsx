import Link from "next/link";
import NavbarDashboard from "@/src/components/navbardashboard";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function VerReceta() {
  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex">
        <Asideadmin />
        <main className={`text-text ${poppins.className} flex-grow w-3/4 max-w-screen-lg mx-auto`}>     
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Pastel de Vainilla</h1>
          <form className="m-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 pr-2">
                <div className="mb-6">
                  <label htmlFor="description" className="block mb-2 text-sm font-medium dark:text-white">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                    placeholder="El clásico sabor favorito de las fiestas infantiles..."
                    required
                    rows="6"
                    style={{ resize: 'none' }}
                  />
                </div>
              </div>

            </div>
          </form>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between overflow-x-auto shadow-md rounded-lg bg-rose-100 p-4 m-4">
          <div className="overflow-x-auto w-full">
            <h2 className={`text-3xl p-4 ${sofia.className}`}>Lista de ingredientes</h2>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs uppercase bg-transparent dark:bg-transparent">
                    <tr>
                        <th scope="col" className="px-6 py-3 border-b border-secondary">
                            Ingrediente
                        </th>
                        <th scope="col" className="px-6 py-3 border-b border-secondary">
                            Cantidad
                        </th>
                        <th scope="col" className="px-6 py-3 border-b border-secondary">
                            Unidad
                        </th>
                        <th scope="col" className="px-6 py-3 border-b border-secondary">
                            Precio
                        </th>
                        <th scope="col" className="px-6 py-3 border-b border-secondary">
                            Total
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="odd:bg-transparent odd:dark:bg-transparent even:bg-transparent even:dark:bg-transparent border-b dark:border-gray-700">
                        <td className="px-6 py-4 border-b border-secondary">
                            <span className="ml-2 whitespace-nowrap font-medium dark:text-white">Mantequilla</span>
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            500
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            Gr
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            $0.12
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            $60.00
                        </td>
                    </tr>
                    <tr className="odd:bg-transparent odd:dark:bg-transparent even:bg-transparent even:dark:bg-transparent border-b dark:border-gray-700">
                        <td className="px-6 py-4 border-b border-secondary">
                            <span className="ml-2 whitespace-nowrap font-medium dark:text-white">Azucar refinada</span>
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            400
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            Gr
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            $0.316
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            $12.64
                        </td>
                    </tr>
                    <tr className="odd:bg-transparent odd:dark:bg-transparent even:bg-transparent even:dark:bg-transparent border-b dark:border-gray-700">
                        <td className="px-6 py-4 border-b border-secondary">
                            <span className="ml-2 whitespace-nowrap font-medium dark:text-white">Huevo</span>
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            500
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            Gr
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            $0.66
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            $33.00
                        </td>
                    </tr>
                    <tr className="odd:bg-transparent odd:dark:bg-transparent even:bg-transparent even:dark:bg-transparent border-b dark:border-gray-700">
                        <td className="px-6 py-4 border-b border-secondary">
                            <span className="ml-2 whitespace-nowrap font-medium dark:text-white">Harina</span>
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            500
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            Gr
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            $0.22
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            $11.00
                        </td>
                    </tr>
                    <tr className="odd:bg-transparent odd:dark:bg-transparent even:bg-transparent even:dark:bg-transparent border-b dark:border-gray-700">
                        <td className="px-6 py-4 border-b border-secondary">
                            <span className="ml-2 whitespace-nowrap font-medium dark:text-white">Polvo para hornear</span>
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            35
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            Gr
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            $0.075
                        </td>
                        <td className="px-6 py-4 border-b border-secondary">
                            $2.63
                        </td>
                    </tr>
                  </tbody>
              </table>
          </div>
          </div>
          <div className="m-6 grid md:grid-cols-2">
            <div>
              <label htmlFor="quantity" className="block my-2 text-sm font-medium dark:text-white">
                Mano de obra en horas
              </label>
              <p>2 Horas</p>
            </div>
          <div>
            <label htmlFor="quantity" className="block my-2 text-sm font-medium dark:text-white">
              Porcentaje de ganancia esperada
            </label>
            <p>0.06%</p>
          </div>
          <div>
            <label htmlFor="quantity" className="block my-2 text-sm font-medium dark:text-white">
              Gastos fijos en horas        
            </label>
            <p>2 hrs</p>        
          </div>
          <div>
            <label htmlFor="quantity" className="block my-2 text-sm font-medium dark:text-white">
              Porcentaje de impuestos (IEPS)
            </label>
            <p>0.16%</p>
          </div>                
          </div>
          <div className="flex justify-center m-6 items-center mb-20">
            <Link className="flex justify-end" href="/dashboard/costeorecetas/editarreceta">
              <button type="submit" className="text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center ml-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 m-6">
                  Editar Receta
              </button>
            </Link>
            <Link href="/dashboard/costeorecetas/editarreceta">
              <svg class="w-10 h-10 text-accent dark:text-white mx-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
              </svg>
            </Link>
            <Link href="/dashboard/costeorecetas/editarreceta">
              <svg class="w-10 h-10 text-accent dark:text-white mx-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M8 3a2 2 0 0 0-2 2v3h12V5a2 2 0 0 0-2-2H8Zm-3 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1v-4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5Zm4 11a1 1 0 0 1-1-1v-4h8v4a1 1 0 0 1-1 1H9Z" clip-rule="evenodd"/>
              </svg>
            </Link>
            <Link href="/dashboard/costeorecetas/editarreceta">
              <svg class="w-10 h-10 text-accent dark:text-white mx-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
              </svg>
            </Link>
          </div>
        </main>
        <FooterDashboard/>
      </div>
    </div>
  );
}