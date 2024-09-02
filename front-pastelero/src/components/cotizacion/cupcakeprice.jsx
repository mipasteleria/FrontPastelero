import UploadFormImage from "./imagenes";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/src/context";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Cupcakeprice() {
  const { register, handleSubmit, reset } = useForm();
  const [isDelivery, setIsDelivery] = useState(false);
  const { userId } = useAuth();
  const router = useRouter();

  async function onSubmit(data) {
    try {
      const response = await fetch("http://localhost:3001/pricecupcake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flavorBizcocho: data.flavorBizcocho,
          stuffedFlavor: data.stuffedFlavor,
          cover: data.cover,
          portions: data.portions,
          delivery: data.delivery,
          deliveryAdress: data.deliveryAdress,
          fondantCover: data.fondantCover,
          deliveryDate: data.deliveryDate,
          fondantDraw: data.fondantDraw,
          buttercreamDraw: data.buttercreamDraw,
          naturalFlowers: data.naturalFlowers,
          sign: data.sign,
          eatablePrint: data.eatablePrint,
          sprinkles: data.sprinkles,
          other: data.other,
          budget: data.budget,
          contactName: data.contactName,
          contactPhone: data.contactPhone,
          questionsOrComments: data.questionsOrComments,
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
      image: "",
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
                  placeholder="Calle, número y colonia"
                  {...register("deliveryAdress")}
                  disabled={!isDelivery}
                />
              </div>
              {/* Forrado */}
              <div>
                <label>
                  <input
                    className="inputFondantCoverCupcak m-4 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                    type="checkbox"
                    {...register("fondantCover")}
                  />
                  Forrado de Fondant
                </label>
              </div>
              {/* Fecha y Hora */}
              <div>
                <p>Fecha y hora del evento</p>
                <input
                  className="inputDeliveryDateCupcake inputPeopleSnack bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
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
            Elige las opciones de decoración que te gustaría que tengan tus
            Cupcakes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label>
              <input
                className="inputDondantDrawCupcake m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("fondantDraw")}
              />
              Dibujo a mano en Fondant
            </label>
            <label>
              <input
                className="inputButtercreamDrawCupcake m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("buttercreamDraw")}
              />
              Dibujo en Buttercream
            </label>
            <label>
              <input
                className="inputNaturalFlowersCupcake m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("naturalFlowers")}
              />
              Flores naturales
            </label>
            <label>
              <input
                className="inputNaturalSignCupcake m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("sign")}
              />
              Letrero
            </label>
            <label>
              <input
                className="inputNaturalEatablePrintCupcake m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("eatablePrint")}
              />
              Impresion comestible
            </label>
            <label>
              <input
                className="inputNaturalSprinklesCupcake m-2 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                type="checkbox"
                {...register("sprinkles")}
              />
              Sprinkles
            </label>
          </div>
          <p className="m-4">Otros</p>
          <input
            className="inputOtherCupcake m-2 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            type="text"
            {...register("other")}
          />
        </div>
        <div>
          {/* Presupuesto */}
          <div className="flex flex-col md:flex-col m-6">
            <p>
              ¿Podrías informarnos si tienes un presupuesto específico para este
              pedido? Nos sería de gran ayuda conocer la cantidad que tienes en
              mente.
            </p>
            <p>Presupuesto deseado</p>
            <input
              className="inputBudgetrCake bg-gray-50 border border-secondary text-sm  p-2.5"
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
                required
                {...register("contactName")}
              />
            </div>
            <div className="m-3">
              <p>Número de celular</p>
              <input
                className="inputContactPhoneCake bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:border-accent"
                type="text"
                placeholder="000-000-0000"
                required
                {...register("contactPhone")}
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
            Cotizar Cupcakes
          </button>
        </div>
      </form>
      {/* Imagenes */}
      <p className="my-2 m-6">
        Por favor, sube dos imágenes de inspiración, como la temática, los
        elementos que te gustaría ver en los cupcakes, la paleta de colores u
        otras preferencias. <br /> Esto nos ayudará a crear un diseño
        personalizado para ti. Puedes subir hasta 2 imágenes de hasta 10MB cada
        una.
      </p>
      <UploadFormImage />
    </main>
  );
}
