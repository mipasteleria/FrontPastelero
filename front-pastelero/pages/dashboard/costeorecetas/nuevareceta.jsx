import { useState, useEffect, useCallback } from "react";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";
import { useAuth } from "@/src/context";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function NuevaReceta() {
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors } } = useForm();
  const { userToken } = useAuth();

  const [ingredientsList, setIngredientsList] = useState([]);
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  // Tarifas horarias globales (del settings de gastos fijos y mano de obra).
  const [tarifaFijaHora, setTarifaFijaHora] = useState(0);
  const [tarifaLaborHora, setTarifaLaborHora] = useState(0);
  // Desglose del cálculo — se actualiza en cada cambio relevante.
  const [breakdown, setBreakdown] = useState({
    materiales: 0,
    ieps: 0,
    additional: 0,
    manoObra: 0,
    fijos: 0,
    total: 0,              // ← lo que se guarda en total_cost (sin margen)
    sugerido: 0,           // ← preview con margen aplicado (informativo)
    costoPorPorcion: 0,    // ← total / porciones
    precioPorPorcion: 0,   // ← sugerido / porciones (informativo)
  });
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Watch a los campos que afectan el cálculo para recalcular en vivo.
  const watchSpecialTax     = watch("special_tax");
  const watchAdditional     = watch("additional_costs");
  const watchHoursLabor     = watch("hours_labor");
  const watchHoursFixed     = watch("hours_fixed");
  const watchProfitMargin   = watch("profit_margin");
  const watchPortions       = watch("portions");

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(`${API_BASE}/insumos`);
        setIngredientOptions(response.data);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    }

  const fetchCosts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/costs`);
      const data = response.data;
      setTarifaFijaHora(data.fixedCosts);
      setTarifaLaborHora(data.laborCosts);
      } catch (error) {
        console.error("Error fetching costs:", error);
      }
    };

    fetchIngredients();
    fetchCosts();
  }, [API_BASE]);

  const calculateTotal = useCallback(() => {
    const materiales = ingredientsList.reduce((acc, i) => acc + parseFloat(i.precio || 0), 0);
    const additional = parseFloat(watchAdditional || 0);
    const iepsPct    = parseFloat(watchSpecialTax || 0);
    const hoursLab   = parseFloat(watchHoursLabor || 0);
    const hoursFix   = parseFloat(watchHoursFixed || 0);
    const margenPct  = parseFloat(watchProfitMargin || 0);
    const porciones  = parseFloat(watchPortions || 0);

    const subBruto = materiales + additional;
    const ieps     = subBruto * iepsPct / 100;
    const manoObra = hoursLab * tarifaLaborHora;
    const fijos    = hoursFix * tarifaFijaHora;

    // total_cost: ingredientes + additional + IEPS + mano de obra + fijos
    // (NO incluye margen — el margen se aplica al cotizar).
    const total = subBruto + ieps + manoObra + fijos;
    const sugerido = total * (1 + margenPct / 100);

    // Costo / precio por porción. Si porciones es 0 o vacío, dejamos 0.
    const costoPorPorcion  = porciones > 0 ? total / porciones : 0;
    const precioPorPorcion = porciones > 0 ? sugerido / porciones : 0;

    setBreakdown({
      materiales:       round2(materiales),
      additional:       round2(additional),
      ieps:             round2(ieps),
      manoObra:         round2(manoObra),
      fijos:            round2(fijos),
      total:            round2(total),
      sugerido:         round2(sugerido),
      costoPorPorcion:  round2(costoPorPorcion),
      precioPorPorcion: round2(precioPorPorcion),
    });
  }, [ingredientsList, watchSpecialTax, watchAdditional, watchHoursLabor, watchHoursFixed, watchProfitMargin, watchPortions, tarifaLaborHora, tarifaFijaHora]);

  useEffect(() => { calculateTotal(); }, [calculateTotal]);

  function round2(n) { return Math.round(n * 100) / 100; }
  
  const handleAddIngredient = () => {
    const { ingrediente, unidad } = getValues();
    const cantidadRaw = parseFloat(getValues("cantidad") || 0);
    if (!ingrediente?.trim() || !cantidadRaw) return;

    let precio, total;
    if (selectedIngredient?.cost && selectedIngredient?.amount) {
      // Costo proporcional: (precio_paquete / cantidad_paquete) × cantidad_usada
      const unitCost = selectedIngredient.cost / selectedIngredient.amount;
      precio = Math.round(unitCost * cantidadRaw * 100) / 100;
      total  = Math.round(unitCost * 100) / 100;
    } else {
      // Entrada manual sin insumo seleccionado del catálogo
      precio = parseFloat(getValues("precio") || 0);
      total  = cantidadRaw ? Math.round((precio / cantidadRaw) * 100) / 100 : 0;
    }

    const newIngredient = {
      insumoId: selectedIngredient?._id || null,
      ingrediente,
      cantidad: cantidadRaw,
      precio,
      unidad,
      total,
    };

    setIngredientsList(prev => [...prev, newIngredient]);
    // Limpiar todos los campos del form de ingrediente para que el
    // admin pueda seguir agregando sin tener que borrar manualmente.
    setValue("ingrediente", "");
    setValue("cantidad", "");
    setValue("precio", "");
    setValue("unidad", "gramos"); // vuelve al default del select
    setSelectedIngredient(null);
  };

  const handleDeleteIngredient = (index) => {
    setIngredientsList(prevIngredients => {
      const newIngredients = prevIngredients.filter((_, i) => i !== index);
      calculateTotal();
      return newIngredients;
    });
  };

  /**
   * Editar un ingrediente: carga sus datos al form (resucitando el
   * selectedIngredient del catálogo si aplica) y lo retira de la lista.
   * Cuando el admin edita y vuelve a hacer click en "Agregar", entra
   * con los valores actualizados.
   */
  const handleEditIngredient = (index) => {
    const ing = ingredientsList[index];
    if (!ing) return;
    const insumoCatalogo =
      ingredientOptions.find(o => o._id === ing.insumoId) ||
      ingredientOptions.find(o => o.name === ing.ingrediente) ||
      null;
    setSelectedIngredient(insumoCatalogo);
    setValue("ingrediente", ing.ingrediente);
    setValue("cantidad", ing.cantidad);
    setValue("precio", ing.precio);
    setValue("unidad", ing.unidad);
    setIngredientsList(prev => prev.filter((_, i) => i !== index));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onInputChange = () => calculateTotal();
  
  const onSubmit = async (data) => {
    data.ingredientes = ingredientsList;
    data.total_cost = breakdown.total;       // ya incluye mano de obra + fijos
    data.hours_labor = parseFloat(data.hours_labor || 0);
    data.hours_fixed = parseFloat(data.hours_fixed || 0);
    // Snapshots de tarifas al momento de guardar (campos legacy, opcionales).
    data.fixed_costs = tarifaFijaHora;
    data.fixed_costs_hours = tarifaLaborHora;
  
    try {
      const response = await axios.post(`${API_BASE}/recetas/recetas`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        }
      });

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: '¡Receta Creada!',
          text: 'La nueva receta ha sido guardada',
          icon: 'success',
          background: '#fff1f2',
          color: '#540027',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          // Restablece los valores del formulario
          setValue('nombre_receta', '');
          setValue('descripcion', '');
          setValue('ingrediente', '');
          setValue('cantidad', '');
          setValue('precio', '');
          setValue('unidad', '');
          setValue('special_tax', '');
          setValue('additional_costs', '');
          setValue('portions', '');
          setValue('profit_margin', '');
          setValue('hours_labor', '');
          setValue('hours_fixed', '');
          setIngredientsList([]);
          setBreakdown({ materiales: 0, additional: 0, ieps: 0, manoObra: 0, fijos: 0, total: 0, sugerido: 0, costoPorPorcion: 0, precioPorPorcion: 0 });
        });
      } else {
        Swal.fire({
          title: 'Error al guardar la receta',
          text: 'Ocurrió un problema al guardar la receta. Por favor, intenta nuevamente.',
          icon: 'error',
          background: '#fff1f2',
          color: '#540027',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Error al guardar la receta:", error);
      Swal.fire({
        title: 'Error al guardar la receta',
        text: 'Ocurrió un problema al guardar la receta. Por favor, intenta nuevamente.',
        icon: 'error',
        background: '#fff1f2',
        color: '#540027',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  };  
  
  const renderInput = (id, label, type = "text", placeholder, validation) => (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium dark:text-white">{label}</label>
      <Controller
        name={id}
        control={control}
        rules={{ required: validation }}
        render={({ field }) => (
          <input
            type={type}
            id={id}
            className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary"
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
    <div 
    className={`text-text ${poppins.className}`}>
      <NavbarAdmin 
      className="fixed top-0 w-full z-50" />
      <div 
      className="flex flex-row mt-16">
        <Asideadmin />
        <main 
        className={`text-text ${poppins.className} flex-grow w-3/4 max-w-screen-lg mx-auto`}>
          <h1 
          className={`text-4xl p-4 ${sofia.className}`}>Nueva Receta</h1>
          <form 
          className="m-4" 
          onSubmit={handleSubmit(onSubmit)}>
            <div 
            className="flex flex-wrap">
              <div 
              className="w-full md:w-1/2 px-2">
                <div 
                className="mb-4">
                  {renderInput("nombre_receta", "Nombre de la receta", "text", "Pastel de vainilla", "El nombre de la receta es obligatorio")}
                </div>
                <div 
                className="mb-4">
                  {renderInput("descripcion", "Descripción", "textarea", "El clásico sabor favorito de las fiestas infantiles...", "La descripción es obligatoria")}
                </div>
              </div>
              <div 
              className="w-full md:w-1/2 pl-2">
                <div 
                className="grid gap-6 mb-6">
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
                            const found = ingredientOptions.find(o => o.name === e.target.value);
                            setSelectedIngredient(found || null);
                            if (found) setValue("unidad", found.unit);
                          }}
                        >
                          <option value="">Selecciona un ingrediente</option>
                          {ingredientOptions.map(option => (
                            <option key={option._id} value={option.name}>{option.name} — ${option.cost}/{option.amount}{option.unit}</option>
                          ))}
                        </select>
                      )}
                    />
                  </div>
                  {renderInput("cantidad", "Cantidad", "number", "0.0", "")}

                  {/* Precio: si hay ingrediente del catálogo, se calcula
                      automáticamente desde su cost/amount × cantidad.
                      Sólo se pide manualmente si no hay ingrediente
                      seleccionado del catálogo (caso legacy). */}
                  {selectedIngredient && selectedIngredient.cost && selectedIngredient.amount ? (
                    <div className="w-full">
                      <label className="block text-sm font-medium dark:text-white">Precio calculado</label>
                      <div className="bg-gray-50 border border-secondary text-sm rounded-lg p-2.5 text-gray-700">
                        <span className="font-bold">
                          ${((selectedIngredient.cost / selectedIngredient.amount) * (parseFloat(watch("cantidad")) || 0)).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          (${selectedIngredient.cost}/{selectedIngredient.amount}{selectedIngredient.unit} × cantidad)
                        </span>
                      </div>
                    </div>
                  ) : selectedIngredient && (!selectedIngredient.cost || !selectedIngredient.amount) ? (
                    <>
                      <p className="text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-lg p-2.5">
                        Este insumo no tiene precio/cantidad en el catálogo. Edítalo en <Link href="/dashboard/insumosytrabajomanual" className="underline font-bold">Insumos</Link> y vuelve aquí, o ingresa el precio manualmente abajo.
                      </p>
                      {renderInput("precio", "Precio manual", "number", "0.0", "")}
                    </>
                  ) : (
                    renderInput("precio", "Precio", "number", "0.0", "")
                  )}

                  <div className="flex items-end">
                    {/* Unidad: si viene del catálogo, mostrar como texto
                        (no editable). Si no, dejar el select para
                        compatibilidad con entrada manual. */}
                    {selectedIngredient ? (
                      <div className="w-full">
                        <label className="block mb-2 text-sm font-medium dark:text-white">Unidad</label>
                        <div className="bg-gray-50 border border-secondary text-sm rounded-lg p-2.5 text-gray-700">
                          {selectedIngredient.unit || "—"}
                        </div>
                      </div>
                    ) : (
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
                    )}
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
              <h2 className={`text-3xl p-2 font-bold mb-4 ${sofia.className}`}>Lista de ingredientes</h2>
              {ingredientsList.length === 0 ? (
                <p className="text-center text-gray-500">Todavía no se han agregado ingredientes.</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="text-xs text-text uppercase bg-rose-50">
                    <tr>
                      <th className="px-6 py-3 text-left">Ingrediente</th>
                      <th className="px-6 py-3 text-left">Cantidad</th>
                      <th className="px-6 py-3 text-left">Precio</th>
                      <th className="px-6 py-3 text-left">Unidad</th>
                      <th className="px-6 py-3 text-left">Costo por gr/ml</th>
                      <th className="px-6 py-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredientsList.map((ingredient, index) => (
                      <tr key={index} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                        <td className="px-6 py-4 text-left">{ingredient.ingrediente}</td>
                        <td className="px-6 py-4 text-left">{ingredient.cantidad}</td>
                        <td className="px-6 py-4 text-left">{ingredient.precio}</td>
                        <td className="px-6 py-4 text-left">{ingredient.unidad}</td>
                        <td className="px-6 py-4 text-left">{ingredient.total}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleEditIngredient(index)}
                              title="Editar ingrediente"
                              style={{ color: "var(--burdeos)" }}
                              className="hover:opacity-70"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586Z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteIngredient(index)}
                              title="Borrar ingrediente"
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              {/* ── Mano de obra ──────────────────────────── */}
              <div className="w-full">
                <label className="block text-sm font-medium dark:text-white">Mano de obra</label>
                <p className="bg-gray-50 border border-secondary text-sm rounded-lg p-2.5 text-gray-600">
                  Tarifa: <strong>${(tarifaLaborHora || 0).toFixed(2)}/hora</strong>
                  <span className="text-xs text-gray-400 ml-2">(configurable en Gastos fijos y mano de obra)</span>
                </p>
              </div>
              {renderInput(
                "hours_labor",
                "Horas de mano de obra",
                "number",
                "0.0",
                ""
              )}

              {/* ── Gastos fijos ──────────────────────────── */}
              <div className="w-full">
                <label className="block text-sm font-medium dark:text-white">Gastos fijos</label>
                <p className="bg-gray-50 border border-secondary text-sm rounded-lg p-2.5 text-gray-600">
                  Tarifa: <strong>${(tarifaFijaHora || 0).toFixed(2)}/hora</strong>
                  <span className="text-xs text-gray-400 ml-2">(configurable en Gastos fijos y mano de obra)</span>
                </p>
              </div>
              {renderInput(
                "hours_fixed",
                "Horas de gastos fijos (uso del taller)",
                "number",
                "0.0",
                ""
              )}

              {renderInput(
                "special_tax",
                "IEPS (%)", "number",
                "0.0",
                "El IEPS es obligatorio")}
              {renderInput(
                "additional_costs",
                "Costos adicionales",
                "number", "0.0",
                "Los costos adicionales son obligatorios")}
              {renderInput(
                "portions",
                "Porciones",
                "number", "0",
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
            <div className="my-10 p-6 rounded-xl bg-rose-50">
              <h2 className={`text-3xl font-bold mb-4 ${sofia.className}`}>Desglose del costo</h2>
              <table className="w-full text-sm">
                <tbody>
                  <tr><td className="py-1">Materiales (ingredientes)</td><td className="py-1 text-right">${breakdown.materiales.toFixed(2)}</td></tr>
                  <tr><td className="py-1">Costos adicionales</td><td className="py-1 text-right">${breakdown.additional.toFixed(2)}</td></tr>
                  <tr><td className="py-1">IEPS</td><td className="py-1 text-right">${breakdown.ieps.toFixed(2)}</td></tr>
                  <tr><td className="py-1">Mano de obra ({parseFloat(watchHoursLabor || 0)}h × ${tarifaLaborHora.toFixed(2)})</td><td className="py-1 text-right">${breakdown.manoObra.toFixed(2)}</td></tr>
                  <tr><td className="py-1">Gastos fijos ({parseFloat(watchHoursFixed || 0)}h × ${tarifaFijaHora.toFixed(2)})</td><td className="py-1 text-right">${breakdown.fijos.toFixed(2)}</td></tr>
                  <tr className="border-t border-secondary"><td className="py-2 font-bold">Costo total de la receta</td><td className="py-2 text-right font-bold text-lg">${breakdown.total.toFixed(2)}</td></tr>
                  <tr><td className="py-1 text-gray-600 pl-4">Costo por porción ({parseFloat(watchPortions || 0)} porciones)</td><td className="py-1 text-right text-gray-600">${breakdown.costoPorPorcion.toFixed(2)}</td></tr>
                  <tr><td className="py-1 text-gray-600">+ Margen de ganancia ({parseFloat(watchProfitMargin || 0)}%)</td><td className="py-1 text-right text-gray-600">${(breakdown.sugerido - breakdown.total).toFixed(2)}</td></tr>
                  <tr className="border-t border-secondary"><td className="py-2 font-bold" style={{ color: "var(--burdeos)" }}>Precio sugerido (con margen)</td><td className="py-2 text-right font-bold text-xl" style={{ color: "var(--burdeos)" }}>${breakdown.sugerido.toFixed(2)}</td></tr>
                  <tr><td className="py-1 pl-4" style={{ color: "var(--burdeos)" }}><strong>Precio sugerido por porción</strong></td><td className="py-1 text-right font-bold text-lg" style={{ color: "var(--burdeos)" }}>${breakdown.precioPorPorcion.toFixed(2)}</td></tr>
                </tbody>
              </table>
              <p className="text-xs text-gray-500 mt-4">
                El <strong>Costo total</strong> es lo que se guarda en la receta. El <strong>precio sugerido</strong> es informativo — el margen final se aplica al cotizar (puede ser distinto al de esta receta si la cotización ajusta).
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-10 justify-center">
              <button
                type="submit"
                className="shadow-md text-white bg-accent hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center md:mb-20"
              >
                Guardar Receta
              </button>
              <Link 
              href={"/dashboard/costeorecetas"}>
                <button
                  className="shadow-md text-white bg-accent hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center mb-20"
                >
                  Regresar
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