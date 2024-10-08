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

export default function Cakeprice() {
  const { register, handleSubmit, reset, watch } = useForm();
  const { userId, userName, userPhone } = useAuth();
  const router = useRouter();
  const [isDelivery, setIsDelivery] = useState(false);
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const file1 = watch("file1");
  const file2 = watch("file2");

  useEffect(() => {
    if (file1) handlePreview(file1, setPreview1);
    if (file2) handlePreview(file2, setPreview2);
  }, [file1, file2]);

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
    formData.append("file1", data.file1[0]);
    if (data.file2) formData.append("file2", data.file2[0]);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const responseData = await res.json();
        setUploadStatus("¡Imágenes subidas correctamente!");
        return responseData.files;
      } else {
        throw new Error("Error en la subida de imágenes");
      }
    } catch (error) {
      setUploadStatus("Error al subir las imágenes");
      console.error(error);
      return null;
    }
  };

  async function onSubmit(data) {
    try {
      const imageUrls = await uploadFiles(data);

      if (imageUrls) {
        const response = await fetch(`${API_BASE}/pricecake`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            userId: userId,
            images: imageUrls,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        const id = json.data._id;

        Swal.fire({
          title: "¡Cotización Enviada!",
          text: "Solicitud de cotización para pastel correctamente enviada.",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#fff1f2",
          color: "#540027",
        }).then(() => {
          router.push(`/enduser/detallesolicitud/${id}?source=pastel`);
        });

        console.log("Response data:", json);
      }
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
      flavor: "",
      levels: "",
      portions: "",
      delivery: "",
      stuffedFlavor: "",
      cover: "",
      deliveryAdress: "",
      fondantCover: "",
      deliveryDate: "",
      buttercream: "",
      ganache: "",
      fondant: "",
      fondantDraw: "",
      buttercreamDraw: "",
      naturalFlowers: "",
      sign: "",
      eatablePrint: "",
      sugarcharacter3d: "",
      character: "",
      other: "",
      image: "",
      budget: "",
      contactName: "",
      contactPhone: "",
      questionsOrComments: "",
    });
    setPreview1(null);
    setPreview2(null);
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
                <p>Sabor del bizocho</p>
                <select
                  className="inputFlavorCake bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  {...register("flavor")}
                  required
                >
                  <option value="">Selecciona un sabor</option>
                  <option value="vainilla">Bizcocho de vainilla</option>
                  <option value="chocolate">Bizcocho de chocolate</option>
                  <option value="Red Velvet">Bizcocho de red velvet</option>
                  <option value="Naranja">Bizcocho de naranja</option>
                  <option value="Dulce de leche">
                    Bizcocho de dulce de leche
                  </option>
                </select>
              </div>
              {/* Porciones */}
              <div>
                <p>Número de Porciones</p>
                <select
                  className="inputPortionsCake bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  {...register("portions")}
                  required
                >
                  <option value="">Selecciona el número de porciones</option>
                  <option value="10">10 porciones</option>
                  <option value="20">20 porciones</option>
                  <option value="30">30 porciones</option>
                  <option value="40">40 porciones</option>
                  <option value="50">50 porciones</option>
                  <option value="60">60 porciones</option>
                  <option value="70">70 porciones</option>
                  <option value="80">80 porciones</option>
                  <option value="90">90 porciones</option>
                  <option value="100">100 porciones</option>
                  <option value="110">110 porciones</option>
                  <option value="120">120 porciones</option>
                  <option value="130">130 porciones</option>
                  <option value="140">140 porciones</option>
                  <option value="150">150 porciones</option>
                  <option value="160">160 porciones</option>
                  <option value="170">170 porciones</option>
                  <option value="180">180 porciones</option>
                  <option value="190">190 porciones</option>
                  <option value="200">200 porciones</option>
                  <option value="200+">200+ especificar en comentarios</option>
                </select>
              </div>
              {/* Niveles */}
              <div>
                <p>Número de Niveles</p>
                <select
                  className="inputLevelsCake bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  {...register("levels")}
                  required
                >
                  <option value="">Selecciona el número de niveles</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="5+">5+ especificar en comentarios</option>
                </select>
              </div>
              {/* Relleno */}
              <div>
                <p>Sabor del Relleno</p>
                <select
                  className="inputStuffedFlavorCake bg-gray-50 p-2.5bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  {...register("stuffedFlavor")}
                  required
                >
                  <option value="">Selecciona el Sabor de Relleno</option>
                  <option value="Buttercream Vainilla">
                    Buttercream Vainilla
                  </option>
                  <option value="Buttercream chocolate">
                    Buttercream chocolate
                  </option>
                  <option value="Ganache Chocolate semiamargo">
                    Ganache Chocolate semiamargo
                  </option>
                  <option value="Ganache Chocolate Blanco">
                    Ganache Chocolate Blanco
                  </option>
                  <option value="Mermelada de Blueberry y LemonCurd">
                    Mermelada de Blueberry y LemonCurd
                  </option>
                  <option value="Queso Crema">Queso Crema </option>
                  <option value="Mermelada de Frambuesa">
                    Mermelada de Frambuesa
                  </option>
                  <option value="Mermelada de Maracuya">
                    Mermelada de Maracuya
                  </option>
                </select>
              </div>
              {/* Cobertura */}
              <div>
                <p>Cobertura</p>
                <select
                  className="inputCoverCake bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
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
              {/* Envio */}
              <div>
                <label>
                  <input
                    className="inputDeliveryCake m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                    type="checkbox"
                    {...register("delivery")}
                    onChange={(e) => setIsDelivery(e.target.checked)}
                  />
                  ¿Requiere Envío?
                </label>
              </div>
              {/* Entrega */}
              <div>
                <p>Lugar de entrega</p>
                <input
                  className="inputDeliveryAdressCake bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  type="text"
                  placeholder="Calle, número y colonia"
                  {...register("deliveryAdress")}
                  disabled={!isDelivery}
                />
              </div>
              {/* Fondant */}
              <div>
                <label>
                  <input
                    className="inputFondantCoverCake m-4 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                    type="checkbox"
                    {...register("fondantCover")}
                  />
                  Forrado de Fondant
                </label>
              </div>
              {/* Fecha */}
              <div>
                <p>Fecha y hora del evento</p>
                <input
                  className="inputDeliveryDateSnack bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  type="datetime-local"
                  {...register("deliveryDate")}
                  required
                />
              </div>
            </div>
          </div>
        </div>
        {/* Decoraciones */}
        <div className="flex flex-col m-8 bg-rose-50 p-6 mb-6 rounded-lg">
          <h2 className={`text-xl m-4 ${sofia.className}`}>
            Elige las opciones de decoración que te gustaría que tenga tu pastel
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label>
              <input
                className="inputButtercreamCake m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("buttercream")}
              />
              Cobertura Buttercream(betun con base en mantequilla)
            </label>
            <label>
              <input
                className="inputGanacheCake m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("ganache")}
              />
              Cobertura Ganache Base de Chocolate
            </label>
            <label>
              <input
                className="inputFondantCake m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("fondant")}
              />
              Forrado de Fondant
            </label>
            <label>
              <input
                className="inputFondantDrawCake m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("fondantDraw")}
              />
              Dibujo a mano en Fondant
            </label>
            <label>
              <input
                className="inputbuttercreamDrawCake m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("buttercreamDraw")}
              />
              Dibujo en Buttercream
            </label>
            <label>
              <input
                className="inputNaturalFlowersCake m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("naturalFlowers")}
              />
              Flores naturales
            </label>
            <label>
              <input
                className="inputSignCake m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("sign")}
              />
              Letrero
            </label>
            <label>
              <input
                className="inputEatablePrintCake m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("eatablePrint")}
              />
              Impresion comestible
            </label>
            <label>
              <input
                className="inputSugarcharacter3dCake m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("sugarcharacter3d")}
              />
              Personajes modelados de azúcar
            </label>
            <label>
              <input
                className="inputCharacterCake m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("character")}
              />
              Pastel 3d de un personaje
            </label>
          </div>
          <p className="m-4">Otros</p>
          <input
            className="inputOtherCake m-2 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            type="text"
            {...register("other")}
          />
        </div>

        {/* Imagenes */}
        <div className="flex flex-col m-8 p-6 mb-6 rounded-lg">
        <div>
          <p className="my-2 m-6">
            Por favor, sube imágenes de inspiración, como la temática, los
            elementos que te gustaría ver en la tu pastel, la paleta de
            colores u otras preferencias.
          </p>
          <p className="my-2 m-6">
    Esto nos ayudará a crear un diseño personalizado para ti. Puedes
    subir hasta 2 imágenes de hasta 10MB cada una.
  </p>
          
            {/* Contenedor flex para alinear horizontalmente */}
          <div className="flex flex-row justify-between space-x-8 w-full">
            {/* Imagen 1 */}
          <div className="flex flex-col w-1/2 relative">
          <label className="mb-2 text-center">Image 1</label>
            <div className="relative w-full">
            <input
              type="file"
              {...register("file1")}
              accept="image/*"
              required
               className="absolute inset-0 opacity-0 cursor-pointer"
            /><button className="rounded-full bg-rose-200 text-white p-2 w-full cursor-pointer">
            Seleccionar archivo
          </button>
            </div>
            {preview1 && (
              <Image
                src={preview1}
                width={500}
                height={500}
                alt="Preview 1"
                style={{ width: "200px", marginTop: "10px" }}
              />
            )}
          </div>
          
          <div className="flex flex-col w-1/2 relative">
             <label className="mb-2 text-center">Image 2 (optional)</label>
            <div className="relative w-full">
            <input 
            type="file" {...register("file2")} 
            accept="image/*"  
            className="absolute inset-0 opacity-0 cursor-pointer"/>
            <button className="rounded-full bg-rose-200 text-white p-2 w-full cursor-pointer">
          Seleccionar archivo
        </button>
            </div>
            {preview2 && (
              <Image
                width={500}
                height={500}
                src={preview2}
                alt="Preview 2"
                style={{ width: "200px", marginTop: "10px" }}
              />
            )}
          </div>
          </div>
          </div>
          </div>
        {/* Presupuesto */}
        <div className="flex flex-col md:flex-col m-6">
          <p>
            ¿Podrías informarnos si tienes un presupuesto específico para este
            pedido? Nos sería de gran ayuda conocer la cantidad que tienes en
            mente.
          </p>
          <div className="m-4">
            <p>Presupuesto deseado</p>
            <input
              className="inputBudgetrCake bg-gray-50 -accent p-2.5bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
              type="text"
              {...register("budget")}
            />
          </div>
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
                defaultValue={userPhone}
                {...register("contactPhone", { value: userPhone })}
              />
            </div>
            <div className="m-3">
              <p>
                Preguntas o comentarios, platicanos más acerca de tu idea o
                tematica, nos especializamos en diseñar dulsuras a la medida
              </p>
              <input
                className="inputQuestionsOrCommentsCake bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:border-accent"
                type="text"
                {...register("questionsOrComments")}
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col md:flex-row items-center justify-end m-4 mb-8 gap-4 ml-4">
          <button
            type="button"
            className="bg-secondary text-white py-2 px-4 rounded hover:bg-accent transition"
            onClick={handleClearFields}
          >
            Limpiar campos
          </button>
          <button
            type="onsubmit"
            className="btnSubmitCake bg-secondary text-white py-2 px-4 rounded hover:bg-accent transition"
          >
            Cotizar Pastel
          </button>
        </div>
      </form>
    </main>
  );
}
