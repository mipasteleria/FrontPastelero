import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Conocenuestrosproductos() {
  return (
    <div 
    className={`text-text ${poppins.className}`}>
      <NavbarAdmin 
      className="fixed top-0 w-full z-50" />
      <div 
      className="flex flex-row mt-16">
        <Asideadmin />
        <main 
        className="flex-grow md:w-3/4 mb-14 max-w-screen-lg mx-auto">
          <h1 
          className={`text-4xl p-6 ${sofia.className}`}>Dashboard</h1>
          <div 
          className="flex flex-col md:grid md:grid-cols-3 gap-4 justify-center items-center">
            <Link 
            className="flex justify-center" 
            href="/dashboard/usuarios">
                <button 
                className="text-2xl md:text-xl bg-primary p-3.5 rounded-lg m-4 w-72 h-24 drop-shadow-xl">Manejo de usuarios</button>
            </Link>
            <Link 
            className="flex justify-center" 
            href="/dashboard/insumosytrabajomanual">
                <button 
                className="text-2xl md:text-xl bg-primary p-3.5 rounded-lg m-4 w-72 h-24 drop-shadow-xl">Insumos y Trabajo Manual</button>
            </Link>
            <Link 
            className="flex justify-center" 
            href="/dashboard/costeorecetas">
                <button 
                className="text-2xl md:text-lg bg-primary p-3.5 rounded-lg m-4 w-72 h-24 drop-shadow-xl">Costeo de recetas</button>
            </Link>
            <Link 
            className="flex justify-center" 
            href="/dashboard/gastosfijosymanodeobra">
                <button 
                className="text-2xl md:text-xl bg-primary p-3.5 rounded-lg m-4 w-72 h-24 drop-shadow-xl">Gastos Fijos y Mano de Obra</button>
            </Link>
            <Link 
            className="flex justify-center" 
            href="/dashboard/cotizaciones">
                <button 
                className="text-2xl md:text-xl bg-primary p-3.5 rounded-lg m-4 w-72 h-24 drop-shadow-xl">
                  Solicitudes de cotización
                </button>
            </Link>         
          </div>
          <FooterDashboard/>
        </main>
      </div>
    </div>
  );
}
