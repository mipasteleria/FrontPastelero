import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AgregarProducto() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const uploadFotos = async (files) => {
    if (!files || files.length === 0) return [];
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
      let fotos = [];
      if (data.fotos && data.fotos.length > 0) {
        fotos = await uploadFotos(data.fotos);
      }
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          nombre: data.nombre,
          descripcion: data.descripcion,
          orden: parseInt(data.orden, 10) || 0,
          fotos,
        }),
      });
      if (!res.ok) throw new Error("Error creando producto");
      Swal.fire({ title: "¡Producto creado!", icon: "success", timer: 1500, showConfirmButton: false, background: "#fff1f2", color: "#540027" })
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
          <h1 className={`text-3xl mb-6 ${sofia.className}`}>Agregar Producto</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="block font-semibold mb-1">Nombre *</label>
              <input {...register("nombre", { required: true })} className="border rounded p-2 w-full" placeholder="Ej. Pasteles 3D" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Descripción</label>
              <textarea {...register("descripcion")} rows={3} className="border rounded p-2 w-full" placeholder="Breve descripción del producto..." />
            </div>
            <div>
              <label className="block font-semibold mb-1">Orden de aparición</label>
              <input {...register("orden")} type="number" min={0} className="border rounded p-2 w-32" defaultValue={0} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Fotos (máx. 5, JPG/PNG/WEBP)</label>
              <input {...register("fotos")} type="file" multiple accept="image/*" className="border rounded p-2 w-full" />
            </div>
            <div className="flex gap-4 mt-2">
              <button type="submit" className="bg-primary font-semibold px-6 py-2 rounded-lg hover:bg-accent hover:text-white transition-colors">
                Guardar
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
