import { useEffect, useState } from "react";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function VerReceta() {
  const [receta, setReceta] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      axios
        .get(`${API_BASE}/recetas/recetas/${id}`)
        .then((response) => {
          const recetaData = response.data.data; // Ajuste aquí
          setReceta(recetaData);
        })
        .catch((error) => {
          console.error("Error al cargar la receta:", error);
        });
    }
  }, [id]);

  if (!receta) return <p>Loading...</p>;

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main
          className={`text-text ${poppins.className} flex-grow w-3/4 max-w-screen-lg mx-auto`}
        >
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Ver Receta</h1>
          <div className="m-4">
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 px-2">
                <div className="mb-4">
                  <p className="block text-sm font-bold">Nombre de la receta</p>
                  <p className="bg-gray-50 text-sm rounded-lg p-2.5 dark:placeholder-secondary">
                    {receta.nombre_receta}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="block text-sm font-bold">Descripción</p>
                  <p className="bg-gray-50 text-sm rounded-lg p-2.5">
                    {receta.descripcion}
                  </p>
                </div>
              </div>
            </div>
            <div className="my-10 p-4 rounded-xl bg-rose-50 overflow-x-auto">
              <h2 className={`text-3xl p-2 font-bold mb-4 ${sofia.className}`}>
                Lista de ingredientes
              </h2>
              {receta.ingredientes.length === 0 ? (
                <p className="text-center text-gray-500">
                  Todavía no se han agregado ingredientes.
                </p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="text-xs text-text uppercase bg-rose-50">
                    <tr>
                      <th className="px-6 py-3">Ingrediente</th>
                      <th className="px-6 py-3">Cantidad</th>
                      <th className="px-6 py-3">Precio</th>
                      <th className="px-6 py-3">Unidad</th>
                      <th className="px-6 py-3">Costo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receta.ingredientes.map((ingredient, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                      >
                        <td className="px-6 py-4">{ingredient.ingrediente}</td>
                        <td className="px-6 py-4">{ingredient.cantidad}</td>
                        <td className="px-6 py-4">{ingredient.precio}</td>
                        <td className="px-6 py-4">{ingredient.unidad}</td>
                        <td className="px-6 py-4">{ingredient.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <h2 className={`text-3xl p-2 font-bold mb-4 ${sofia.className}`}>
              Costos adicionales
            </h2>
            <div className="my-10 grid grid-cols-2 gap-6 p-4 rounded-xl">
              <div className="mb-4">
                <p className="block text-sm font-bold">Costos fijos</p>
                <p className="bg-gray-50 text-sm rounded-lg p-2.5">
                  {receta.fixed_costs}
                </p>
              </div>
              <div className="mb-4">
                <p className="block text-sm font-bold">Porciones</p>
                <p className="bg-gray-50 text-sm rounded-lg p-2.5">
                  {receta.portions}
                </p>
              </div>
              <div className="mb-4">
                <p className="block text-sm font-bold">Costos por horas</p>
                <p className="bg-gray-50 text-sm rounded-lg p-2.5">
                  {receta.fixed_costs_hours}
                </p>
              </div>
              <div className="mb-4">
                <p className="block text-sm font-bold">
                  Impuesto especial sobre producción y servicios (IEPS)
                </p>
                <p className="bg-gray-50 text-sm rounded-lg p-2.5">
                  {receta.special_tax}
                </p>
              </div>
              <div className="mb-4">
                <p className="block text-sm font-bold">Costos adicionales</p>
                <p className="bg-gray-50 text-sm rounded-lg p-2.5">
                  {receta.additional_costs}
                </p>
              </div>
              <div className="mb-4">
                <p className="block text-sm font-bold">Margen de ganancia</p>
                <p className="bg-gray-50 text-sm rounded-lg p-2.5 ">
                  {receta.profit_margin}
                </p>
              </div>
            </div>
          </div>
          <div className="my-10 p-4 rounded-xl bg-rose-50 mb-20">
            <h2 className={`text-3xl p-2 font-bold mb-4 ${sofia.className}`}>
              Costo total estimado
            </h2>
            <p className="text-center text-2xl">
              {receta.total_cost.toFixed(2)} MXN
            </p>
          </div>
            <Link href={"/dashboard/costeorecetas"}>
            <button
              className="shadow-md text-white bg-accent hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center mb-20"
            >
              Regresar
            </button>
            </Link>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}
