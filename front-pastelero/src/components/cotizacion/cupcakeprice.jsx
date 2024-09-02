import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/src/context";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import axios from "axios";
import Image from "next/image";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  export default function Cupcakeprice() {
  const { register, handleSubmit, reset } = useForm();
  const [isDelivery, setIsDelivery] = useState(false);
  const { userId } = useAuth();
  const router = useRouter();

  // Estado para las imágenes
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  // Manejar selección de archivos
  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  // Manejar envío de archivos
  const handleUploadSubmit = async () => {
    if (selectedFiles.length === 0) {
      setMessage(["Por favor, selecciona dos imágenes"]);
      return;
    }

    setUploading(true);
    const formData = new FormData();

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
      formData.append("fileOutputName", selectedFiles[i].name);
    }

    try {
      // Enviar los archivos al backend
      const uploadResponse = await axios.post(
        "http://localhost:3001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(["Files uploaded successfully!"]);
    } catch (error) {
      console.error("Error uploading files:", error);
      setMessage(["Error uploading files. Please try again."]);
    } finally {
      setUploading(false);
    }
  };

  // Manejar envío del formulario principal
  async function onSubmit(data) {
    try {
      const response = await fetch(`${API_BASE}/pricecupcake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          userId: userId,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      const id = json.data._id;
      router.push(`/enduser/detallesolicitud/${id}?source=cupcake`);
      console.log("Response data:", json);
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }

  const handleClearFields = () => {
    reset({
      flavorBizcocho: "",
      stuffedFlavor: "",
      cover: "",
      portions: "",
      delivery: "",
      deliveryAdress: "",
      fondantCover: "",
      deliveryDate: "",
      fondantDraw: "",
      buttercreamDraw: "",
      naturalFlowers: "",
      sign: "",
      eatablePrint: "",
      sprinkles: "",
      other: "",
      budget: "",
      contactName: "",
      contactPhone: "",
      questionsOrComments: "",
    });
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
                  ¿Requiere Envio?
                </label>
              </div>
              {/* Entrega */}
              <div>
                <p>Lugar de entrega</p>
                <input
                  className="inputDeliveryAdressCupcake inputPeopleSnack bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  type="text"
                  {...register("deliveryAdress")}
                  required={isDelivery}
                  disabled={!isDelivery}
                />
              </div>
              {/* Fecha */}
              <div>
                <p>Fecha de entrega</p>
                <input
                  className="inputDeliveryDateCupcake inputPeopleSnack bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  type="date"
                  {...register("deliveryDate")}
                  required
                />
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

        <div>
          <p className="my-2 m-6">
            Por favor, sube dos imágenes de inspiración, como la temática, los
            elementos que te gustaría ver en los cupcakes, la paleta de colores
            u otras preferencias.
          </p>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            multiple
          />
          {message.length > 0 &&
            message.map((msg, index) => <p key={index}>{msg}</p>)}
          {imageUrls.length > 0 &&
            imageUrls.map((url, index) => (
              <div key={index}>
                <h2>Uploaded Image:</h2>
                <Image
                  src={url}
                  alt={`Uploaded image ${index}`}
                  width={500}
                  height={500}
                  style={{ maxWidth: "100%" }}
                />
              </div>
            ))}
        </div>

        <div className="m-8 text-sm font-medium text-secondary">
          <p>Presupuesto máximo estimado</p>
          <input
            className="inputBudgetCupcake inputPeopleSnack bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            type="number"
            {...register("budget")}
            required
          />
        </div>

        <div className="grid grid-cols-1 m-8 text-sm font-medium text-secondary md:grid-cols-2 gap-4">
          <div>
            <p>Nombre de contacto</p>
            <input
              className="inputContactNameCupcake inputPeopleSnack bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
              type="text"
              {...register("contactName")}
              required
            />
          </div>
          <div>
            <p>Teléfono de contacto</p>
            <input
              className="inputContactPhoneCupcake inputPeopleSnack bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
              type="text"
              {...register("contactPhone")}
              required
            />
          </div>
        </div>

        <div className="m-8 text-sm font-medium text-secondary">
          <p>Preguntas o Comentarios</p>
          <textarea
            className="inputQuestionsOrCommentsCupcake bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            type="textarea"
            {...register("questionsOrComments")}
            rows="5"
          />
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
