import { useEffect } from "react";
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

export default function EditarTecnica() {
  const router = useRouter();
  const { id } = router.query;
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { userToken } = useAuth();

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE}/tecnicas/${id}`)
      .then((r) => r.json())
      .then(({ data }) => reset(data))
      .catch(console.error);
  }, [id]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${API_BASE}/tecnicas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          ...data,
          costoBase: parseFloat(data.costoBase),
          tiempoHoras: parseFloat(data.tiempoHoras),
          escalaPorPorcion: parseFloat(data.escalaPorPorcion),
        }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }
      Swal.fire({
        title: "Técnica actualizada",
        icon: "success",
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff1f2",
        color: "#540027",
      }).then(() => router.push("/dashboard/tecnicas"));
    } catch (err) {
      Swal.fire({ title: "Error", text: err.message, icon: "error", timer: 2000, showConfirmButton: false });
    }
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className={`text-text ${poppins.className} flex-grow w-3/4`}>
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Editar técnica creativa</h1>
          <form className="m-4 flex flex-col w-3/4 mx-auto" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">Nombre</label>
              <input
                type="text"
                {...register("nombre", { required: "Nombre es requerido" })}
                className="bg-gray-50 border border-secondary text-sm rounded-lg block w-full p-2.5"
              />
              {errors.nombre && <p className="text-red-600 text-xs mt-1">{errors.nombre.message}</p>}
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">Categoría</label>
              <select
                {...register("categoria", { required: true })}
                className="bg-gray-50 border border-secondary text-sm rounded-lg block w-full p-2.5"
              >
                <option value="decoracion">Decoración</option>
                <option value="relleno">Relleno</option>
                <option value="cobertura">Cobertura</option>
                <option value="modelado">Modelado</option>
                <option value="flores">Flores</option>
                <option value="impresion">Impresión</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 text-sm font-medium">Costo base ($)</label>
                <input
                  type="number" step="0.01" min="0"
                  {...register("costoBase", { required: true, min: 0 })}
                  className="bg-gray-50 border border-secondary text-sm rounded-lg block w-full p-2.5"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Tiempo (horas)</label>
                <input
                  type="number" step="0.25" min="0"
                  {...register("tiempoHoras", { required: true, min: 0 })}
                  className="bg-gray-50 border border-secondary text-sm rounded-lg block w-full p-2.5"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Costo extra por porción ($)</label>
                <input
                  type="number" step="0.01" min="0"
                  {...register("escalaPorPorcion", { required: true, min: 0 })}
                  className="bg-gray-50 border border-secondary text-sm rounded-lg block w-full p-2.5"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">Descripción (opcional)</label>
              <textarea
                {...register("descripcion")}
                rows={2}
                className="bg-gray-50 border border-secondary text-sm rounded-lg block w-full p-2.5"
              />
            </div>

            <div className="mb-6 flex items-center gap-3">
              <input type="checkbox" id="activo" {...register("activo")} className="w-4 h-4 accent-accent" />
              <label htmlFor="activo" className="text-sm font-medium">Técnica activa</label>
            </div>

            <div className="flex flex-col md:flex-row justify-center mb-10">
              <button
                type="submit"
                className="shadow-md text-text bg-primary hover:bg-accent hover:text-white font-medium rounded-lg text-sm w-72 px-16 py-2.5 text-center ml-2 m-6"
              >
                Guardar cambios
              </button>
              <Link href="/dashboard/tecnicas">
                <button type="button" className="shadow-md text-text bg-primary hover:bg-accent hover:text-white font-medium rounded-lg text-sm w-72 px-16 py-2.5 text-center ml-2 m-6">
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
