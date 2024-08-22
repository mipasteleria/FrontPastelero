import { useForm } from "react-hook-form";

export default function Cakeprice() {
  const { register, handleSubmit } = useForm();

  async function onSubmit(data) {
    const response = await fetch("http://localhost:3001/pricecake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flavor: data.flavor,
        levels: data.levels,
        portions: data.portions,
        delivery: data.delivery,
        stuffedFlavor: data.stuffedFlavor,
        cover: data.cover,
        deliveryAdress: data.deliveryAdress,
        fondantCover: data.fondantCover,
        deliveryDate: data.deliveryDate,
        buttercream: data.buttercream,
        ganache: data.ganache,
        fondant: data.fondant,
        fondantDraw: data.fondantDraw,
        buttercreamDraw: data.buttercreamDraw,
        naturalFlowers: data.naturalFlowers,
        sign: data.sign,
        eatablePrint: data.eatablePrint,
        sugarcharacter3d: data.sugarcharacter3d,
        character: data.character,
        other: data.other,
        image: data.image,
        budget: data.budget,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        questionsOrComments: data.questionsOrComments,
      }),
    });
  }

  return (
    <main>
      <p>Selecciona el producto que deseas cotizar:</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p>Sabor del bizocho</p>
          <select
            className="inputFlavorCake"
            name="flavor"
            {...register("flavor")}
            required
          >
            <option value="">Selecciona un sabor</option>
            <option value="vainilla">Bizcocho de vainilla</option>
            <option value="chocolate">Bizcocho de chocolate</option>
            <option value="Red Velvet">Bizcocho de red velvet</option>
            <option value="Naranja">Bizcocho de naranja</option>
            <option value="Dulce de leche">Bizcocho de dulce de leche</option>
          </select>
          <p>Número de Porciones</p>
          <select
            className="inputPortionsCake"
            name="portions"
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
          <p>Número de Niveles</p>
          <select
            className="inputLevelsCake"
            name="levels"
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
          <p>Sabor del Relleno</p>
          <select
            className="inputStuffedFlavorCake"
            name="stuffedFlavor"
            {...register("stuffedFlavor")}
            required
          >
            <option value="">Selecciona el Sabor de Relleno</option>
            <option value="Buttercream Vainilla">Buttercream Vainilla</option>
            <option value="Buttercream chocolate">Buttercream chocolate</option>
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
            <option value="Mermelada de Maracuya">Mermelada de Maracuya</option>
          </select>
          <p>Cobertura</p>
          <select
            className="inputCoverCake"
            name="cover"
            {...register("cover")}
            required
          >
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
          <label>
            <input
              className="inputDeliveryCake"
              type="checkbox"
              name="delivery"
              {...register("delivery")}
            />
            ¿Requiere Envio?
          </label>
          <p>Lugar de entrega</p>
          <input
            className="inputDeliveryAdressCake"
            type="text"
            name="deliveryAdress"
            placeholder="Calle, número y colonia"
            {...register("deliveryAdress")}
          />
          <label>
            <input
              className="inputFondantCoverCake"
              type="checkbox"
              name="fondantCover"
              {...register("fondantCover")}
            />
            Forrado de Fondant
          </label>
          <p>Fecha y hora del evento</p>
          <input
            className="inputDeliveryDateCake"
            type="datetime-local"
            name="deliveryDate"
            {...register("deliveryDate")}
            required
          />
        </div>

        <div>
          <p>
            Elige las opciones de decoración que te gustaría que tenga tu pastel
          </p>
          <label>
            <input
              className="inputButtercreamCake"
              type="checkbox"
              name="buttercream"
              {...register("buttercream")}
            />
            Cobertura Buttercream(betun con base en mantequilla)
          </label>
          <label>
            <input
              className="inputGanacheCake"
              type="checkbox"
              name="ganache"
              {...register("ganache")}
            />
            Cobertura Ganache Base de Chocolate
          </label>
          <label>
            <input
              className="inputFondantCake"
              type="checkbox"
              name="fondant"
              {...register("fondant")}
            />
            Forrado de Fondant
          </label>
          <label>
            <input
              className="inputFondantDrawCake"
              type="checkbox"
              name="fondantDraw"
              {...register("fondantDraw")}
            />
            Dibujo a mano en Fondant
          </label>
          <label>
            <input
              className="inputbuttercreamDrawCake"
              type="checkbox"
              name="buttercreamDraw"
              {...register("buttercreamDraw")}
            />
            Dibujo en Buttercream
          </label>
          <label>
            <input
              className="inputNaturalFlowersCake"
              type="checkbox"
              name="naturalFlowers"
              {...register("naturalFlowers")}
            />
            Flores naturales
          </label>
          <label>
            <input
              className="inputSignCake"
              type="checkbox"
              name="sign"
              {...register("sign")}
            />
            Letrero
          </label>
          <label>
            <input
              className="inputEatablePrintCake"
              type="checkbox"
              name="eatablePrint"
              {...register("eatablePrint")}
            />
            Impresion comestible
          </label>
          <label>
            <input
              className="inputSugarcharacter3dCake"
              type="checkbox"
              name="sugarcharacter3d"
              {...register("sugarcharacter3d")}
            />
            Personajes modelados de azúcar
          </label>
          <label>
            <input
              className="inputCharacterCake"
              type="checkbox"
              name="character"
              {...register("character")}
            />
            Pastel 3d de un personaje
          </label>
          <p>Otros</p>
          <input
            className="inputOtherCake"
            type="text"
            name="other"
            {...register("other")}
          />
        </div>

        <div>
          <p>
            Por favor, sube imágenes de inspiración, como la temática, los
            elementos que te gustaría ver en el pastel, la paleta de colores u
            otras preferencias.
          </p>
          <p>
            Esto nos ayudará a crear un diseño personalizado para ti. Puedes
            subir hasta 5 imágenes de hasta 10MB cada una.
          </p>
          <input
            className="inputImageCake"
            type="text"
            name="image"
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
            name="budget"
            {...register("budget")}
          />
        </div>
        <p>Información de contacto</p>
        <div>
          <p>Nombre</p>
          <input
            className="inputContactNameCake"
            type="text"
            name="contactName"
            placeholder="Escribe tu nombre"
            required
            {...register("contactName")}
          />
          <p>Número de celular</p>
          <input
            className="inputContactPhoneCake"
            type="text"
            name="contactPhone"
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
            name="questionsOrComments"
            {...register("questionsOrComments")}
          />
        </div>
        <button className="btnSubmitCake"> Cotizar Pastel </button>
      </form>
    </main>
  );
}
