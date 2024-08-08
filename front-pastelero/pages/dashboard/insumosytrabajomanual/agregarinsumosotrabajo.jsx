import { useState } from "react";
import { useForm } from "react-hook-form";
import NavbarDashboard from "@/src/components/navbardashboard";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function NuevaReceta() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [costPerUnit, setCostPerUnit] = useState(0);

  const onSubmit = (data) => {
    console.log(data);
    fetch("http://localhost:3001/insumos", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    setValue("amount", value);
    const cost = e.target.form.elements.cost.value;
    setCostPerUnit(value && cost ? (parseFloat(cost) / parseFloat(value)).toFixed(2) : 0);
  };

  const handleCostChange = (e) => {
    const value = e.target.value;
    setValue("cost", value);
    const quantity = e.target.form.elements.quantity.value;
    setCostPerUnit(quantity && value ? (parseFloat(value) / parseFloat(quantity)).toFixed(2) : 0);
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex">
        <Asideadmin />
        <main className={`text-text ${poppins.className} flex-grow w-3/4`}>
          <h1 className={`text-4xl p-4 ${sofia.className}`}>
            Agregar insumos o trabajo manual
          </h1>
          <form
            className="m-4 flex flex-col w-3/4 mx-auto"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <div className="mb-6">
                <label
                  htmlFor="recipe_name"
                  className="block mb-2 text-sm font-medium dark:text-white"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="recipe_name"
                  {...register("name", { required: "Nombre es requerido" })}
                  className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                  placeholder="Pastel de vainilla"
                />
                {errors.name && <p className="text-red-600">{errors.name.message}</p>}
              </div>
              <div className="grid gap-6 mb-6">
                <div>
                  <label
                    htmlFor="quantity"
                    className="block mb-2 text-sm font-medium dark:text-white"
                  >
                    Cantidad
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    {...register("amount", { required: "Cantidad es requerida" })}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                    placeholder="0.0"
                    onChange={handleQuantityChange}
                  />
                  {errors.amount && <p className="text-red-600">{errors.amount.message}</p>}
                </div>
                <div>
                  <label
                    htmlFor="cost"
                    className="block mb-2 text-sm font-medium dark:text-white"
                  >
                    Costo
                  </label>
                  <input
                    type="number"
                    id="cost"
                    {...register("cost", { required: "Costo es requerido" })}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                    placeholder="0.0"
                    onChange={handleCostChange}
                  />
                  {errors.cost && <p className="text-red-600">{errors.cost.message}</p>}
                </div>
                <div className="flex items-end">
                  <div className="w-full">
                    <label
                      htmlFor="unit"
                      className="block mb-2 text-sm font-medium dark:text-white"
                    >
                      Unidad
                    </label>
                    <select
                      id="unit"
                      {...register("unit", { required: "Unidad es requerida" })}
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                    >
                      <option value="grams">gramos</option>
                      <option value="ml">mililitros</option>
                    </select>
                    {errors.unit && <p className="text-red-600">{errors.unit.message}</p>}
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center ml-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 m-6"
            >
              Agregar
            </button>
          </form>
          <div className="m-4 w-3/4 mx-auto text-lg">
            Costo por unidad: {costPerUnit} por gramo/ml
          </div>

          <FooterDashboard />
        </main>
      </div>
    </div>
  );
}
