import Link from "next/link";
import { useForm } from "react-hook-form";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Conocenuestrosproductos() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    // Handle form submission logic
    console.log(data);
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className="flex-grow md:w-3/4 mb-14 max-w-screen-lg mx-auto">
          <h1 className={`text-4xl p-6 ${sofia.className}`}>Gastos fijos y mano de obra</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                    {...register("costPerHour", { required: "El costo por hora es obligatorio" })}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                    placeholder="0.0"
                  />
                  {errors.costPerHour && <p className="text-red-600">{errors.costPerHour.message}</p>}
                </div>
                <button
                  type="submit"
                  className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-64 px-16 py-2.5 text-center m-4"
                >
                  Guardar costo de gastos fijos
                </button>
              </div>
              <div className="flex flex-col md:flex-row items-center">
                <p className="font-bold m-4">Establecer costo de gastos fijos</p>
                <div className="m-4">
                  <label htmlFor="quantity" className="block mb-2 text-sm font-medium dark:text-white">
                    Costo por hora
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    {...register("costPerHour", { required: "El costo por hora es obligatorio" })}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                    placeholder="0.0"
                  />
                  {errors.costPerHour && <p className="text-red-600">{errors.costPerHour.message}</p>}
                </div>
                <button
                  type="submit"
                  className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-64 px-16 py-2.5 text-center m-4"
                >
                  Guardar costo de gastos fijos
                </button>
              </div>
            </div>
          </form>
        </main>
        <FooterDashboard />
      </div>
    </div>
  );
}
