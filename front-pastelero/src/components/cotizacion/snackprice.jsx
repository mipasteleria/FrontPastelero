import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/src/context";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Snackprice() {
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
        const response = await fetch(`${API_BASE}/pricesnack`, {
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
      people: "",
      portionsPerPerson: "",
      delivery: "",
      deliveryAdress: "",
      deliveryDate: "",
      pay: "",
      brownie: "",
      coockie: "",
      alfajores: "",
      macaroni: "",
      donuts: "",
      lollipops: "",
      cupcakes: "",
      bread: "",
      tortaFruts: "",
      americanCoockies: "",
      tortaApple: "",
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
              {/* Numero de personas */}
              <div>
                <p>Número de Personas</p>
                <select
                  className="inputPeopleSnack bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  {...register("people")}
                  required
                >
                  <option value="">Selecciona el número de personas</option>
                  <option value="30">30 personas,</option>
                  <option value="40">40 personas,</option>
                  <option value="50">50 personas,</option>
                  <option value="60">60 personas,</option>
                  <option value="70">70 personas,</option>
                  <option value="80">80 personas,</option>
                  <option value="90">90 personas,</option>
                  <option value="100">100 personas,</option>
                  <option value="100+">
                    100+ personas, especificar en comentarios
                  </option>
                </select>
              </div>
              {/* Postres por persona */}
              <div>
                <p>Número de Postres por Persona</p>
                <select
                  className="inputPortionsPerPersonSnack bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  {...register("portionsPerPerson")}
                  required
                >
                  <option value="">Selecciona el número de postres</option>
                  <option value="1">1 postre</option>
                  <option value="2">2 postres</option>
                  <option value="3">3 postres</option>
                  <option value="4">4 postres</option>
                  <option value="5">5 postres</option>
                  <option value="6">6 postres</option>
                  <option value="7">7 postres</option>
                  <option value="8">8 postres</option>
                  <option value="9">9 postres</option>
                  <option value="10">10 postres</option>
                  <option value="10+">
                    10+ postres especificar en comentarios
                  </option>
                </select>
              </div>
              {/* Envio */}
              <div>
                <label>
                  <input
                    className="inputDeliverySnack m-4 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
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
                  className="inputDeliveryAdressSnack bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  type="text"
                  placeholder="Calle, número y colonia"
                  {...register("deliveryAdress")}
                  disabled={!isDelivery}
                />
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
        {/* Seleccion de postres */}
        <div className="flex flex-col m-8 bg-rose-50 p-6 mb-6 rounded-lg">
          <h2 className={`text-xl m-4 ${sofia.className}`}>
            Elige los postres que te gustaría incluir en tu mesa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label>
              <input
                className="inputPaySnack m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("pay")}
              />
              Pay de Queso
            </label>
            <label>
              <input
                className="inputBrownieSnack m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("brownie")}
              />
              Brownie
            </label>
            <label>
              <input
                className="inputCoockieSnack m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("coockie")}
              />
              Galletas Decoradas
            </label>
            <label>
              <input
                className="inputAlfajoresSnack m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("alfajores")}
              />
              Alfajores
            </label>
            <label>
              <input
                className="inputMacaroniSnack m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("macaroni")}
              />
              Macarrones
            </label>
            <label>
              <input
                className="inputDonutsiSnack m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("donuts")}
              />
              Donas
            </label>
            <label>
              <input
                className="inputLollipopssiSnack m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("lollipops")}
              />
              Paletas Magnum
            </label>
            <label>
              <input
                className="inputCupcakesSnack m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("cupcakes")}
              />
              Cupcakes
            </label>
            <label>
              <input
                className="inputBreadSnack m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("bread")}
              />
              Pan de Naranja
            </label>
            <label>
              <input
                className="inputTortaFrutsSnack m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("tortaFruts")}
              />
              Torta de Frutas
            </label>
            <label>
              <input
                className="inputAmericanCoockiesSnack m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("americanCoockies")}
              />
              Galletas Americanas
            </label>
            <label>
              <input
                className="inputTortaAppleSnack m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("tortaApple")}
              />
              Torta de Manzana
            </label>
          </div>
          <p className="m-4">Otros</p>
          <input
            className="inputOtherSnack m-2 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            type="text"
            {...register("other")}
          />
        </div>
        {/* Imagenes */}
        <div>
          <p className="my-2 m-6">
            Por favor, sube imágenes de inspiración (ligas), como la temática,
            los elementos que te gustaría ver en la mesa de postres, la paleta
            de colores u otras preferencias.
          </p>
          <p className="my-2 m-6">
            Esto nos ayudará a crear un diseño personalizado para ti. Puedes
            subir hasta 5 imágenes de hasta 10MB cada una.
          </p>
          <div>
            <label>Image 1</label>
            <input
              type="file"
              {...register("file1")}
              accept="image/*"
              required
            />
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
          <div>
            <label>Image 2 (optional)</label>
            <input type="file" {...register("file2")} accept="image/*" />
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
              className="inputBudgetrCake bg-gray-50 p-2.5bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
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
            type="submit"
            className="btnSubmitCake bg-secondary text-white py-2 px-4 rounded hover:bg-accent transition"
          >
            Cotizar Mesa de Postres
          </button>
        </div>
      </form>
    </main>
  );
}
