import Link from "next/link";
import { useState } from "react";
import NavbarDashboard from "@/src/components/navbardashboard";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function NuevaReceta() {
  const [quantity, setQuantity] = useState('');
  const [cost, setCost] = useState('');

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleCostChange = (e) => {
    setCost(e.target.value);
  };

  const costPerUnit = quantity && cost ? (parseFloat(cost) / parseFloat(quantity)).toFixed(2) : 0;

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex">
        <Asideadmin />
        <main className={`text-text ${poppins.className} flex-grow w-3/4`}>     
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Editar insumos o trabajo manual</h1>
          <form className="m-4 flex flex-col w-3/4 mx-auto" onSubmit={(e) => e.preventDefault()}>
            <div className="">
                <div className="mb-6">
                  <label htmlFor="recipe_name" className="block mb-2 text-sm font-medium dark:text-white">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="recipe_name"
                    className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                    placeholder="Pastel de vainilla"
                    required
                  />
                </div>
                <div className="grid gap-6 mb-6">
                <div>
                  <label htmlFor="quantity" className="block mb-2 text-sm font-medium dark:text-white">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                    placeholder="0.0"
                    value={quantity}
                    onChange={handleQuantityChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cost" className="block mb-2 text-sm font-medium dark:text-white">
                    Costo
                  </label>
                  <input
                    type="number"
                    id="cost"
                    className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                    placeholder="0.0"
                    value={cost}
                    onChange={handleCostChange}
                    required
                  />
                </div>
                  <div className="flex items-end">
                    <div className="w-full">
                      <label htmlFor="unit" className="block mb-2 text-sm font-medium dark:text-white">
                        Unidad
                      </label>
                      <select
                        id="unit"
                        className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      >
                        <option value="grams">gramos</option>
                        <option value="ml">mililitros</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
          </form>
          <div className="m-4 w-3/4 mx-auto text-lg">
            Costo por unidad: {costPerUnit} por gramo/ml
          </div>
          <Link className="flex justify-end mb-20" href="/dashboard/insumosytrabajomanual">
            <button type="submit" className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center ml-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 m-6">
                Guardar cambios
            </button>
          </Link>
          <FooterDashboard />
        </main>
      </div>
    </div>
  );
}
