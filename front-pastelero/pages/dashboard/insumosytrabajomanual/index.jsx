import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import TablaDeInsumos from "@/src/components/tabladeinsumos";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Costeorecetas() {
  return (
    <div 
    className={`text-text ${poppins.className}`}>
      <NavbarAdmin 
      className="fixed top-0 w-full z-50" />
      <div 
      className="flex flex-row mt-16">
        <Asideadmin />
        <main 
        className={`text-text ${poppins.className} flex-grow w-3/4 max-w-screen-lg mx-auto`}>     
          <h1 
          className={`text-4xl p-4 ${sofia.className}`}>Mis insumos y trabajo manual</h1>
          <div 
          className="flex flex-col md:flex-row items-start md:items-center justify-between overflow-x-auto shadow-md rounded-lg p-4 m-4">
          <div 
          className="overflow-x-auto w-full">
          <TablaDeInsumos />
          </div>
          </div>
          <nav 
          aria-label="Page navigation example" 
          className="m-4">
            <ul 
            className="inline-flex -space-x-px text-sm ml-auto">
                <li>
                <button 
                href="#" 
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-text bg-white border border-e-0 border-secondary rounded-s-lg hover:bg-gray-100 hover:text-accent dark:bg-gray-800 dark:border-secondary dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  Previous
                </button>
                </li>
                <li>
                <button href="#" 
                className="flex items-center justify-center px-3 h-8 leading-tight text-text bg-white border border-secondary hover:bg-gray-100 hover:text-accent dark:bg-gray-800 dark:border-secondary dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  1
                </button>
                </li>
                <li>
                <button href="#" 
                className="flex items-center justify-center px-3 h-8 leading-tight text-text bg-white border border-secondary hover:bg-gray-100 hover:text-accent dark:bg-gray-800 dark:border-secondary dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  2
                </button>
                </li>
                <li>
                <button href="#" 
                aria-current="page" 
                className="flex items-center justify-center px-3 h-8 text-accent border border-secondary bg-blue-50 hover:bg-blue-100 hover:text-accent dark:border-secondary dark:bg-gray-700 dark:text-white">3</button>
                </li>
                <li>
                <button href="#" 
                class="flex items-center justify-center px-3 h-8 leading-tight text-text bg-white border border-secondary hover:bg-gray-100 hover:text-accent dark:bg-gray-800 dark:border-secondary dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  4
                </button>
                </li>
                <li>
                <button 
                href="#" 
                class="flex items-center justify-center px-3 h-8 leading-tight text-text bg-white border border-secondary hover:bg-gray-100 hover:text-accent dark:bg-gray-800 dark:border-secondary dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  5
                </button>
                </li>
                <li>
                <button 
                href="#" 
                className="flex items-center justify-center px-3 h-8 leading-tight text-text bg-white border border-secondary rounded-e-lg hover:bg-gray-100 hover:text-accent dark:bg-gray-800 dark:border-secondary dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  Next
                </button>
                </li>
            </ul>
            </nav>

          <Link className="flex justify-end mb-20" 
          href="/dashboard/insumosytrabajomanual/agregarinsumosotrabajo">
            <button 
            type="submit" 
            className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center ml-2 m-6">
              Agregar insumo o trabajo manual
            </button>
          </Link>
        </main>
        <FooterDashboard/>
      </div>
    </div>
  );
}