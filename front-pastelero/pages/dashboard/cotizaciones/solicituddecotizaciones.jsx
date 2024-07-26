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
      <div className="flex flex-row">
        <Asideadmin />
        <main className="flex-grow sm:fixed sm:left-56">
          <h1 className={`text-4xl p-6 ${sofia.className}`}>
            Solicitud de Cotizaciones
          </h1>
          <div className="flex flex-col md:grid md:grid-cols-3 gap-4 justify-center items-center">
            <Link className="flex justify-center" href="/manejodeusuarios">
              <button className="text-2xl md:text-xl bg-primary p-3.5 rounded-lg m-4 w-72 drop-shadow-xl">
                Mis cotizaciones
              </button>
            </Link>
            <Link className="flex justify-center" href="/cotizacionmanual">
              <button className="text-2xl md:text-xl bg-primary p-3.5 rounded-lg m-4 w-72 drop-shadow-xl">
                Cotización Manual
              </button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
