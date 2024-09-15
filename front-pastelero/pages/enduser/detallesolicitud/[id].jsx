import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import VerCotizacion from "@/src/components/cotizacionview";
import Link from "next/link";


const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const Detalle = () => {
  return (
    <div className={`min-h-screen flex flex-col ${poppins.className}`}>
      <NavbarAdmin />
      <main
        className={`text-text ${poppins.className} md:mb-28 max-w-screen-lg mx-auto mt-24 p-4`}
      >
        <h1 className={`text-4xl m-4 ${sofia.className}`}>
          Detalle de Solicitud
        </h1>
        <VerCotizacion/>
        <div className="flex flex-col md:flex-row">
          <Link href="/">
              <button className="bg-accent text-white px-4 py-2 rounded hover:bg-accent-dark m-6">
                Volver a Inicio
              </button>
            </Link>
            <Link href="/cotizacion">
              <button className="bg-accent text-white px-4 py-2 rounded hover:bg-accent-dark m-6">
                Hacer otra cotizacion
              </button>
            </Link>
        </div>
          
              
      </main>
      <WebFooter />
    </div>
  );
};

export default Detalle;
