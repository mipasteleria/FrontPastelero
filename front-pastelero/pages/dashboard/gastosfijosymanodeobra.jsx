import { useForm } from "react-hook-form";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useAuth } from "@/src/context";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Conocenuestrosproductos() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [costData, setCostData] = useState({
    fixedCosts: 0,
    laborCosts: 0,
    costoBrandingPorGalleta: 0,
    markupGalletasPct: 60,
    margenMinimoGalleta: 5,
  });
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { userToken } = useAuth();

  // Form independiente para la sección de galletas — no se mezcla con
  // el de fixedCosts/laborCosts para que el admin pueda guardar uno
  // u otro sin tener que llenar los dos cada vez.
  const galletasForm = useForm();

  useEffect(() => {
    const fetchCostData = async () => {
      try {
        const response = await fetch(`${API_BASE}/costs`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Merge con defaults para que campos faltantes no rompan el render
        setCostData((prev) => ({ ...prev, ...data }));
      } catch (error) {
        console.error('Error al obtener los datos de costos:', error);
      }
    };

    fetchCostData();
  }, [API_BASE]);

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${API_BASE}/costs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
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

      setCostData((prev) => ({ ...prev, ...result }));

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

  // Guarda los 3 campos de galletas. fixedCosts/laborCosts se envían con
  // su valor actual (no se quieren tocar pero el back los requiere para
  // mantener compat con el form anterior).
  const onSubmitGalletas = async (data) => {
    try {
      const response = await fetch(`${API_BASE}/costs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          fixedCosts: costData.fixedCosts,
          laborCosts: costData.laborCosts,
          costoBrandingPorGalleta: parseFloat(data.costoBrandingPorGalleta) || 0,
          markupGalletasPct: parseFloat(data.markupGalletasPct) || 0,
          margenMinimoGalleta: parseFloat(data.margenMinimoGalleta) || 0,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setCostData((prev) => ({ ...prev, ...result }));

      Swal.fire({
        title: 'Config de Galletas NY actualizada',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: '#fff1f2',
        color: '#540027',
      });
    } catch (error) {
      console.error('Error al actualizar config galletas:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar la configuración de galletas.',
        icon: 'error',
        timer: 2000,
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

          {/* ── Sección: Configuración de Galletas NY ───────────────── */}
          <div className="border-t-2 border-secondary mt-8 pt-6">
            <h2 className={`text-3xl px-6 ${sofia.className}`} style={{ color: "#540027" }}>
              🍪 Configuración de Galletas NY
            </h2>
            <p className="text-sm px-6 mb-4" style={{ color: "#a78891" }}>
              Estos valores alimentan el cálculo automático de precio sugerido al dar de alta un sabor desde una receta, y la vigilancia del margen mínimo.
            </p>

            <form onSubmit={galletasForm.handleSubmit(onSubmitGalletas)}>
              <div className="flex flex-col md:flex-row items-center">
                <p className="font-bold m-4">Costo de branding/empaque por galleta</p>
                <div className="m-4">
                  <label htmlFor="costoBrandingPorGalleta" className="block mb-2 text-sm font-medium">
                    MXN por pieza
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    id="costoBrandingPorGalleta"
                    defaultValue={costData.costoBrandingPorGalleta ?? 0}
                    key={`branding-${costData.costoBrandingPorGalleta ?? 0}`}
                    {...galletasForm.register("costoBrandingPorGalleta", { required: true })}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg block w-full p-2.5"
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center">
                <p className="font-bold m-4">Markup sugerido para galletas</p>
                <div className="m-4">
                  <label htmlFor="markupGalletasPct" className="block mb-2 text-sm font-medium">
                    Porcentaje (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    id="markupGalletasPct"
                    defaultValue={costData.markupGalletasPct ?? 60}
                    key={`markup-${costData.markupGalletasPct ?? 60}`}
                    {...galletasForm.register("markupGalletasPct", { required: true })}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg block w-full p-2.5"
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center">
                <p className="font-bold m-4">Margen mínimo (alerta)</p>
                <div className="m-4">
                  <label htmlFor="margenMinimoGalleta" className="block mb-2 text-sm font-medium">
                    MXN por galleta
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    id="margenMinimoGalleta"
                    defaultValue={costData.margenMinimoGalleta ?? 5}
                    key={`margen-${costData.margenMinimoGalleta ?? 5}`}
                    {...galletasForm.register("margenMinimoGalleta", { required: true })}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg block w-full p-2.5"
                    placeholder="5"
                  />
                  <p className="text-xs mt-1" style={{ color: "#a78891" }}>
                    Si el costo sube y el margen actual baja de este valor, se envía notificación interna.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-96 sm:w-96 px-16 py-2.5 text-center m-4"
              >
                Guardar configuración de Galletas NY
              </button>
            </form>

            <div className="m-4 p-4 rounded-lg" style={{ background: "#fff1f2" }}>
              <p className="text-lg font-semibold" style={{ color: "#540027" }}>Config actual de galletas:</p>
              <p className="text-md">Branding/empaque: ${costData.costoBrandingPorGalleta ?? 0} MXN/pieza</p>
              <p className="text-md">Markup sugerido: {costData.markupGalletasPct ?? 60}%</p>
              <p className="text-md">Margen mínimo (alerta): ${costData.margenMinimoGalleta ?? 5} MXN</p>
            </div>
          </div>
        </main>
        <FooterDashboard />
      </div>
    </div>
  );
}
