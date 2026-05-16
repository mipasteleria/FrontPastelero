import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import Link from "next/link";
import Swal from "sweetalert2";
import { useAuth } from "@/src/context";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function NuevaReceta() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const [costPerUnit, setCostPerUnit] = useState(0);
  const { userToken } = useAuth();
  const router = useRouter();

  // ── Autocomplete: muestra insumos similares mientras se tipea el nombre.
  // Hace fetch a /insumos/buscar-similares con debounce 400ms; ayuda al
  // admin a no crear duplicados semánticos como "Macadamia" vs
  // "Nuez de Macadamia".
  const [suggestions, setSuggestions] = useState([]);
  const [searchBusy, setSearchBusy] = useState(false);
  const nameValue = watch("name", "");
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = (nameValue || "").trim();
    if (q.length < 2) { setSuggestions([]); setSearchBusy(false); return; }
    setSearchBusy(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/insumos/buscar-similares?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const json = await res.json();
          setSuggestions(json.data || []);
        }
      } catch (err) {
        // Silencioso — el autocomplete es opcional.
      } finally {
        setSearchBusy(false);
      }
    }, 400);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [nameValue]);

  // ── Submit con manejo de 409 (duplicado bloqueado por el back).
  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${API_BASE}/insumos`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        Swal.fire({
          title: "¡Éxito!",
          text: "Insumo agregado correctamente.",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#fff1f2",
          color: "#540027",
        }).then(() => {
          setValue("name", "");
          setValue("amount", "");
          setValue("cost", "");
          setValue("unit", "");
          setCostPerUnit(0);
          setSuggestions([]);
        });
        return;
      }

      // Caso especial: duplicado detectado por el back
      if (response.status === 409) {
        const json = await response.json().catch(() => ({}));
        const existente = json.existente;
        const result = await Swal.fire({
          title: "Insumo duplicado",
          html: existente
            ? `Ya existe <b>"${existente.name}"</b> con ${existente.amount} ${existente.unit} a $${existente.cost}.<br>¿Quieres editarlo en vez de crear uno nuevo?`
            : json.message || "Ya existe un insumo con ese nombre.",
          icon: "warning",
          showCancelButton: !!existente,
          confirmButtonText: existente ? "Editar el existente" : "Entendido",
          cancelButtonText: "Cancelar",
          background: "#fff1f2",
          color: "#540027",
        });
        if (result.isConfirmed && existente) {
          router.push(`/dashboard/insumosytrabajomanual/editarinsumosotrabajo/${existente._id}`);
        }
        return;
      }

      const json = await response.json().catch(() => ({}));
      Swal.fire({
        title: "Error",
        text: json.message || "No se pudo agregar el insumo.",
        icon: "error",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff1f2",
        color: "#540027",
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "Error al conectar con el servidor.",
        icon: "error",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff1f2",
        color: "#540027",
      });
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    setValue("amount", value);
    const cost = e.target.form.elements.cost.value;
    setCostPerUnit(
      value && cost ? (parseFloat(cost) / parseFloat(value)).toFixed(2) : 0
    );
  };

  const handleCostChange = (e) => {
    const value = e.target.value;
    setValue("cost", value);
    const quantity = e.target.form.elements.quantity.value;
    setCostPerUnit(
      quantity && value
        ? (parseFloat(value) / parseFloat(quantity)).toFixed(2)
        : 0
    );
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
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
                  autoComplete="off"
                  {...register("name", { required: "Nombre es requerido" })}
                  className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                  placeholder="Pastel de vainilla"
                />
                {errors.name && (
                  <p className="text-red-600">{errors.name.message}</p>
                )}

                {/* Sugerencias: aparecen cuando hay nombres similares ya
                    en BD. No bloquean nada — solo avisan al admin para
                    evitar duplicados semánticos ("Macadamia" vs
                    "Nuez de Macadamia"). */}
                {(searchBusy || suggestions.length > 0) && (
                  <div
                    className="mt-2 rounded-lg border p-3"
                    style={{ background: "#fff8e1", borderColor: "#FFC107" }}
                  >
                    {searchBusy ? (
                      <p className="text-xs" style={{ color: "#6B4F1A" }}>Buscando insumos similares…</p>
                    ) : (
                      <>
                        <p className="text-xs font-semibold mb-2" style={{ color: "#6B4F1A" }}>
                          ⚠️ Insumos similares ya en BD ({suggestions.length}). Revisa antes de duplicar:
                        </p>
                        <ul className="space-y-1">
                          {suggestions.map((s) => (
                            <li key={s._id} className="flex items-center justify-between text-sm">
                              <span style={{ color: "#540027" }}>
                                <b>{s.name}</b> · {s.amount} {s.unit} · ${s.cost}
                              </span>
                              <Link
                                href={`/dashboard/insumosytrabajomanual/editarinsumosotrabajo/${s._id}`}
                                className="text-xs underline"
                                style={{ color: "#9c2a44" }}
                              >
                                Editar este
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div
              className="grid gap-6 mb-6">
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
                    {...register("amount", {
                      required: "Cantidad es requerida",
                    })}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                    placeholder="0.0"
                    onChange={handleQuantityChange}
                  />
                  {errors.amount && (
                    <p className="text-red-600">{errors.amount.message}</p>
                  )}
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
                  {errors.cost && (
                    <p className="text-red-600">{errors.cost.message}</p>
                  )}
                </div>
                <div
                className="flex items-end">
                  <div
                  className="w-full">
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
                      <option value="gr">gramos</option>
                      <option value="ml">mililitros</option>
                      <option value="pza">piezas</option>
                    </select>
                    {errors.unit && (
                      <p className="text-red-600">{errors.unit.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div
            className="m-4 w-3/4 mx-auto text-lg">
              Costo unitario: {costPerUnit}
            </div>
            <div
            className="flex flex-col md:flex-row justify-center mb-10">
            <button
              type="submit"
              className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-72 px-16 py-2.5 text-center ml-2 m-6"
            >
              Agregar
            </button>
            <Link
            className=""
            href={"/dashboard/insumosytrabajomanual"}>
              <button
                type=""
                className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-72 px-16 py-2.5 text-center ml-2 m-6"
              >
                Regresar
              </button>
            </Link>
            </div>
          </form>
          <FooterDashboard />
        </main>
      </div>
    </div>
  );
}
