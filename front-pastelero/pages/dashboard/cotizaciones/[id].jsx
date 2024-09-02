import Image from "next/image";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import VerCotizacion from "@/src/components/cotizacionview";
import { useRouter } from "next/router";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Verdetallesolicitud() {
  const router = useRouter();
  const { id, source } = router.query;

  const handleButtonClick = () => {
    if (id && source) {
      const type = source.toLocaleLowerCase();
      const url = `/dashboard/cotizaciones/generarcotizacion/${id}?source=${source}&type=${type}`;

      console.log(`Navigating to: ${url}`);
      router.push(url);
    } else {
      console.error("id or source is undefined");
    }
  };

  return (
    <div className={`text-text min-h-screen ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
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
              <VerCotizacion />
              <button
                type="button" // Asegúrate de especificar el tipo de botón
                className="m-10 shadow-md text-white bg-accent hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-64 sm:w-auto px-16 py-2.5 text-center"
                onClick={handleButtonClick}
              >
                Generar Cotización
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
