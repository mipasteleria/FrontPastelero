import { useState, useEffect } from "react";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function EditarReceta() {
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();
  const [ingredientsList, setIngredientsList] = useState([]);
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const { id } = router.query; // Obtén el ID de la receta del query string
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get('https://back-pastelero-gamma.vercel.app/insumos');
        setIngredientOptions(response.data);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    fetchIngredients();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchReceta = async () => {
        try {
          const response = await axios.get(
            `${API_BASE}/recetas/recetas/${id}`
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
  }, [id, getValues, setValue, API_BASE]);

  const calculateTotal = () => {
    const ingredientTotal = ingredientsList.reduce(
      (acc, ingredient) => acc + parseFloat(ingredient.precio || 0),
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
    const total = (parseFloat(precio) || 0) / (parseFloat(cantidad) || 1);
    const newIngredient = { ingrediente, cantidad, precio: parseFloat(precio), unidad, total: total.toFixed(2) };

    console.log("Form Data on Add:", getValues());
    console.log("Ingredient to be Added:", newIngredient);

    setIngredientsList(prevIngredients => {
      const newIngredients = [...prevIngredients, newIngredient];
      calculateTotal();
      return newIngredients;
    });
    calculateTotal();
    setValue("cantidad", "");
    setSelectedIngredient(null);
  } else {
    console.error("Faltan valores para agregar el ingrediente");
  }
};

  const handleDeleteIngredient = (index) =>
    setIngredientsList(ingredientsList.filter((_, i) => i !== index));

  const onInputChange = () => calculateTotal();

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      ingredientes: ingredientsList, // Asegúrate de que ingredientsList esté en el formato correcto
      total_cost: total
    };
  
    console.log("Datos enviados:", formattedData);
  
    try {
      const response = await axios.put(
        `${API_BASE}/recetas/recetas/${id}`,
        formattedData,
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
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main
          className={`text-text ${poppins.className} flex-grow w-3/4 max-w-screen-lg mx-auto`}
        >
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Editar Receta</h1>
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
                  <div className="w-full">
                    <label htmlFor="ingrediente" className="block text-sm font-medium dark:text-white">Ingrediente</label>
                    <Controller
                      name="ingrediente"
                      control={control}
                      render={({ field }) => (
                        <select
                          id="ingrediente"
                          className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setSelectedIngredient(e.target.value);
                            const selectedIngredientData = ingredientOptions.find(option => option.name === e.target.value);
                            if (selectedIngredientData) {
                              setValue("precio", selectedIngredientData.cost);
                              setValue("unidad", selectedIngredientData.unit);
                            }
                          }}
                        >
                          <option value="">Selecciona un ingrediente</option>
                          {ingredientOptions.map(option => (
                            <option key={option._id} value={option.name}>{option.name}</option>
                          ))}
                        </select>
                      )}
                    />
                  </div>
                  {renderInput("cantidad", "Cantidad", "number", "0.0", "")}
                  {renderInput("precio", "Precio", "number", "0.0", "")}
                  <div className="flex items-end">
                  <div className="w-full">
                      <label htmlFor="unidad" className="block mb-2 text-sm font-medium dark:text-white">Unidad</label>
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
                "fixed_costs_hours",
                "Mano de obra",
                "number",
                "0.0",
                ""
              )}
            {renderInput(
              "fixed_costs", 
              "Costos fijos", 
              "number", 
              "0.0", 
              "")}
            {renderInput(
              "special_tax", 
              "IEPS (%)", 
              "number", 
              "0.0", 
              "")}
            {renderInput(
                "additional_costs",
                "Costos adicionales",
                "number",
                "0.0",
                ""
              )}
              {renderInput(
                "portions", 
                "Porciones", 
                "number", 
                "0", 
                "El número de porciones es obligatorio")}
              {renderInput(
                "profit_margin",
                "Margen de ganancia (%)",
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
              <p id="total_cost" className="text-center text-2xl">
                {total !== null ? total.toFixed(2) : "0.00"} MXN
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-10 justify-center">
            <button
                type="submit"
                className="shadow-md text-white bg-accent hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center"
              >
                Guardar Receta
              </button>
              <Link href="/dashboard/costeorecetas">
                <button className="shadow-md text-white bg-secondary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center">
                  Cancelar
                </button>
              </Link>
            </div>
          </form>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}
