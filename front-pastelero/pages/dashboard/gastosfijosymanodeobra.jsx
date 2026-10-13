import { useForm } from "react-hook-form";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useAuth } from "@/src/context";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Conocenuestrosproductos() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [costData, setCostData] = useState({
    fixedCosts: 0,
    laborCosts: 0,
    costoBrandingPorGalleta: 0,
    markupGalletasPct: 60,
    margenMinimoGalleta: 5,
    costoBrandingPorPostre: 0,
    markupPostresPct: 60,
    pasarela: {
      proveedor: "stripe",
      comisionPct: 0,
      comisionFija: 0,
      ivaSobreComisionPct: 16,
      incluirEnPrecio: false,
    },
  });
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { userToken } = useAuth();

  // Form independiente para la sección de galletas — no se mezcla con
  // el de fixedCosts/laborCosts para que el admin pueda guardar uno
  // u otro sin tener que llenar los dos cada vez.
  const galletasForm = useForm();
  const postresForm  = useForm();
  const pasarelaForm = useForm();

  useEffect(() => {
    const fetchCostData = async () => {
      try {
        const response = await fetch(`${API_BASE}/costs`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Merge con defaults para que campos faltantes no rompan el render
        setCostData((prev) => ({ ...prev, ...data }));
      } catch (error) {
        console.error('Error al obtener los datos de costos:', error);
      }
    };

    fetchCostData();
  }, [API_BASE]);

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${API_BASE}/costs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          fixedCosts: data.fixedCosts,
          laborCosts: data.laborCosts,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Costo actualizado exitosamente:', result);

      setCostData((prev) => ({ ...prev, ...result }));

      Swal.fire({
        title: 'Costos actualizados',
        text: 'Los costos han sido actualizados correctamente.',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: '#fff1f2',
        color: '#540027',
      });
    } catch (error) {
      console.error('Error al actualizar el costo:', error);

      Swal.fire({
        title: 'Error',
        text: 'Error al actualizar los costos. Por favor, intente nuevamente.',
        icon: 'error',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: '#fff1f2',
        color: '#540027',
      });
    }
  };

  // Guarda solo los campos de galletas. Las tarifas por hora NO se
  // mandan: el back actualiza únicamente lo que recibe, y reenviarlas
  // desde el estado de la página era lo que las dejaba en 0.
  const onSubmitGalletas = async (data) => {
    try {
      const response = await fetch(`${API_BASE}/costs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          costoBrandingPorGalleta: parseFloat(data.costoBrandingPorGalleta) || 0,
          markupGalletasPct: parseFloat(data.markupGalletasPct) || 0,
          margenMinimoGalleta: parseFloat(data.margenMinimoGalleta) || 0,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setCostData((prev) => ({ ...prev, ...result }));

      Swal.fire({
        title: 'Config de Galletas NY actualizada',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: '#fff1f2',
        color: '#540027',
      });
    } catch (error) {
      console.error('Error al actualizar config galletas:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar la configuración de galletas.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
        background: '#fff1f2',
        color: '#540027',
      });
    }
  };

  // Mismo patrón que onSubmitGalletas pero para los campos de postres.
  const onSubmitPostres = async (data) => {
    try {
      const response = await fetch(`${API_BASE}/costs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          costoBrandingPorPostre: parseFloat(data.costoBrandingPorPostre) || 0,
          markupPostresPct: parseFloat(data.markupPostresPct) || 0,
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setCostData((prev) => ({ ...prev, ...result }));
      Swal.fire({
        title: 'Config de Postres actualizada',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: '#fff1f2',
        color: '#540027',
      });
    } catch (error) {
      console.error('Error al actualizar config postres:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar la configuración de postres.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
        background: '#fff1f2',
        color: '#540027',
      });
    }
  };

  // Comisión de la pasarela de pago. Se guarda anidado en `pasarela` y el
  // back lo actualiza campo por campo, así que mandar esta sección no pisa
  // la config de galletas ni de postres.
  const onSubmitPasarela = async (data) => {
    try {
      const response = await fetch(`${API_BASE}/costs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          pasarela: {
            proveedor: data.proveedor || "stripe",
            comisionPct: parseFloat(data.comisionPct) || 0,
            comisionFija: parseFloat(data.comisionFija) || 0,
            ivaSobreComisionPct: parseFloat(data.ivaSobreComisionPct) || 0,
            incluirEnPrecio: Boolean(data.incluirEnPrecio),
          },
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setCostData((prev) => ({ ...prev, ...result }));
      Swal.fire({
        title: 'Comisión de pasarela actualizada',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: '#fff1f2',
        color: '#540027',
      });
    } catch (error) {
      console.error('Error al actualizar pasarela:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar la comisión de pasarela.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
        background: '#fff1f2',
        color: '#540027',
      });
    }
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className="flex-grow md:w-3/4 mb-14 max-w-screen-lg mx-auto">
          <h1 className={`text-4xl p-6 ${sofia.className}`}>Gastos fijos y mano de obra</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="flex flex-col md:flex-row items-center">
                <p className="font-bold m-4">Establecer costo de Gastos Fijos</p>
                <div className="m-4">
                  <label htmlFor="fixedCosts" className="block mb-2 text-sm font-medium dark:text-white">
                    Costo por hora
                  </label>
                  <input
                    type="number"
                    id="fixedCosts"
                    {...register("fixedCosts", { required: "El costo por hora es obligatorio" })}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                    placeholder="0.0"
                  />
                  {errors.fixedCosts && <p className="text-red-600">{errors.fixedCosts.message}</p>}
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center">
                <p className="font-bold m-4">Establecer costo de Mano de Obra</p>
                <div className="m-4">
                  <label htmlFor="laborCosts" className="block mb-2 text-sm font-medium dark:text-white">
                    Costo por hora
                  </label>
                  <input
                    type="number"
                    id="laborCosts"
                    {...register("laborCosts", { required: "El costo por hora es obligatorio" })}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                    placeholder="0.0"
                  />
                  {errors.laborCosts && <p className="text-red-600">{errors.laborCosts.message}</p>}
                </div>
              </div>
              <button
                type="submit"
                className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-96 sm:w-96 px-16 py-2.5 text-center m-4"
              >
                Guardar costo de mano de obra
              </button>
            </div>
          </form>
          <div className="m-4">
            <p className="text-lg font-semibold">Costos actuales:</p>
            <p className="text-md">Costos fijos: {costData.fixedCosts} MXN</p>
            <p className="text-md">Mano de obra: {costData.laborCosts} MXN</p>
          </div>

          {/* ── Sección: Configuración de Galletas NY ───────────────── */}
          <div className="border-t-2 border-secondary mt-8 pt-6">
            <h2 className={`text-3xl px-6 ${sofia.className}`} style={{ color: "#540027" }}>
              🍪 Configuración de Galletas NY
            </h2>
            <p className="text-sm px-6 mb-4" style={{ color: "#a78891" }}>
              Estos valores alimentan el cálculo automático de precio sugerido al dar de alta un sabor desde una receta, y la vigilancia del margen mínimo.
            </p>

            <form onSubmit={galletasForm.handleSubmit(onSubmitGalletas)}>
              <div className="flex flex-col md:flex-row items-center">
                <p className="font-bold m-4">Costo de branding/empaque por galleta</p>
                <div className="m-4">
                  <label htmlFor="costoBrandingPorGalleta" className="block mb-2 text-sm font-medium">
                    MXN por pieza
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    id="costoBrandingPorGalleta"
                    defaultValue={costData.costoBrandingPorGalleta ?? 0}
                    key={`branding-${costData.costoBrandingPorGalleta ?? 0}`}
                    {...galletasForm.register("costoBrandingPorGalleta", { required: true })}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg block w-full p-2.5"
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center">
                <p className="font-bold m-4">Markup sugerido para galletas</p>
                <div className="m-4">
                  <label htmlFor="markupGalletasPct" className="block mb-2 text-sm font-medium">
                    Porcentaje (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    id="markupGalletasPct"
                    defaultValue={costData.markupGalletasPct ?? 60}
                    key={`markup-${costData.markupGalletasPct ?? 60}`}
                    {...galletasForm.register("markupGalletasPct", { required: true })}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg block w-full p-2.5"
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center">
                <p className="font-bold m-4">Margen mínimo (alerta)</p>
                <div className="m-4">
                  <label htmlFor="margenMinimoGalleta" className="block mb-2 text-sm font-medium">
                    MXN por galleta
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    id="margenMinimoGalleta"
                    defaultValue={costData.margenMinimoGalleta ?? 5}
                    key={`margen-${costData.margenMinimoGalleta ?? 5}`}
                    {...galletasForm.register("margenMinimoGalleta", { required: true })}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg block w-full p-2.5"
                    placeholder="5"
                  />
                  <p className="text-xs mt-1" style={{ color: "#a78891" }}>
                    Si el costo sube y el margen actual baja de este valor, se envía notificación interna.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-96 sm:w-96 px-16 py-2.5 text-center m-4"
              >
                Guardar configuración de Galletas NY
              </button>
            </form>

            <div className="m-4 p-4 rounded-lg" style={{ background: "#fff1f2" }}>
              <p className="text-lg font-semibold" style={{ color: "#540027" }}>Config actual de galletas:</p>
              <p className="text-md">Branding/empaque: ${costData.costoBrandingPorGalleta ?? 0} MXN/pieza</p>
              <p className="text-md">Markup sugerido: {costData.markupGalletasPct ?? 60}%</p>
              <p className="text-md">Margen mínimo (alerta): ${costData.margenMinimoGalleta ?? 5} MXN</p>
            </div>
          </div>

          {/* ── Sección: Configuración de Postres ─────────────────── */}
          <div className="border-t-2 border-secondary mt-8 pt-6">
            <h2 className={`text-3xl px-6 ${sofia.className}`} style={{ color: "#540027" }}>
              🎂 Configuración de Postres
            </h2>
            <p className="text-sm px-6 mb-4" style={{ color: "#a78891" }}>
              El branding es global (mismo costo en todos los postres). El empaque NO va aquí — varía por postre y se ingresa al dar de alta cada uno.
            </p>

            <form onSubmit={postresForm.handleSubmit(onSubmitPostres)}>
              <div className="flex flex-col md:flex-row items-center">
                <p className="font-bold m-4">Costo de branding por postre</p>
                <div className="m-4">
                  <label htmlFor="costoBrandingPorPostre" className="block mb-2 text-sm font-medium">
                    MXN por postre
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    id="costoBrandingPorPostre"
                    defaultValue={costData.costoBrandingPorPostre ?? 0}
                    key={`branding-postre-${costData.costoBrandingPorPostre ?? 0}`}
                    {...postresForm.register("costoBrandingPorPostre", { required: true })}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg block w-full p-2.5"
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center">
                <p className="font-bold m-4">Markup sugerido para postres</p>
                <div className="m-4">
                  <label htmlFor="markupPostresPct" className="block mb-2 text-sm font-medium">
                    Porcentaje (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    id="markupPostresPct"
                    defaultValue={costData.markupPostresPct ?? 60}
                    key={`markup-postres-${costData.markupPostresPct ?? 60}`}
                    {...postresForm.register("markupPostresPct", { required: true })}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg block w-full p-2.5"
                    placeholder="60"
                  />
                  <p className="text-xs mt-1" style={{ color: "#a78891" }}>
                    Default cuando la receta no tiene margen propio o no se sobrescribe en el form de postre.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-96 sm:w-96 px-16 py-2.5 text-center m-4"
              >
                Guardar configuración de Postres
              </button>
            </form>

            <div className="m-4 p-4 rounded-lg" style={{ background: "#fff1f2" }}>
              <p className="text-lg font-semibold" style={{ color: "#540027" }}>Config actual de postres:</p>
              <p className="text-md">Branding por postre: ${costData.costoBrandingPorPostre ?? 0} MXN</p>
              <p className="text-md">Markup sugerido: {costData.markupPostresPct ?? 60}%</p>
            </div>
          </div>

          {/* ── Comisión de la pasarela de pago ──────────────────── */}
          <div className="bg-white rounded-lg shadow-md m-4">
            <h2 className={`text-3xl p-6 ${sofia.className}`} style={{ color: "#540027" }}>
              💳 Comisión de la pasarela de pago
            </h2>
            <p className="text-sm px-6 mb-4" style={{ color: "#a78891" }}>
              Si lo activas, el precio sugerido de todos tus productos ya viene con la
              comisión incluida, así que el mismo precio aplica para quien paga en línea,
              en efectivo o por transferencia.
            </p>
            <div className="mx-6 mb-4 p-3 rounded-lg text-sm" style={{ background: "#FFF8E5", border: "1px solid #F0DFA0", color: "#6B5410" }}>
              <strong>Nota importante:</strong> el sistema no suma el porcentaje a secas,
              porque eso no alcanza a cubrir la comisión — la pasarela cobra su porcentaje
              sobre el total que le cobras, incluida la parte que agregaste para cubrirla.
              Si quieres recibir $100 netos con 3.6%, cobrar $103.60 te deja en $99.87;
              el sistema calcula $103.73 para que te queden los $100 exactos.
            </div>

            <form onSubmit={pasarelaForm.handleSubmit(onSubmitPasarela)}>
              <div className="flex flex-col md:flex-row items-center">
                <p className="font-bold m-4">Proveedor</p>
                <div className="m-4 w-64">
                  <select
                    id="proveedor"
                    defaultValue={costData.pasarela?.proveedor ?? "stripe"}
                    key={`proveedor-${costData.pasarela?.proveedor ?? "stripe"}`}
                    {...pasarelaForm.register("proveedor")}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg block w-full p-2.5"
                  >
                    <option value="stripe">Stripe</option>
                    <option value="mercadopago">Mercado Pago</option>
                    <option value="otro">Otra</option>
                  </select>
                  <p className="text-xs mt-1" style={{ color: "#a78891" }}>
                    Solo es una etiqueta para el desglose. Para migrar a Mercado Pago basta
                    cambiarlo aquí y ajustar las tarifas.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center">
                <p className="font-bold m-4">Comisión por transacción</p>
                <div className="m-4">
                  <label htmlFor="comisionPct" className="block mb-2 text-sm font-medium">Porcentaje (%)</label>
                  <input
                    type="number" step="0.01" min="0"
                    id="comisionPct"
                    defaultValue={costData.pasarela?.comisionPct ?? 0}
                    key={`comision-pct-${costData.pasarela?.comisionPct ?? 0}`}
                    {...pasarelaForm.register("comisionPct")}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg block w-full p-2.5"
                    placeholder="3.6"
                  />
                </div>
                <div className="m-4">
                  <label htmlFor="comisionFija" className="block mb-2 text-sm font-medium">Cuota fija (MXN)</label>
                  <input
                    type="number" step="0.01" min="0"
                    id="comisionFija"
                    defaultValue={costData.pasarela?.comisionFija ?? 0}
                    key={`comision-fija-${costData.pasarela?.comisionFija ?? 0}`}
                    {...pasarelaForm.register("comisionFija")}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg block w-full p-2.5"
                    placeholder="3"
                  />
                </div>
                <div className="m-4">
                  <label htmlFor="ivaSobreComisionPct" className="block mb-2 text-sm font-medium">IVA sobre comisión (%)</label>
                  <input
                    type="number" step="1" min="0"
                    id="ivaSobreComisionPct"
                    defaultValue={costData.pasarela?.ivaSobreComisionPct ?? 16}
                    key={`comision-iva-${costData.pasarela?.ivaSobreComisionPct ?? 16}`}
                    {...pasarelaForm.register("ivaSobreComisionPct")}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg block w-full p-2.5"
                    placeholder="16"
                  />
                </div>
              </div>

              <div className="flex items-center m-4">
                <input
                  type="checkbox"
                  id="incluirEnPrecio"
                  defaultChecked={costData.pasarela?.incluirEnPrecio ?? false}
                  key={`incluir-${String(costData.pasarela?.incluirEnPrecio ?? false)}`}
                  {...pasarelaForm.register("incluirEnPrecio")}
                  className="w-4 h-4 mr-3"
                />
                <label htmlFor="incluirEnPrecio" className="text-sm font-medium">
                  Incluir la comisión en el precio de todos mis productos
                </label>
              </div>

              <button
                type="submit"
                className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-96 sm:w-96 px-16 py-2.5 text-center m-4"
              >
                Guardar comisión de pasarela
              </button>
            </form>

            <div className="m-4 p-4 rounded-lg" style={{ background: "#fff1f2" }}>
              <p className="text-lg font-semibold" style={{ color: "#540027" }}>Config actual de pasarela:</p>
              <p className="text-md">
                {costData.pasarela?.incluirEnPrecio
                  ? `Activa — ${costData.pasarela?.comisionPct ?? 0}% + $${costData.pasarela?.comisionFija ?? 0} MXN (+${costData.pasarela?.ivaSobreComisionPct ?? 0}% IVA)`
                  : "Apagada — los precios no incluyen comisión"}
              </p>
            </div>
          </div>
        </main>
        <FooterDashboard />
      </div>
    </div>
  );
}
