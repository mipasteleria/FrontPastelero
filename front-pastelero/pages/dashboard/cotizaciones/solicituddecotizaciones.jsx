import Link from "next/link";
import NavbarDashboard from "@/src/components/navbardashboard";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const cakeforminfo = {
  cakeFlavor: "Vainilla",
  portions: "50",
  levels: "3",
  cakeFilling: "vainilla",
  cober: "buttercream",
  fondant: true,
  decorations: ["flores fondant","Figura fondant","Letrero"],
  others: "aqui va texto extra",
  envio: "si",
  LugEnt: "calle 6",
  budget: "1000",
  images: [],
  userName: "Ana",
  userPhone: "55555555",
  userComments: "no",
  Date: "12 Agosto 2024",
  Hour: "12pm",
};

export default function Conocenuestrosproductos() {
  const filledFields = Object.entries(cakeforminfo).filter(([key, value]) => value && value.length !== 0);

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex flex-row">
        <Asideadmin />
        <main className="flex-grow ml-56 mt-20 p-6">
          <h1 className={`text-4xl mb-6 ${sofia.className}`}>Detalle de solicitud</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
            {filledFields.map(([key, value]) => (
              <div key={key} className="mb-4">
                <label className="capitalize font-bold">{key.replace(/([A-Z])/g, ' $1')}:</label>
                <p className="bg-gray-50 border border-secondary text-sm rounded-lg p-2.5 mt-2">
                  {Array.isArray(value) ? value.join(', ') : value}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:justify-around mt-6">
            <Link href="/index.jsx">
              <button className="text-xl md:text-xl bg-primary p-3.5 md:justify-around rounded-lg w-full md:w-72 drop-shadow-xl mb-4 md:mb-0">
                Mis cotizaciones
              </button>
            </Link>
            <Link href="/generarcotizacion">
              <button className="text-xl md:text-xl bg-primary p-3.5 md:justify-around rounded-lg w-full md:w-72 drop-shadow-xl">
                Generar Cotizacion
              </button>
            </Link>

            <Link href="/cotizacionmanual">
              <button className="text-xl md:text-xl bg-primary p-3.5 md:justify-around rounded-lg w-full md:w-72 drop-shadow-xl">
                Cotización Manual
              </button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
