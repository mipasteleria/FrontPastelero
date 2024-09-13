import { useState, useEffect, useCallback } from "react";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";

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
  const [fixedCosts, setFixedCosts] = useState(0);
  const [fixedCostsHours, setFixedCostsHours] = useState(0);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const { id } = router.query; // Obtén el ID de la receta del query string
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(`${API_BASE}/insumos`);
        setIngredientOptions(response.data);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };
  
    const fetchCosts = async () => {
      try {
        const response = await axios.get(`${API_BASE}/costs/66dc00a6b33d98dd9e2b91a9`);
        const data = response.data;
        setFixedCosts(data.fixedCosts);
        setFixedCostsHours(data.laborCosts);
    
        // Calcula el total inicial con los costos obtenidos
        const ingredientTotal = ingredientsList.reduce(
          (acc, ingredient) => acc + parseFloat(ingredient.precio || 0),
          0
        );
    
        const specialTaxValue = parseFloat(getValues("special_tax") || 0);
        const additionalCostsValue = parseFloat(getValues("additional_costs") || 0);
        const profitMarginValue = parseFloat(getValues("profit_margin") || 0);
    
        const totalCost =
          ingredientTotal + data.fixedCosts + data.laborCosts + additionalCostsValue;
    
        const initialTotal =
          totalCost +
          (totalCost * profitMarginValue) / 100 +
          (totalCost * specialTaxValue) / 100;
    
        setTotal(initialTotal);
      } catch (error) {
        console.error("Error fetching costs:", error);
      }
    };    

    fetchIngredients();
    fetchCosts();
  }, [ingredientsList, API_BASE, getValues]);

  useEffect(() => {
    if (id) {
      const fetchReceta = async () => {
        try {
          const response = await axios.get(
            `${API_BASE}/recetas/recetas/${id}`
          );
          const receta = response.data.data;

          setValue("nombre_receta", receta.nombre_receta);
          setValue("descripcion", receta.descripcion);
          setValue("profit_margin", receta.profit_margin);
          setValue("portions", receta.portions);
          setValue("special_tax", receta.special_tax);
          setValue("additional_costs", receta.additional_costs);
          setValue("total_cost", receta.total_cost);
          setTotal(receta.total_cost);

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

  const calculateTotal = useCallback(() => {
    const ingredientTotal = ingredientsList.reduce((acc, ingredient) => acc + parseFloat(ingredient.precio || 0), 0);
    const { 
      special_tax, 
      additional_costs, 
      profit_margin 
    } = getValues();
  
    const specialTaxValue = parseFloat(special_tax || 0);
    const additionalCostsValue = parseFloat(additional_costs || 0);
    const profitMarginValue = parseFloat(profit_margin || 0);
    const totalCost = 
    ingredientTotal + 
    fixedCosts + 
    fixedCostsHours + 
    additionalCostsValue;
  
    const totalWithProfit = 
    totalCost + 
    (totalCost * profitMarginValue / 100) + 
    (totalCost * specialTaxValue / 100);
  
    setTotal(totalWithProfit);
  }, [ingredientsList, getValues, fixedCosts, fixedCostsHours]);

  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

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
    setValue("cantidad", "");
    setSelectedIngredient(null);
  } else {
    console.error("Faltan valores para agregar el ingrediente");
  }
};

const handleDeleteIngredient = (index) => {
  setIngredientsList(prevIngredients => {
    const newIngredients = prevIngredients.filter((_, i) => i !== index);
    calculateTotal();
    return newIngredients;
  });
};  

  const onInputChange = () => calculateTotal();

  const onSubmit = async (data) => {
    data.ingredientes = ingredientsList;
    data.total_cost = total;
    data.fixed_costs = fixedCosts;
    data.fixed_costs_hours = fixedCostsHours;

    try {
      const response = await axios.put(
        `${API_BASE}/recetas/recetas/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        Swal.fire({
          title: "¡Receta Actualizada!",
          text: "Receta guardada correctamente.",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#fff1f2",
          color: "#540027",
        });
      } else {
        throw new Error("Error al guardar la receta.");
      }
    } catch (error) {
      console.error("Error al guardar la receta:", error);
      // Alerta de error
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar la receta. Por favor, inténtalo de nuevo.",
        icon: "error",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff1f2",
        color: "#540027",
      });
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
              onInputChange();
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
          <form 
          className="m-4" 
          onSubmit={handleSubmit(onSubmit)}>
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
                <div className="w-full">
                  <label htmlFor="fixed_costs" className="block text-sm font-medium dark:text-white">Mano de obra</label>
                  <p id="fixed_costs" className="bg-gray-50 border border-secondary text-sm rounded-lg p-2.5">{(fixedCostsHours || 0).toFixed(2)}</p>
                </div>
                <div className="w-full">
                  <label htmlFor="fixed_costs_hours" className="block text-sm font-medium dark:text-white">Gastos fijos</label>
                  <p id="fixed_costs_hours" className="bg-gray-50 border border-secondary text-sm rounded-lg p-2.5">{(fixedCosts || 0).toFixed(2)}</p>
                </div>
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
              <div 
              className="w-full">
                <label 
                htmlFor="profit_margin" 
                className="block text-sm font-medium dark:text-white">Margen de ganancia (%)</label>
                <Controller
                  name="profit_margin"
                  control={control}
                  rules={{ required: "El margen de ganancia es obligatorio" }}
                  render={({ field }) => (
                    <input
                      type="number"
                      id="profit_margin"
                      className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary"
                      placeholder="10"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        onInputChange();
                      }}
                    />
                  )}
                />
                {errors.profit_margin && <p className="text-red-600">{errors.profit_margin.message}</p>}
              </div>
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
