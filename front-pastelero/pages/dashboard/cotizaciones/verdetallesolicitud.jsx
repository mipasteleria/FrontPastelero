import Image from "next/image";
import Link from "next/link";
import NavbarDashboard from "@/src/components/navbardashboard";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function verdetallesolicitud() {
  return (
    <div className={`text-text min-h-screen ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex flex-row">
        <Asideadmin className="w-1/4" />
        <main className="w-3/4 p-4">
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Ver detalle de Solicitud de cotización</h1>
          <form className="m-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 pr-2">
                <div className="mb-6">
                  <h3 className={`text-xl p-2 ${poppins.className}`}>Diseño Solicitado o Imágenes de inspiración</h3>
                  <Image 
                    className="mx-2"
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
                    <label htmlFor="noOrden" className="block w-1/4 text-sm font-medium dark:text-white">
                      Número de orden
                    </label>
                    <input
                      type="text"
                      id="noOrden"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="123456"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="FecExp" className="block w-1/4 text-sm font-medium dark:text-white">
                      Fecha de expedición
                    </label>
                    <input
                      type="text"
                      id="FecExp"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="MM/DD/YYYY hh:mm:aa"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="NomCli" className="block w-1/4 text-sm font-medium dark:text-white">
                      En atención a
                    </label>
                    <input
                      type="text"
                      id="NomCli"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="Cliente"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="FecEnt" className="block w-1/4 text-sm font-medium dark:text-white">
                      Fecha y hora de entrega
                    </label>
                    <input
                      type="text"
                      id="FecEnt"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="MM/DD/YYYY hh:mm:aa"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="LugEnt" className="block w-1/4 text-sm font-medium dark:text-white">
                      Lugar de entrega
                    </label>
                    <input
                      type="text"
                      id="LugEnt"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="Calle, número y colonia"
                      required
                    />
                  </div>
                  
                  <h3 className={`text-xl p-2 bg-highlightText rounded-lg flex items-center justify-center ${poppins.className}`}>
                    Detalles del pedido
                  </h3>
                  <div className="flex items-center mb-4">
                    <label htmlFor="quantity" className="w-1/4 text-sm font-medium dark:text-white">
                      Número de porciones
                    </label>
                    <input
                      type="text"
                      id="quantity"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="0.0"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="SabBiz" className="w-1/4 text-sm font-medium dark:text-white">
                      Sabor de bizcocho
                    </label>
                    <input
                      type="text"
                      id="SabBiz"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="Sabor"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="SabRell" className="w-1/4 text-sm font-medium dark:text-white">
                      Relleno
                    </label>
                    <input
                      type="text"
                      id="SabRell"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="Sabor relleno"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="SabCob" className="w-1/4 text-sm font-medium dark:text-white">
                      Cobertura
                    </label>
                    <input
                      type="text"
                      id="SabCob"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="Sabor cobertura"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="Forr" className="w-1/4 text-sm font-medium dark:text-white">
                      Forrado
                    </label>
                    <input
                      type="text"
                      id="Forr"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="Forrado"
                      required
                    />
                  </div>                  
                  <div className="flex items-center mb-4">
                  <Link className="" href="/dashboard/costeorecetas/generarcotizacion">
                    <button
                      type="submit"
                      className="text-text bg-primary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center ml-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Generar Cotización
                    </button>
                    </Link>
                  </div>
               </div>
               </div>
               </div>
               </form>
               </main></div></div>)}
