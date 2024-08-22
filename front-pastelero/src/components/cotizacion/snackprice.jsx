import { useForm } from "react-hook-form";
import { useState } from "react";

export default function Snackprice() {
  const { register, handleSubmit } = useForm();
  const [isDelivery, setIsDelivery] = useState(false);

  async function onSubmit(data) {
    const response = await fetch("http://localhost:3001/pricesnack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        people: data.people,
        portionsPerPerson: data.portionsPerPerson,
        delivery: data.delivery,
        deliveryAdress: data.deliveryAdress,
        deliveryDate: data.deliveryDate,
        pay: data.pay,
        brownie: data.brownie,
        coockie: data.coockie,
        alfajores: data.alfajores,
        macaroni: data.macaroni,
        donuts: data.donuts,
        lollipops: data.lollipops,
        cupcakes: data.cupcakes,
        bread: data.bread,
        tortaFruts: data.tortaFruts,
        americanCoockies: data.americanCoockies,
        tortaApple: data.tortaApple,
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p>Número de Personas</p>
          <select
            className="inputPeopleSnack"
            name="people"
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
          <p>Número de Postres por Persona</p>
          <select
            className="inputPortionsPerPersonSnack"
            name="portionsPerPerson"
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
            <option value="10+">10+ postres especificar en comentarios</option>
          </select>
          <label>
            <input
              className="inputDeliverySnack"
              type="checkbox"
              name="delivery"
              {...register("delivery")}
              onChange={(e) => setIsDelivery(e.target.checked)}
            />
            ¿Requiere Envio?
          </label>
          <p>Lugar de entrega</p>
          <input
            className="inputDeliveryAdressSnack"
            type="text"
            name="deliveryAdress"
            placeholder="Calle, número y colonia"
            {...register("deliveryAdress")}
            disabled={!isDelivery}
          />
          <p>Fecha y hora del evento</p>
          <input
            className="inputDeliveryDateSnack"
            type="datetime-local"
            name="deliveryDate"
            {...register("deliveryDate")}
            required
          />
        </div>
        <div>
          <p>Elige los postres que te gustaría incluir en tu mesa</p>
          <label>
            <input
              className="inputPaySnack"
              type="checkbox"
              name="pay"
              {...register("pay")}
            />
            Pay de Queso
          </label>
          <label>
            <input
              className="inputBrownieSnack"
              type="checkbox"
              name="brownie"
              {...register("brownie")}
            />
            Brownie
          </label>
          <label>
            <input
              className="inputCoockieSnack"
              type="checkbox"
              name="coockie"
              {...register("coockie")}
            />
            Galletas Decoradas
          </label>
          <label>
            <input
              className="inputAlfajoresSnack"
              type="checkbox"
              name="alfajores"
              {...register("alfajores")}
            />
            Alfajores
          </label>
          <label>
            <input
              className="inputMacaroniSnack"
              type="checkbox"
              name="macaroni"
              {...register("macaroni")}
            />
            Macarrones
          </label>
          <label>
            <input
              className="inputDonutsiSnack"
              type="checkbox"
              name="donuts"
              {...register("donuts")}
            />
            Donas
          </label>
          <label>
            <input
              className="inputLollipopssiSnack"
              type="checkbox"
              name="lollipops"
              {...register("lollipops")}
            />
            Paletas Magnum
          </label>
          <label>
            <input
              className="inputCupcakesSnack"
              type="checkbox"
              name="cupcakes"
              {...register("cupcakes")}
            />
            Cupcakes
          </label>
          <label>
            <input
              className="inputBreadSnack"
              type="checkbox"
              name="bread"
              {...register("bread")}
            />
            Pan de Naranja
          </label>
          <label>
            <input
              className="inputTortaFrutsSnack"
              type="checkbox"
              name="tortaFruts"
              {...register("tortaFruts")}
            />
            Torta de Frutas
          </label>
          <label>
            <input
              className="inputAmericanCoockiesSnack"
              type="checkbox"
              name="americanCoockies"
              {...register("americanCoockies")}
            />
            Galletas Americanas
          </label>
          <label>
            <input
              className="inputTortaAppleSnack"
              type="checkbox"
              name="tortaApple"
              {...register("tortaApple")}
            />
            Torta de Manzana
          </label>
          <p>Otros</p>
          <input
            className="inputOtherSnack"
            type="text"
            name="other"
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
        <button className="btnSubmitSnack"> Cotizar Mesa de Postres </button>
      </form>
    </main>
  );
}
