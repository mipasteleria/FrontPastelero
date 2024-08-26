import { useForm } from "react-hook-form";
import { useState } from "react";

export default function Cupcakeprice() {
  const { register, handleSubmit } = useForm();
  const [isDelivery, setIsDelivery] = useState(false);

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
          image: data.image,
          budget: data.budget,
          contactName: data.contactName,
          contactPhone: data.contactPhone,
          questionsOrComments: data.questionsOrComments,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      console.log("Response data:", json);
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }

  return (
    <main>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p>Sabor de Cupcake</p>
          <select
            className="inputFlavorBizcochoCupcake"
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
          <p>Relleno</p>
          <select
            className="inputStuffedFlavorCupcake"
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
            <option value="mermelada de Maracuya">Mermelada de Maracuya</option>
          </select>
          <p>Cobertura</p>
          <select className="inputCoverCupcake" {...register("cover")} required>
            <option value="">Selecciona la cobertura</option>
            <option value="Buttercream vainilla">Buttercream vainilla</option>
            <option value="Buttercream chocolate">Buttercream chocolate</option>
            <option value="Ganache Chocolate Semiamargo">
              Ganache Chocolate Semiamargo
            </option>
            <option value="Ganache Chocolate Blanco">
              Ganache Chocolate Blanco
            </option>
          </select>
          <p>Número de Porciones</p>
          <select
            className="inputPortionsCupcake"
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
          <label>
            <input
              className="inputDeliveryCupcake"
              type="checkbox"
              {...register("delivery")}
              onChange={(e) => setIsDelivery(e.target.checked)}
            />
            ¿Requiere Envio?
          </label>
          <p>Lugar de entrega</p>
          <input
            className="inputDeliveryAdressCupcake"
            type="text"
            placeholder="Calle, número y colonia"
            {...register("deliveryAdress")}
            disabled={!isDelivery}
          />
          <label>
            <input
              className="inputFondantCoverCupcake"
              type="checkbox"
              {...register("fondantCover")}
            />
            Forrado de Fondant
          </label>
          <p>Fecha y hora del evento</p>
          <input
            className="inputDeliveryDateCupcake"
            type="datetime-local"
            {...register("deliveryDate")}
            required
          />
        </div>
        <div>
          <p>
            Elige las opciones de decoración que te gustaría que tengan tus
            Cupcakes
          </p>
          <label>
            <input
              className="inputDondantDrawCupcake"
              type="checkbox"
              {...register("fondantDraw")}
            />
            Dibujo a mano en Fondant
          </label>
          <label>
            <input
              className="inputButtercreamDrawCupcake"
              type="checkbox"
              {...register("buttercreamDraw")}
            />
            Dibujo en Buttercream
          </label>
          <label>
            <input
              className="inputNaturalFlowersCupcake"
              type="checkbox"
              {...register("naturalFlowers")}
            />
            Flores naturales
          </label>
          <label>
            <input
              className="inputNaturalSignCupcake"
              type="checkbox"
              {...register("sign")}
            />
            Letrero
          </label>
          <label>
            <input
              className="inputNaturalEatablePrintCupcake"
              type="checkbox"
              {...register("eatablePrint")}
            />
            Impresion comestible
          </label>
          <label>
            <input
              className="inputNaturalSprinklesCupcake"
              type="checkbox"
              {...register("sprinkles")}
            />
            Sprinkles
          </label>
          <p>Otros</p>
          <input
            className="inputOtherCupcake"
            type="text"
            {...register("other")}
          />
        </div>
        <div>
          <p>
            Por favor, sube imágenes de inspiración (ligas), como la temática,
            los elementos que te gustaría ver en la mesa de postres, la paleta
            de colores u otras preferencias.
          </p>
          <p>
            Esto nos ayudará a crear un diseño personalizado para ti. Puedes
            subir hasta 5 imágenes de hasta 10MB cada una.
          </p>
          <input
            className="inputImageCake"
            type="text"
            placeholder="Copia aquí la url de la imagen a subir"
            required
            {...register("image")}
          />
          <p>
            ¿Podrías informarnos si tienes un presupuesto específico para este
            pedido? Nos sería de gran ayuda conocer la cantidad que tienes en
            mente.
          </p>
          <p>Presupuesto deseado</p>
          <input
            className="inputBudgetrCake"
            type="text"
            {...register("budget")}
          />
        </div>
        <p>Información de contacto</p>
        <div>
          <p>Nombre</p>
          <input
            className="inputContactNameCake"
            type="text"
            placeholder="Escribe tu nombre"
            required
            {...register("contactName")}
          />
          <p>Número de celular</p>
          <input
            className="inputContactPhoneCake"
            type="text"
            placeholder="000-000-0000"
            required
            {...register("contactPhone")}
          />
          <p>
            Preguntas o comentarios, platicanos más acerca de tu idea o
            tematica, nos especializamos en diseñar dulsuras a la medida
          </p>
          <input
            className="inputQuestionsOrCommentsCake"
            type="text"
            {...register("questionsOrComments")}
          />
        </div>
        <button className="btnSubmitSnack"> Cotizar Cupcakes </button>
      </form>
    </main>
  );
}
