import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/src/context";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Image from "next/image";
import Swal from "sweetalert2";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Cupcakeprice() {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const { userId, userName, userPhone } = useAuth();
  const router = useRouter();
  const [isDelivery, setIsDelivery] = useState(false);
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [phoneValue, setPhoneValue] = useState(userPhone || "");
  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const file1 = watch("file1");
  const file2 = watch("file2");

  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split("T")[0];
  })();

  const TIME_OPTIONS = [];
  for (let h = 9; h <= 18; h++) {
    TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 18) TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:30`);
  }

  function formatPhone(raw) {
    const digits = raw.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  useEffect(() => {
    if (file1) handlePreview(file1, setPreview1);
    if (file2) handlePreview(file2, setPreview2);
  }, [file1, file2]);

  useEffect(() => {
    if (dateValue && timeValue) {
      const [year, month, day] = dateValue.split("-");
      setValue("deliveryDate", `${day}/${month}/${year} ${timeValue}`);
    }
  }, [dateValue, timeValue, setValue]);

  const handlePreview = (file, setPreview) => {
    if (file && file.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file[0]);
    } else {
      setPreview(null);
    }
  };

  const uploadFiles = async (data) => {
    const formData = new FormData();
    formData.append("files", data.file1[0]);
    if (data.file2 && data.file2.length > 0) formData.append("files", data.file2[0]);

    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Error al subir imágenes");
    }

    setUploadStatus("¡Imágenes subidas correctamente!");
    return await res.json();
  };

  async function onSubmit(data) {
    let imageUrls = [];
    if (data.file1 && data.file1.length > 0) {
      try {
        imageUrls = await uploadFiles(data);
      } catch (uploadErr) {
        setUploadStatus("Error al subir las imágenes");
        Swal.fire({
          title: "Error al subir imágenes",
          text: uploadErr.message,
          icon: "error",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#fff1f2",
          color: "#540027",
        });
        return;
      }
    }

    try {
      const response = await fetch(`${API_BASE}/pricecupcake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          contactPhone: phoneValue,
          userId: userId,
          images: imageUrls.map((f) => f.fileName),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      const id = json.data._id;

      Swal.fire({
        title: "¡Cotización Enviada!",
        text: "Solicitud de cotización para cupcakes enviada correctamente.",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff1f2",
        color: "#540027",
      }).then(() => {
        router.push(`/enduser/detallesolicitud/${id}?source=cupcake`);
      });
    } catch (error) {
      console.error("Error en la solicitud:", error);
      Swal.fire({
        title: "Error",
        text: "Error al enviar la solicitud de cotización. Por favor, inténtelo de nuevo.",
        icon: "error",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff1f2",
        color: "#540027",
      });
    }
  }

  const handleClearFields = () => {
    reset({
      flavorBizcocho: "", stuffedFlavor: "", cover: "", portions: "",
      delivery: "", deliveryAdress: "", municipio: "", fondantCover: "", deliveryDate: "",
      fondantDraw: "", buttercreamDraw: "", naturalFlowers: "", sign: "",
      eatablePrint: "", sprinkles: "", other: "", budget: "",
      contactName: "", contactPhone: "", questionsOrComments: "",
    });
    setPreview1(null);
    setPreview2(null);
    setPhoneValue("");
    setDateValue("");
    setTimeValue("");
  };

  return (
    <main>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${poppins.className}`}
      >
        <div className="grid grid-cols-1 m-8 md:grid-cols-4 gap-4 text-sm font-medium dark:text-white">
          {/* Basic request information */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sabor */}
              <div>
                <p>Sabor de Cupcake</p>
                <select
                  className="inputFlavorBizcochoCupcake inputPeopleSnack bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  name="flavorBizcocho"
                  {...register("flavorBizcocho")}
                  required
                >
                  <option value="">Selecciona un sabor</option>
                  <option value="vainilla">Vainilla</option>
                  <option value="chocolate">Chocolate</option>
                  <option value="chocochip">Chocochip</option>
                  <option value="red Velvet">Red velvet</option>
                  <option value="zanahoria">Zanahoria</option>
                  <option value="limon">Limon</option>
                </select>
              </div>
              {/* Relleno */}
              <div>
                <p>Relleno</p>
                <select
                  className="inputStuffedFlavorCupcake inputPeopleSnack bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  {...register("stuffedFlavor")}
                  required
                >
                  <option value="">Selecciona un Sabor</option>
                  <option value="sin Relleno">Sin Relleno</option>
                  <option value="chocolate">Chocolate</option>
                  <option value="nutella">Nutella</option>
                  <option value="dulce de leche">Dulce de Leche</option>
                  <option value="queso Crema">Queso Crema </option>
                  <option value="mermelada de Blueberry y LemonCurd">
                    Mermelada de Blueberry y LemonCurd (Crema de limon)
                  </option>
                  <option value="mermelada de Frambuesa">
                    Mermelada de Frambuesa
                  </option>
                  <option value="mermelada de Maracuya">
                    Mermelada de Maracuya
                  </option>
                </select>
              </div>
              {/* Cobertura */}
              <div>
                <p>Cobertura</p>
                <select
                  className="inputCoverCupcake inputPeopleSnack bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  {...register("cover")}
                  required
                >
                  <option value="">Selecciona la cobertura</option>
                  <option value="Buttercream vainilla">
                    Buttercream vainilla
                  </option>
                  <option value="Buttercream chocolate">
                    Buttercream chocolate
                  </option>
                  <option value="Ganache Chocolate Semiamargo">
                    Ganache Chocolate Semiamargo
                  </option>
                  <option value="Ganache Chocolate Blanco">
                    Ganache Chocolate Blanco
                  </option>
                </select>
              </div>
              {/* Porciones */}
              <div>
                <p>Número de Porciones</p>
                <select
                  className="inputPortionsCupcake bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  {...register("portions")}
                  required
                >
                  <option value="">Selecciona el número de porciones</option>
                  <option value="12">12 porciones</option>
                  <option value="24">24 porciones</option>
                  <option value="36">36 porciones</option>
                  <option value="48">48 porciones</option>
                  <option value="60">60 porciones</option>
                  <option value="72">72 porciones</option>
                  <option value="84">84 porciones</option>
                  <option value="96">96 porciones</option>
                  <option value="108">108 porciones</option>
                  <option value="120">120 porciones</option>
                  <option value="132">132 porciones</option>
                  <option value="144">144 porciones</option>
                  <option value="146">146 porciones</option>
                  <option value="158">158 porciones</option>
                  <option value="170">170 porciones</option>
                  <option value="182">182 porciones</option>
                  <option value="194">194 porciones</option>
                  <option value="206">206 porciones</option>
                  <option value="218">218 porciones</option>
                  <option value="230">230 porciones</option>
                  <option value="230+">230+ especificar en comentarios</option>
                </select>
              </div>
              {/* Envio */}
              <div>
                <label>
                  <input
                    className="inputDeliveryCupcake m-4 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                    type="checkbox"
                    {...register("delivery")}
                    onChange={(e) => setIsDelivery(e.target.checked)}
                  />
                  ¿Requiere Envío?
                </label>
                {isDelivery && (
                  <p className="text-xs mt-1" style={{ color: "#540027", background: "#fff1f2", border: "1px solid #f9a8b8", borderRadius: 6, padding: "5px 10px", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    📍 <strong>Solo Zona Metropolitana de Guadalajara.</strong>&nbsp;No realizamos envíos nacionales.
                  </p>
                )}
              </div>
              {/* Entrega */}
              <div>
                <p>Calle, número y colonia</p>
                <input
                  className="inputDeliveryAdressCupcake inputPeopleSnack bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  type="text"
                  placeholder="Ej. Av. Patria 1234, Col. Jardines"
                  {...register("deliveryAdress")}
                  required={isDelivery}
                  disabled={!isDelivery}
                />
                {!isDelivery && (
                  <p className="text-xs text-gray-500 mt-1">El pedido se recogerá en sucursal.</p>
                )}
              </div>
              {/* Municipio (solo ZMG) */}
              {isDelivery && (
                <div>
                  <p>Municipio</p>
                  <select
                    className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                    {...register("municipio", { required: "Selecciona el municipio de entrega" })}
                    defaultValue=""
                  >
                    <option value="" disabled>Selecciona municipio…</option>
                    <option>Guadalajara</option>
                    <option>Zapopan</option>
                    <option>San Pedro Tlaquepaque</option>
                    <option>Tonalá</option>
                    <option>Tlajomulco de Zúñiga</option>
                    <option>El Salto</option>
                    <option>Juanacatlán</option>
                    <option>Ixtlahuacán de los Membrillos</option>
                    <option>Acatlán de Juárez</option>
                  </select>
                </div>
              )}
              {/* Fecha */}
              <div>
                <p>Fecha de entrega</p>
                <input
                  className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  type="date"
                  min={minDate}
                  value={dateValue}
                  onChange={(e) => setDateValue(e.target.value)}
                  required
                />
              </div>
              {/* Hora */}
              <div>
                <p>Hora de entrega</p>
                <select
                  className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  value={timeValue}
                  onChange={(e) => setTimeValue(e.target.value)}
                  required
                >
                  <option value="">Selecciona una hora</option>
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <input type="hidden" {...register("deliveryDate")} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col m-8 bg-rose-50 p-6 mb-6 rounded-lg">
          <h2 className={`text-xl m-4 ${sofia.className}`}>
            Elige las opciones de decoración que te gustaría que tengan tus
            Cupcakes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>
                <input
                  type="checkbox"
                  {...register("fondantCover")}
                  className="checkboxFondantCoverCupcake m-4 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                />
                Cubierta en Fondant
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  {...register("fondantDraw")}
                  className="checkboxFondantDrawCupcake m-4 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                />
                Dibujos en Fondant
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  {...register("buttercreamDraw")}
                  className="checkboxButtercreamDrawCupcake m-4 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                />
                Dibujos en Buttercream
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  {...register("naturalFlowers")}
                  className="checkboxNaturalFlowersCupcake m-4 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                />
                Flores Naturales
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  {...register("sign")}
                  className="checkboxSignCupcake m-4 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                />
                Toppers con texto
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  {...register("eatablePrint")}
                  className="checkboxEatablePrintCupcake m-4 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                />
                Impresion comestible
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  {...register("sprinkles")}
                  className="checkboxSprinklesCupcake m-4 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                />
                Sprinkles (Chispitas)
              </label>
            </div>
          </div>
          <div>
            <label>
              <input
                type="text"
                {...register("other")}
                className="checkboxOtherCupcake  text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
              />
              Otra, por favor especificar en Comentarios
            </label>
          </div>
        </div>

        <div className="flex flex-col m-8 p-6 mb-6 rounded-lg">
  <p className="my-2 m-6">
    Por favor, sube imágenes de inspiración, como la temática,
    los elementos que te gustaría ver en tus cupcakes, la paleta
    de colores u otras preferencias.
  </p>
  <p className="my-2 m-6">
    Esto nos ayudará a crear un diseño personalizado para ti. Puedes
    subir hasta 2 imágenes de hasta 10MB cada una.
  </p>

  {/* Contenedor flex para alinear horizontalmente */}
  <div className="flex flex-row justify-between space-x-8 w-full">
    {/* Imagen 1 */}
    <div className="flex flex-col w-1/2 relative">
      <label className="mb-2 text-center">Imagen 1</label>
      <div className="relative w-full">
        <input
          type="file"
          {...register("file1")}
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <button className="rounded-full bg-rose-200 text-white p-2 w-full cursor-pointer">
          Seleccionar archivo
        </button>
      </div>
      {preview1 && (
        <Image
          src={preview1}
          width={500}
          height={500}
          alt="Preview 1"
          className="mt-4"
          style={{ width: "200px", marginTop: "10px" }}
        />
      )}
    </div>

    {/* Imagen 2 */}
    <div className="flex flex-col w-1/2 relative">
      <label className="mb-2 text-center">Imagen 2 (opcional)</label>
      <div className="relative w-full">
        <input
          type="file"
          {...register("file2")}
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <button className="rounded-full bg-rose-200 text-white p-2 w-full cursor-pointer">
          Seleccionar archivo
        </button>
      </div>
      {preview2 && (
        <Image
          src={preview2}
          width={500}
          height={500}
          alt="Preview 2"
          className="mt-4"
          style={{ width: "200px", marginTop: "10px" }}
        />
      )}
    </div>
  </div>
</div>
 {/* Presupuesto */}
        <div className="m-8 text-sm font-medium">
          <p>Presupuesto máximo estimado</p>
          <input
            className="inputBudgetCupcake inputPeopleSnack bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            type="number"
            {...register("budget")}
            required
          />
        </div>
{/* Informacion de contacto */}
<div className="m-6">
          <h2 className={`text-3xl m-4 ${sofia.className}`}>
            Información de contacto
          </h2>
          <div className="flex flex-col m-3 bg-rose-50 p-6 mb-6 rounded-lg">
            <div className="m-3">
            <p>Nombre</p>
            <input
              className="inputContactNameCake bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:border-accent"
              type="text"
              placeholder="Escribe tu nombre"
              defaultValue={userName}
              {...register("contactName", { value: userName })}
            />
          </div>
          <div className="m-3">
            <p>Número de celular</p>
            <input
              className="inputContactPhoneCake bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:border-accent"
              type="text"
              placeholder="000-000-0000"
              value={phoneValue}
              onChange={(e) => setPhoneValue(formatPhone(e.target.value))}
            />
          </div>
        

        <div className="m-8 text-sm font-medium">
              <p>
                Preguntas o comentarios, platicanos más acerca de tu idea o
                tematica, nos especializamos en diseñar dulsuras a la medida
              </p>
          <textarea
            className="inputQuestionsOrCommentsCupcake bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            type="textarea"
            {...register("questionsOrComments")}
            rows="2"
          />
          </div>
        </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-end m-4 mb-8 gap-4 ml-4">
          <button
            type="button"
            className="bg-secondary text-white py-2 px-4 rounded hover:bg-accent transition"
            onClick={handleClearFields}
          >
            Limpiar campos
          </button>
          <button
            type="submit"
            className="btnSubmitCake bg-secondary text-white py-2 px-4 rounded hover:bg-accent transition"
          >
            Cotizar Cupcakes
          </button>
        </div>
      </form>
    </main>
  );
}
