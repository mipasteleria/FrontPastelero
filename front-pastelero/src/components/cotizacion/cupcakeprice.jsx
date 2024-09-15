import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/src/context";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import axios from "axios";
import Image from "next/image";
import Swal from "sweetalert2";
import { io } from 'socket.io-client';

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  export default function Cupcakeprice() {
  const { register, handleSubmit, reset } = useForm();
  const [isDelivery, setIsDelivery] = useState(false);
  const { userId, userName, userPhone, isLoggedIn } = useAuth();
  const router = useRouter();
  const [socket, setSocket] = useState(null);

  // Estado para las imágenes
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (isLoggedIn && userId) {
      const newSocket = io(API_BASE); // Crear una nueva instancia del socket
      setSocket(newSocket);

      newSocket.emit('registrarUsuario', userId); // Emitir el ID del usuario cuando el socket se conecte

      return () => {
        newSocket.disconnect(); // Desconectar socket al desmontar
      };
    }
  }, [isLoggedIn, userId]);

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
        `${API_BASE}/upload`,
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

      if (socket && socket.connected) {
        socket.emit('solicitarCotizacion', {
          nombreUsuario: userName,
          mensaje: 'cotización de cupcakes'
        });
      } else {
        console.error('Socket no está conectado');
      }      

      // Mostrar alerta de éxito con SweetAlert2
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
        // Redirigir después de mostrar la alerta
        router.push(`/enduser/detallesolicitud/${id}?source=cupcake`);
      });
  
      // Configuración de mensaje
      console.log("Response data:", json);
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

        <div className="m-8 text-sm font-medium">
          <p>Presupuesto máximo estimado</p>
          <input
            className="inputBudgetCupcake inputPeopleSnack bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            type="number"
            {...register("budget")}
            required
          />
        </div>

        <div className="grid grid-cols-1 m-8 text-sm font-medium md:grid-cols-2 gap-4">
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
        </div>

        <div className="m-8 text-sm font-medium">
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
