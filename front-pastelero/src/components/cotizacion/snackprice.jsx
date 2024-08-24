import { useForm } from "react-hook-form";
import { useState } from "react";

export default function Snackprice() {
  const { register, handleSubmit } = useForm();
  const [isDelivery, setIsDelivery] = useState(false);

  async function onSubmit(data) {
    try {
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
          <p>Número de Personas</p>
          <select className="inputPeopleSnack" {...register("people")} required>
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
              {...register("delivery")}
              onChange={(e) => setIsDelivery(e.target.checked)}
            />
            ¿Requiere Envio?
          </label>
          <p>Lugar de entrega</p>
          <input
            className="inputDeliveryAdressSnack"
            type="text"
            placeholder="Calle, número y colonia"
            {...register("deliveryAdress")}
            disabled={!isDelivery}
          />
          <p>Fecha y hora del evento</p>
          <input
            className="inputDeliveryDateSnack"
            type="datetime-local"
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
              {...register("pay")}
            />
            Pay de Queso
          </label>
          <label>
            <input
              className="inputBrownieSnack"
              type="checkbox"
              {...register("brownie")}
            />
            Brownie
          </label>
          <label>
            <input
              className="inputCoockieSnack"
              type="checkbox"
              {...register("coockie")}
            />
            Galletas Decoradas
          </label>
          <label>
            <input
              className="inputAlfajoresSnack"
              type="checkbox"
              {...register("alfajores")}
            />
            Alfajores
          </label>
          <label>
            <input
              className="inputMacaroniSnack"
              type="checkbox"
              {...register("macaroni")}
            />
            Macarrones
          </label>
          <label>
            <input
              className="inputDonutsiSnack"
              type="checkbox"
              {...register("donuts")}
            />
            Donas
          </label>
          <label>
            <input
              className="inputLollipopssiSnack"
              type="checkbox"
              {...register("lollipops")}
            />
            Paletas Magnum
          </label>
          <label>
            <input
              className="inputCupcakesSnack"
              type="checkbox"
              {...register("cupcakes")}
            />
            Cupcakes
          </label>
          <label>
            <input
              className="inputBreadSnack"
              type="checkbox"
              {...register("bread")}
            />
            Pan de Naranja
          </label>
          <label>
            <input
              className="inputTortaFrutsSnack"
              type="checkbox"
              {...register("tortaFruts")}
            />
            Torta de Frutas
          </label>
          <label>
            <input
              className="inputAmericanCoockiesSnack"
              type="checkbox"
              {...register("americanCoockies")}
            />
            Galletas Americanas
          </label>
          <label>
            <input
              className="inputTortaAppleSnack"
              type="checkbox"
              {...register("tortaApple")}
            />
            Torta de Manzana
          </label>
          <p>Otros</p>
          <input
            className="inputOtherSnack"
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
            className="inputImageSnack"
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
          <input
            className="inputBudgetSnack"
            type="text"
            placeholder="Ingrese una cantidad"
            {...register("budget")}
            required
          />
        </div>
        <p>Información de contacto</p>
        <div>
          <p>Nombre</p>
          <input
            className="inputContactNameSnack"
            type="text"
            placeholder="Escribe tu nombre"
            required
            {...register("contactName")}
          />
          <p>Número de celular</p>
          <input
            className="inputContactPhoneSnack"
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
            className="inputQuestionsOrCommentsSnack"
            type="text"
            {...register("questionsOrComments")}
          />
        </div>
        <button className="btnSubmitSnack"> Cotizar Mesa de Postres </button>
      </form>
    </main>
  );
}
