import { useForm } from "react-hook-form";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Conocenuestrosproductos() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [costData, setCostData] = useState({ fixedCosts: 0, laborCosts: 0 });
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchCostData = async () => {
      try {
        const response = await fetch(`${API_BASE}/costs/66dc00a6b33d98dd9e2b91a9`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCostData(data);
      } catch (error) {
        console.error('Error al obtener los datos de costos:', error);
      }
    };

    fetchCostData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${API_BASE}/costs/66dc00a6b33d98dd9e2b91a9`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fixedCosts: data.fixedCosts,
          laborCosts: data.laborCosts,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Costo actualizado exitosamente:', result);
  
      setCostData(result);
  
      Swal.fire({
        title: 'Costos actualizados',
        text: 'Los costos han sido actualizados correctamente.',
        icon: 'success',
        timer: 2000, 
        timerProgressBar: true,
        showConfirmButton: false,
        background: '#fff1f2', 
        color: '#540027', 
      });
    } catch (error) {
      console.error('Error al actualizar el costo:', error);

      Swal.fire({
        title: 'Error',
        text: 'Error al actualizar los costos. Por favor, intente nuevamente.',
        icon: 'error',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: '#fff1f2',
        color: '#540027',
      });
    }
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
                <p className="font-bold m-4">Establecer costo de Gastos Fijos</p>
                <div className="m-4">
                  <label htmlFor="fixedCosts" className="block mb-2 text-sm font-medium dark:text-white">
                    Costo por hora
                  </label>
                  <input
                    type="number"
                    id="fixedCosts"
                    {...register("fixedCosts", { required: "El costo por hora es obligatorio" })}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                    placeholder="0.0"
                  />
                  {errors.fixedCosts && <p className="text-red-600">{errors.fixedCosts.message}</p>}
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center">
                <p className="font-bold m-4">Establecer costo de Mano de Obra</p>
                <div className="m-4">
                  <label htmlFor="laborCosts" className="block mb-2 text-sm font-medium dark:text-white">
                    Costo por hora
                  </label>
                  <input
                    type="number"
                    id="laborCosts"
                    {...register("laborCosts", { required: "El costo por hora es obligatorio" })}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                    placeholder="0.0"
                  />
                  {errors.laborCosts && <p className="text-red-600">{errors.laborCosts.message}</p>}
                </div>
              </div>
              <button
                type="submit"
                className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-96 sm:w-96 px-16 py-2.5 text-center m-4"
              >
                Guardar costo de mano de obra
              </button>
            </div>
          </form>
          <div className="m-4">
            <p className="text-lg font-semibold">Costos actuales:</p>
            <p className="text-md">Costos fijos: {costData.fixedCosts} MXN</p>
            <p className="text-md">Mano de obra: {costData.laborCosts} MXN</p>
          </div>
        </main>
        <FooterDashboard />
      </div>
    </div>
  );
}
