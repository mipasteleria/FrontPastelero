import Image from "next/image";
import NavbarDashboard from "@/src/components/navbardashboard";
import Asideadmin from "@/src/components/asideadmin";
import EditarCotizacion from "@/src/components/cotizacionedit";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Verdetallesolicitud() {
  return (
    <div className={`text-text min-h-screen ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex flex-row">
        <Asideadmin className="w-1/4" />
        <main className="w-3/4 p-4">
          <h1 className={`text-4xl p-4 ${sofia.className}`}>
            Ver detalle de Solicitud de cotización
          </h1>
          <form className="m-4">
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 pr-2">
                <div className="mb-6">
                  <h3 className={`text-xl p-2 ${poppins.className}`}>
                    Diseño Solicitado o Imágenes de inspiración
                  </h3>
                  <Image
                    className="mx-2"
                    src="/img/logo.JPG"
                    width={164}
                    height={164}
                    alt="imagen"
                  />
                </div>
              </div>
              <EditarCotizacion/>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
