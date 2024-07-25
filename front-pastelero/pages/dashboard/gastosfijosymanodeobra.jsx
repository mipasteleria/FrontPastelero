import Link from "next/link";
import NavbarDashboard from "@/src/components/navbardashboard";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Conocenuestrosproductos() {
  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex flex-row">
        <Asideadmin />
        <main className="flex-grow md:w-3/4 mb-14 max-w-screen-lg mx-auto">
          <h1 className={`text-4xl p-6 ${sofia.className}`}>Gastos fijos y mano de obra</h1>
          <div>
            <div className="flex flex-col md:flex-row items-center">
              <p className="font-bold m-4">Establecer costo de gastos fijos</p>
              <div className="m-4">
                    <label htmlFor="quantity" className="block mb-2 text-sm font-medium dark:text-white">
                      Costo por hora
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="0.0"
                      required
                    />
                  </div>
                  <Link className="flex justify-end" href="/dashboard/costeorecetas">
                    <button type="submit" className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-64 px-16 py-2.5 text-center m-4">
                    Guardar costo de gastos fijos
                    </button>
                  </Link>
              </div>
          </div>
          <div>
            <div className="flex flex-col md:flex-row items-center">
              <p className="font-bold m-4">Establecer costo de gastos fijos</p>
              <div className="m-4">
                  <label htmlFor="quantity" className="block mb-2 text-sm font-medium dark:text-white">
                    Costo por hora
                  </label>
                    <input
                    type="number"
                    id="quantity"
                    className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                    placeholder="0.0"
                    required
                  />
                </div>
                <Link className="flex" href="/dashboard/costeorecetas">
                  <button type="submit" className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-64 px-16 py-2.5 text-center m-4">
                      Guardar costo de gastos fijos
                  </button>
                </Link>
              </div>
          </div>
        </main>
        <FooterDashboard/>
      </div>
    </div>
  );
}
