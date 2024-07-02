import Link from "next/link";
import NavbarDashboard from "@/src/components/navbardashboard";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function EditarReceta() {
  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex">
        <Asideadmin />
        <main className={`text-text ${poppins.className} flex-grow w-3/4`}>     
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Editar Receta</h1>
          <form className="m-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 pr-2">
                <div className="mb-6">
                  <label htmlFor="recipe_name" className="block mb-2 text-sm font-medium dark:text-white">
                    Nombre de la receta
                  </label>
                  <input
                    type="text"
                    id="recipe_name"
                    className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                    placeholder="Pastel de vainilla"
                    required
                  />
                </div>
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
              <div className="w-full md:w-1/2 pl-2">
                <div className="grid gap-6 mb-6">
                  <div>
                    <label htmlFor="ingredient" className="block mb-2 text-sm font-medium dark:text-white">
                      Ingrediente
                    </label>
                    <input
                      type="text"
                      id="ingredient"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="Vainilla"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="quantity" className="block mb-2 text-sm font-medium dark:text-white">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="0.0"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="w-full">
                      <label htmlFor="unit" className="block mb-2 text-sm font-medium dark:text-white">
                        Unidad
                      </label>
                      <select
                        id="unit"
                        className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      >
                        <option value="grams">gramos</option>
                        <option value="ml">mililitros</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="text-white bg-secondary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center ml-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Agregar
                    </button>
                  </div>
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
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-accent focus:ring-accent dark:text-blue-500 dark:focus:ring-blue-500"/>
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
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-accent focus:ring-accent dark:text-blue-500 dark:focus:ring-blue-500"/>
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
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-accent focus:ring-accent dark:text-blue-500 dark:focus:ring-blue-500"/>
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
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-accent focus:ring-accent dark:text-blue-500 dark:focus:ring-blue-500"/>
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
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-accent focus:ring-accent dark:text-blue-500 dark:focus:ring-blue-500"/>
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

          <div className="flex flex-col mt-4 gap-4 ml-4">
                <button className="text-white bg-secondary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-2 md:mb-0 md:mr-2 w-56">
                    Eliminar Producto
                </button>
                <button className="text-white bg-secondary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-56">
                    Cancelar
                </button>
            </div>  
          </div>
          <div className="m-4 gap-4 grid md:grid-cols-2">
          <div>
                    <label htmlFor="quantity" className="block mb-2 text-sm font-medium dark:text-white">
                      Mano de obra en horas
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="0.0"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="quantity" className="block mb-2 text-sm font-medium dark:text-white">
                      Porcentaje de ganancia esperada
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="0.0"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="quantity" className="block mb-2 text-sm font-medium dark:text-white">
                      Porciones
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="0.0"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="quantity" className="block mb-2 text-sm font-medium dark:text-white">
                      Gastos fijos en horas
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="0.0"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="quantity" className="block mb-2 text-sm font-medium dark:text-white">
                      Porcentaje de impuestos (IEPS)
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="0.0"
                      required
                    />
                  </div>
          </div>
          <div className="p-4">
            <p className="m-4">Pecio Venta</p>
            <p className="m-4">Precio por porción</p>
          </div>
          <Link className="flex justify-end" href="/dashboard/costeorecetas">
            <button type="submit" className="mb-32 text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center ml-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 m-6">
              Guardar Receta
            </button>
          </Link>
        </main>
        <FooterDashboard/>
      </div>
    </div>
  );
}