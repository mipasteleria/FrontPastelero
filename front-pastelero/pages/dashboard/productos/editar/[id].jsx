import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function EditarProducto() {
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();
  const { id } = router.query;
  const [fotosActuales, setFotosActuales] = useState([]);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE}/productos/${id}`)
      .then((r) => r.json())
      .then(async (json) => {
        const data = json.data;
        reset({ ...data, orden: data.orden ?? 0 });
        if (data.fotos?.length) {
          const urls = await Promise.all(
            data.fotos.map((fn) =>
              fetch(`${API_BASE}/image-url/${encodeURIComponent(fn)}`)
                .then((r) => r.json())
                .then((j) => j.url)
                .catch(() => null)
            )
          );
          setFotosActuales(urls.filter(Boolean));
        }
      });
  }, [id, reset]);

  const uploadFotos = async (files) => {
    if (!files || files.length === 0) return null;
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error("Error subiendo fotos");
    const data = await res.json();
    return data.map((f) => f.fileName);
  };

  const onSubmit = async (data) => {
    try {
      let fotos = undefined;
      if (data.nuevasFotos && data.nuevasFotos.length > 0) {
        fotos = await uploadFotos(data.nuevasFotos);
      }
      const token = localStorage.getItem("token");
      const body = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        orden: parseInt(data.orden, 10) || 0,
        activo: data.activo === true || data.activo === "true",
      };
      if (fotos) body.fotos = fotos;

      const res = await fetch(`${API_BASE}/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Error actualizando producto");
      Swal.fire({ title: "¡Actualizado!", icon: "success", timer: 1500, showConfirmButton: false, background: "#fff1f2", color: "#540027" })
        .then(() => router.push("/dashboard/productos"));
    } catch (err) {
      Swal.fire({ title: "Error", text: err.message, icon: "error", background: "#fff1f2", color: "#540027" });
    }
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin />
      <div className="flex mt-16">
        <Asideadmin />
        <main className="flex-grow p-6 max-w-xl">
          <h1 className={`text-3xl mb-6 ${sofia.className}`}>Editar Producto</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="block font-semibold mb-1">Nombre *</label>
              <input {...register("nombre", { required: true })} className="border rounded p-2 w-full" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Descripción</label>
              <textarea {...register("descripcion")} rows={3} className="border rounded p-2 w-full" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Orden de aparición</label>
              <input {...register("orden")} type="number" min={0} className="border rounded p-2 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <input {...register("activo")} type="checkbox" id="activo" className="w-4 h-4" />
              <label htmlFor="activo" className="font-semibold">Activo (visible en el home)</label>
            </div>
            {fotosActuales.length > 0 && (
              <div>
                <label className="block font-semibold mb-1">Fotos actuales</label>
                <div className="flex flex-wrap gap-2">
                  {fotosActuales.map((url, i) => (
                    <img key={i} src={url} alt={`Foto ${i + 1}`} className="w-24 h-24 object-cover rounded-lg border border-secondary" />
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="block font-semibold mb-1">Reemplazar fotos (opcional)</label>
              <input {...register("nuevasFotos")} type="file" multiple accept="image/*" className="border rounded p-2 w-full" />
              <p className="text-xs text-gray-500 mt-1">Si subes nuevas fotos, reemplazarán las anteriores.</p>
            </div>
            <div className="flex gap-4 mt-2">
              <button type="submit" className="bg-primary font-semibold px-6 py-2 rounded-lg hover:bg-accent hover:text-white transition-colors">
                Guardar cambios
              </button>
              <Link href="/dashboard/productos" className="px-6 py-2 rounded-lg border hover:bg-gray-100 transition-colors">
                Cancelar
              </Link>
            </div>
          </form>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}
