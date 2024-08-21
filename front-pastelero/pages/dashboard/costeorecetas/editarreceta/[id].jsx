import { useState, useEffect } from "react";
import NavbarDashboard from "@/src/components/navbardashboard";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function NuevaReceta() {
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();
  const [ingredientsList, setIngredientsList] = useState([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const { id } = router.query; // Obtén el ID de la receta del query string

  useEffect(() => {
    if (id) {
      const fetchReceta = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3001/recetas/recetas/${id}`
          );
          const receta = response.data.data;

          // Carga los datos en el formulario
          setValue("nombre_receta", receta.nombre_receta);
          setValue("descripcion", receta.descripcion);
          setValue("profit_margin", receta.profit_margin);
          setValue("portions", receta.portions);
          setValue("fixed_costs_hours", receta.fixed_costs_hours);
          setValue("fixed_costs", receta.fixed_costs);
          setValue("special_tax", receta.special_tax);
          setValue("additional_costs", receta.additional_costs);
          setValue("total_cost", receta.total_cost);

          // Carga el total desde la base de datos
          setTotal(receta.total_cost);

          // Carga los ingredientes si hay
          if (receta.ingredientes.length > 0) {
            setIngredientsList(receta.ingredientes);
          }
        } catch (error) {
          console.error("Error al obtener la receta:", error);
        }
      };

      fetchReceta();
    }
  }, [id]);

  const calculateTotal = () => {
    const ingredientTotal = ingredientsList.reduce(
      (acc, ingredient) => acc + parseFloat(ingredient.costo),
      0
    );
    const {
      special_tax,
      additional_costs,
      fixed_costs,
      fixed_costs_hours,
      profit_margin,
    } = getValues();

    const specialTaxValue = parseFloat(special_tax || 0);
    const additionalCostsValue = parseFloat(additional_costs || 0);
    const fixedCostsValue = parseFloat(fixed_costs || 0);
    const fixedCostsHoursValue = parseFloat(fixed_costs_hours || 0);
    const profitMarginValue = parseFloat(profit_margin || 0);

    const totalCost =
      ingredientTotal +
      specialTaxValue +
      additionalCostsValue +
      fixedCostsValue +
      fixedCostsHoursValue;
    const totalWithProfit = totalCost + (totalCost * profitMarginValue) / 100;

    setTotal(totalWithProfit);
  };

  const handleAddIngredient = () => {
    const { ingrediente, cantidad, precio, unidad } = getValues();
    if (ingrediente.trim() && cantidad && precio) {
      const total = (precio / cantidad).toFixed(2);
      setIngredientsList([
        ...ingredientsList,
        { ingrediente, cantidad, precio, unidad, total },
      ]);
      setValue("ingrediente", "");
      setValue("cantidad", "");
      setValue("precio", "");
      setValue("unidad", "gramos");
      calculateTotal(); // Recalcula el total cuando se agrega un ingrediente
    }
  };

  const handleDeleteIngredient = (index) =>
    setIngredientsList(ingredientsList.filter((_, i) => i !== index));

  const onInputChange = () => calculateTotal();

  const onSubmit = async (data) => {
    data.ingredientes = ingredientsList; // Asegúrate de que ingredientsList contenga los datos correctos
    data.total_cost = total;

    console.log("Datos enviados:", data); // Verifica los datos antes de enviarlos

    try {
      // Asegúrate de que `id` sea el identificador correcto para la receta que deseas actualizar
      const response = await axios.put(
        `http://localhost:3001/recetas/recetas/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Receta guardada:", response.data);
      router.push("/dashboard/costeorecetas");
    } catch (error) {
      console.error("Error al guardar la receta:", error);
      // Considera agregar una notificación o mensaje al usuario en caso de error
    }
  };

  const renderInput = (id, label, type = "text", placeholder, validation) => (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <Controller
        name={id}
        control={control}
        rules={{ required: validation }}
        render={({ field }) => (
          <input
            type={type}
            id={id}
            className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            placeholder={placeholder}
            {...field}
            onChange={(e) => {
              field.onChange(e);
              onInputChange(); // Calcula el total en tiempo real
            }}
          />
        )}
      />
      {errors[id] && <p className="text-red-600">{errors[id].message}</p>}
    </div>
  );

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex">
        <Asideadmin />
        <main
          className={`text-text ${poppins.className} flex-grow w-3/4 max-w-screen-lg mx-auto`}
        >
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Nueva Receta</h1>
          <form className="m-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 px-2">
                <div className="mb-4">
                  {renderInput(
                    "nombre_receta",
                    "Nombre de la receta",
                    "text",
                    "Pastel de vainilla",
                    "El nombre de la receta es obligatorio"
                  )}
                </div>
                <div className="mb-4">
                  {renderInput(
                    "descripcion",
                    "Descripción",
                    "textarea",
                    "El clásico sabor favorito de las fiestas infantiles...",
                    "La descripción es obligatoria"
                  )}
                </div>
              </div>
              <div className="w-full md:w-1/2 pl-2">
                <div className="grid gap-6 mb-6">
                  {renderInput(
                    "ingrediente",
                    "Ingrediente",
                    "text",
                    "Vainilla",
                    ""
                  )}
                  {renderInput("cantidad", "Cantidad", "number", "0.0", "")}
                  {renderInput("precio", "Precio", "number", "0.0", "")}
                  <div className="flex items-end">
                    <div className="w-full">
                      <label
                        htmlFor="unidad"
                        className="block mb-2 text-sm font-medium dark:text-white"
                      >
                        Unidad
                      </label>
                      <Controller
                        name="unidad"
                        control={control}
                        defaultValue="gramos"
                        render={({ field }) => (
                          <select
                            id="unidad"
                            className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                            {...field}
                          >
                            <option value="gramos">gramos</option>
                            <option value="ml">mililitros</option>
                          </select>
                        )}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddIngredient}
                      className="shadow-md text-white bg-secondary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center ml-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-10 p-4 rounded-xl bg-rose-50 overflow-x-auto">
              <h2 className={`text-3xl p-2 font-bold mb-4 ${sofia.className}`}>
                Lista de ingredientes
              </h2>
              {ingredientsList.length === 0 ? (
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
                      <th className="px-6 py-3">Costo por gr/ml</th>
                      <th className="px-6 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ingredientsList.map((ingredient, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">{ingredient.ingrediente}</td>
                        <td className="px-6 py-4">{ingredient.cantidad}</td>
                        <td className="px-6 py-4">{ingredient.precio}</td>
                        <td className="px-6 py-4">{ingredient.unidad}</td>
                        <td className="px-6 py-4">{ingredient.total}</td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => handleDeleteIngredient(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {renderInput(
                "profit_margin",
                "Margen de ganancia (%)",
                "number",
                "0.0",
                ""
              )}
              {renderInput(
                "fixed_costs_hours",
                "Costos fijos por hora",
                "number",
                "0.0",
                ""
              )}
              {renderInput("fixed_costs", "Costos fijos", "number", "0.0", "")}
              {renderInput("special_tax", "IEPS (%)", "number", "0.0", "")}
              {renderInput(
                "additional_costs",
                "Costos adicionales",
                "number",
                "0.0",
                ""
              )}
            </div>
            <div className="my-10 p-4 rounded-xl bg-rose-50">
              <label
                htmlFor="total_cost"
                className={`text-3xl p-2 font-bold mb-4 ${sofia.className}`}
              >
                Costo total estimado
              </label>
              <p id="total_cost" className=" text-center text-2xl">
                {total.toFixed(2)} MXN
              </p>
            </div>
            <button
              type="submit"
              className="shadow-md text-white bg-accent hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center mb-8"
            >
              Guardar Receta
            </button>
            <Link href={"/dashboard/costeorecetas"}>
              <button className="shadow-md text-white bg-accent hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center mb-20">
                Regresar
              </button>
            </Link>
          </form>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}
