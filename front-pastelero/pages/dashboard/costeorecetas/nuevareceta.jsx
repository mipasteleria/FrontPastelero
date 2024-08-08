import { useState } from "react";
import Link from "next/link";
import NavbarDashboard from "@/src/components/navbardashboard";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function NuevaReceta() {
  const { handleSubmit, control, getValues, setValue, formState: { errors } } = useForm();
  const [ingredientsList, setIngredientsList] = useState([]);
  const router = useRouter();

  const handleAddIngredient = () => {
    const data = getValues();
    if (data.ingredient && data.quantity && data.price) {
      const total = (data.quantity * data.price).toFixed(2);
      setIngredientsList([...ingredientsList, { ...data, total }]);
      // Clear form inputs
      setValue("ingredient", "");
      setValue("quantity", "");
      setValue("price", "");
      setValue("unit", "grams");
    }
  };

  const handleDeleteIngredient = (index) => {
    const newList = ingredientsList.filter((_, i) => i !== index);
    setIngredientsList(newList);
  };

  const onSubmit = (data) => {
    // Handle form submission logic
    console.log("Form Data:", data);
    // Example: router.push('/dashboard/costeorecetas'); // Uncomment this if you want to navigate after saving
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex">
        <Asideadmin />
        <main className={`text-text ${poppins.className} flex-grow w-3/4`}>
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Nueva Receta</h1>
          <form className="m-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 pr-2">
                <div className="mb-6">
                  <label htmlFor="recipe_name" className="block mb-2 text-sm font-medium dark:text-white">
                    Nombre de la receta
                  </label>
                  <Controller
                    name="recipe_name"
                    control={control}
                    rules={{ required: "El nombre de la receta es obligatorio" }}
                    render={({ field }) => (
                      <input
                        type="text"
                        id="recipe_name"
                        className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                        placeholder="Pastel de vainilla"
                        {...field}
                      />
                    )}
                  />
                  {errors.recipe_name && <p className="text-red-600">{errors.recipe_name.message}</p>}
                </div>
                <div className="mb-6">
                  <label htmlFor="description" className="block mb-2 text-sm font-medium dark:text-white">
                    Descripción
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: "La descripción es obligatoria" }}
                    render={({ field }) => (
                      <textarea
                        id="description"
                        className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                        placeholder="El clásico sabor favorito de las fiestas infantiles..."
                        rows="6"
                        style={{ resize: 'none' }}
                        {...field}
                      />
                    )}
                  />
                  {errors.description && <p className="text-red-600">{errors.description.message}</p>}
                </div>
              </div>
              <div className="w-full md:w-1/2 pl-2">
                <div className="grid gap-6 mb-6">
                  <div>
                    <label htmlFor="ingredient" className="block mb-2 text-sm font-medium dark:text-white">
                      Ingrediente
                    </label>
                    <Controller
                      name="ingredient"
                      control={control}
                      rules={{ required: "El ingrediente es obligatorio" }}
                      render={({ field }) => (
                        <input
                          type="text"
                          id="ingredient"
                          className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                          placeholder="Vainilla"
                          {...field}
                        />
                      )}
                    />
                    {errors.ingredient && <p className="text-red-600">{errors.ingredient.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="quantity" className="block mb-2 text-sm font-medium dark:text-white">
                      Cantidad
                    </label>
                    <Controller
                      name="quantity"
                      control={control}
                      rules={{ required: "La cantidad es obligatoria" }}
                      render={({ field }) => (
                        <input
                          type="number"
                          id="quantity"
                          className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                          placeholder="0.0"
                          {...field}
                        />
                      )}
                    />
                    {errors.quantity && <p className="text-red-600">{errors.quantity.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="price" className="block mb-2 text-sm font-medium dark:text-white">
                      Precio
                    </label>
                    <Controller
                      name="price"
                      control={control}
                      rules={{ required: "El precio es obligatorio" }}
                      render={({ field }) => (
                        <input
                          type="number"
                          id="price"
                          className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                          placeholder="0.0"
                          {...field}
                        />
                      )}
                    />
                    {errors.price && <p className="text-red-600">{errors.price.message}</p>}
                  </div>
                  <div className="flex items-end">
                    <div className="w-full">
                      <label htmlFor="unit" className="block mb-2 text-sm font-medium dark:text-white">
                        Unidad
                      </label>
                      <Controller
                        name="unit"
                        control={control}
                        defaultValue="grams"
                        render={({ field }) => (
                          <select
                            id="unit"
                            className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                            {...field}
                          >
                            <option value="grams">gramos</option>
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
            <div className="my-10 p-4 rounded-xl bg-rose-50">
              <h2 className={`text-3xl p-2 font-bold mb-4 ${sofia.className}`}>Lista de ingredientes</h2>
              {ingredientsList.length === 0 ? (
                <p className={`text-center text-gray-500`}>Todavía no se han agregado ingredientes.</p>
              ) : (
                <table className="w-full text-left text-sm text-text">
                  <thead className="text-xs text-text uppercase bg-rose-50">
                    <tr>
                      <th className="px-6 py-3">Ingrediente</th>
                      <th className="px-6 py-3">Cantidad</th>
                      <th className="px-6 py-3">Precio</th>
                      <th className="px-6 py-3">Unidad</th>
                      <th className="px-6 py-3">Total</th>
                      <th className="px-6 py-3">Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredientsList.map((ingredient, index) => (
                      <tr key={index} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                        <td className="px-6 py-4">{ingredient.ingredient}</td>
                        <td className="px-6 py-4">{ingredient.quantity}</td>
                        <td className="px-6 py-4">{ingredient.price}</td>
                        <td className="px-6 py-4">{ingredient.unit}</td>
                        <td className="px-6 py-4">{ingredient.total}</td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => handleDeleteIngredient(index)}
                            className="font-bold text-accent hover:underline"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="my-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              <div>
                <label htmlFor="profit_margin" className="block mb-2 text-sm font-medium dark:text-white">
                  Margen de ganancia (%)
                </label>
                <Controller
                  name="profit_margin"
                  control={control}
                  rules={{ required: "El margen de ganancia es obligatorio" }}
                  render={({ field }) => (
                    <input
                      type="number"
                      id="profit_margin"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="10"
                      {...field}
                    />
                  )}
                />
                {errors.profit_margin && <p className="text-red-600">{errors.profit_margin.message}</p>}
              </div>

              <div>
                <label htmlFor="portions" className="block mb-2 text-sm font-medium dark:text-white">
                  Porciones
                </label>
                <Controller
                  name="portions"
                  control={control}
                  rules={{ required: "El número de porciones es obligatorio" }}
                  render={({ field }) => (
                    <input
                      type="number"
                      id="portions"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="10"
                      {...field}
                    />
                  )}
                />
                {errors.portions && <p className="text-red-600">{errors.portions.message}</p>}
              </div>

              <div>
                <label htmlFor="fixed_costs_hours" className="block mb-2 text-sm font-medium dark:text-white">
                  Gastos fijos en horas
                </label>
                <Controller
                  name="fixed_costs_hours"
                  control={control}
                  rules={{ required: "Los gastos fijos en horas son obligatorios" }}
                  render={({ field }) => (
                    <input
                      type="number"
                      id="fixed_costs_hours"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="50"
                      {...field}
                    />
                  )}
                />
                {errors.fixed_costs_hours && <p className="text-red-600">{errors.fixed_costs_hours.message}</p>}
              </div>

              <div>
                <label htmlFor="tax_percentage" className="block mb-2 text-sm font-medium dark:text-white">
                  Porcentaje de impuestos (%)
                </label>
                <Controller
                  name="tax_percentage"
                  control={control}
                  rules={{ required: "El porcentaje de impuestos es obligatorio" }}
                  render={({ field }) => (
                    <input
                      type="number"
                      id="tax_percentage"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="16"
                      {...field}
                    />
                  )}
                />
                {errors.tax_percentage && <p className="text-red-600">{errors.tax_percentage.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              className="shadow-md text-white bg-secondary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center mb-16"
            >
              Guardar Receta
            </button>
          </form>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}

