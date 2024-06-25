
import Image from "next/image";
import Link from "next/link";
import NavbarDashboard from "@/src/components/navbardashboard";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Conocenuestrosproductos() {
  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex flex-row w-3/4">
        <Asideadmin />
        <main className="flex-grow">
        <h1 className={`text-4xl p-4 ${sofia.className}`}>Ver detalle de Solicitud de cotizacion</h1>
        <form className="m-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 pr-2">
                <div className="mb-6">
                <h3 className={`text-xl p-2 ${poppins.className}`}>Diseño Solicitado o Imagenes de inspiracion</h3>
                <Image 
                  className="mx-2 "
                  src="/img/logo.JPG"
                  width={164}
                  height={164}
                  alt="imagen"
                /> 
                </div>

              </div>
              
              <div className="w-full md:w-1/2 pl-2">
                <div className="grid gap-6 mb-6">
                  <div className="flex items-center mb-4">
                    <label htmlFor="ingredient" className="block mb-2 text-sm font-medium dark:text-white">
                      Numero de orden
                    </label>
                    <input
                      type="text"
                      id="noOrden"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="123456"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="quantity" className="block mb-2 text-sm font-medium dark:text-white">
                      Fecha de expedicion
                    </label>
                    <input
                      type="number"
                      id="FecExp"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="MM/DD/YYYY hh:mm:aa"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="quantity" className="block mb-2 text-sm font-medium dark:text-white">
                      En atención a
                    </label>
                    <input
                      type="NomCli"
                      id="quantity"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="Cliente"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="quantity" className="block mb-2 text-sm font-medium dark:text-white">
                      Fecha y hora de entrega
                    </label>
                    <input
                      type="number"
                      id="FecEnt"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="MM/DD/YYYY hh:mm:aa"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="quantity" className="block mb-2 text-sm font-medium dark:text-white">
                      Lugar de Entrega
                    </label>
                    <input
                      type="LugEnt"
                      id="quantity"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="Calle, numero y colonia"
                      required
                    />
                  </div>
                  
                  <h3 className={`text-xl p-2 bg-gray-200 rounded-lg flex items-center justify-center ${poppins.className}`}>Detalles del pedido</h3>
                  <div className="flex items-center mb-4">
                    <label htmlFor="quantity" className="text-sm font-medium dark:text-white mr-2">
                      Numero de porciones
                    </label>
                    <input
                      type="text"
                      id="quantity"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="0.0"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="SabBiz" className="text-sm font-medium dark:text-white mr-2">
                      Sabor de Bizcocho
                    </label>
                    <input
                      type="text"
                      id="SabBiz"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="Sabor"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="SabRell" className="text-sm font-medium dark:text-white mr-2">
                      Relleno
                    </label>
                    <input
                      type="text"
                      id="SabRell"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="Sabor Relleno"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="SabCob" className="text-sm font-medium dark:text-white mr-2">
                      Cobertura
                    </label>
                    <input
                      type="text"
                      id="SabCob"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="Sabor Cobertura"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="Forr" className="text-sm font-medium dark:text-white mr-2">
                      Forrado
                    </label>
                    <input
                      type="text"
                      id="Forr"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="Forrado"
                      required
                    />
                  </div>                  
                  <div className="flex items-center mb-4">

                    <button
                      type="submit"
                      className="text-white bg-secondary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center ml-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Generar Cotizacion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
      
    </div>
  );
}