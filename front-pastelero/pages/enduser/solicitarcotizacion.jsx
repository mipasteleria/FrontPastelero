import { useState } from "react";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import DatePicker from "@/src/components/calendario";
import WebFooter from "@/src/components/WebFooter";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function SolicitarCotizacion() {
  const [showPopup, setShowPopup] = useState(false);

  const handleClearFields = () => {
    document.querySelectorAll("input").forEach(input => (input.value = ""));
    document.querySelectorAll("select").forEach(select => (select.value = ""));
    document.querySelectorAll("textarea").forEach(textarea => (textarea.value = ""));
    document.querySelectorAll("input[type=radio], input[type=checkbox]").forEach(input => (input.checked = false));
  };

  const handleSave = () => {
    setShowPopup(true);
  };

  return (
    <div>
      <NavbarAdmin />
      <main className={`text-text ${poppins.className} max-w-screen-lg mx-auto`}>
        <h1 className={`text-4xl m-6 ${sofia.className}`}>Solicitar cotización</h1>
        <p className="m-6">Le pedimos que complete cada campo con la mayor cantidad de detalles posible para acelerar el proceso de cotización.Recuerda que somos es una empresa pequeña que realiza pocos pasteles a la semana. Por favor, solicita tucotización con suficiente anticipación. Hacemos todo lo posible para responder rápidamente, pero a veces puede haber retrasos. Agradecemos tu comprensión.</p>
        <fieldset className="flex font-semibold text-lg justify-between gap-4 m-6">
          <div className="flex items-center">
            <input id="country-option-2" type="radio" name="countries" value="Germany" className="w-6 h-6 border-gray-300 focus:ring-2 focus:ring-accent"/>
            <label htmlFor="country-option-2" className="block ms-2">Pastel</label>
          </div>

          <div className="flex items-center">
            <input id="country-option-3" type="radio" name="countries" value="Spain" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"/>
            <label htmlFor="country-option-3" className="block ms-2">Cupcakes</label>
          </div>

          <div className="flex items-center">
            <input id="country-option-4" type="radio" name="countries" value="United Kingdom" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus-ring-blue-600 dark:bg-gray-700 dark:border-gray-600"/>
            <label htmlFor="country-option-4" className="block ms-2">Mesa de postres</label>
          </div>
        </fieldset>
        <div className="flex flex-col md:flex-row justify-around mb-6">
          <div className="flex flex-col md:grid md:grid-cols-2">
            <div className="m-4">
              <label htmlFor="recipe_name" className="block mb-2 text-sm font-medium dark:text-white">
                Sabor del bizcocho
              </label>
              <select id="unit" className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5">
                <option value="grams">Vainilla</option>
                <option value="ml">Chocolate</option>
              </select>
            </div>
            <div className="m-4">
              <label htmlFor="recipe_name" className="block mb-2 text-sm font-medium dark:text-white">
                ¿Cuántos niveles quieres?
              </label>
              <select id="unit" className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5">
                <option value="grams">1 Nivel</option>
                <option value="ml">2 Niveles</option>
              </select>
            </div>
            <div className="m-4">
              <label htmlFor="recipe_name" className="block mb-2 text-sm font-medium dark:text-white">
                Número de Porciones
              </label>
              <select id="unit" className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5">
                <option value="grams">10</option>
                <option value="ml">20</option>
              </select>
            </div>
            <div className="m-4">
              <label htmlFor="recipe_name" className="block mb-2 text-sm font-medium dark:text-white">
                ¿Requieres envío al evento?
              </label>
              <select id="unit" className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent">
                <option value="grams">Sí</option>
                <option value="ml">No</option>
              </select>
            </div>
            <div className="m-4">
              <label htmlFor="recipe_name" className="block mb-2 text-sm font-medium dark:text-white">
                Sabor del relleno
              </label>
              <select id="unit" className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent">
                <option value="grams">Vainilla</option>
                <option value="ml">Chocolate</option>
              </select>
            </div>
            <div className="m-4">
              <label htmlFor="recipe_name" className="block mb-2 text-sm font-medium dark:text-white">
                Ingresa la dirección de la entrega
              </label>
              <input type="text" id="recipe_name" className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent" placeholder="Calle Bonita #10" required/>
            </div>
          </div>
          <DatePicker />
        </div>
        <div className="flex flex-col md:flex-row justify-around bg-rose-50">
          <fieldset className="m-4">
            <div class="flex items-center mb-4">
              <input
              id="checkbox-1"
              type="checkbox"
              value=""
              class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"/>
              <label for="checkbox-1" class="ms-2 text-sm font-medium text-text">
                Cobertura Buttercream (betún con base en mantequilla).
              </label>
            </div>
            <div className="flex items-center mb-4">
              <input id="checkbox-2" type="checkbox" value="" className="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"/>
              <label htmlFor="checkbox-2" className="ms-2 text-sm font-medium focus:font-bold text-text">Cobertura Garnache (Base de chocolate)</label>
            </div>

            <div className="flex items-center mb-4">
              <input id="checkbox-3" type="checkbox" value="" className="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"/>
              <label htmlFor="checkbox-3" className="ms-2 text-sm font-medium text-text">Cobertura fondant</label>
            </div>
            
            <div className="flex mb-4">
              <div className="flex items-center h-5">
                <input id="helper-checkbox" aria-describedby="helper-checkbox-text" type="checkbox" value="" className="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"/>
              </div>
              <div className="ms-2 text-sm">
                <label htmlFor="helper-checkbox" className="font-medium text-text">Dibujo en Buttercream</label>
              </div>
            </div>
            <div className="flex mb-4">
              <div className="flex items-center h-5">
                <input id="helper-checkbox" aria-describedby="helper-checkbox-text" type="checkbox" value="" className="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"/>
              </div>
              <div className="ms-2 text-sm">
                <label htmlFor="helper-checkbox" className="font-medium text-text">Dibujo en Buttercream</label>
              </div>
            </div>
            <div className="flex mb-4">
              <div className="flex items-center h-5">
                <input id="helper-checkbox-2" aria-describedby="helper-checkbox-text-2" type="checkbox" value="" className="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"/>
              </div>
              <div className="ms-2 text-sm">
                <label htmlFor="helper-checkbox-2" className="font-medium text-text">Decoración con frutas</label>
              </div>
            </div>
          </fieldset>
          <div className="m-4">
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Notas adicionales</label>
            <textarea id="message" rows="10" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-secondary focus:ring-accent focus:border-accent" placeholder="Deja tus notas aquí..."></textarea>
          </div>
        </div>
        <div className="flex justify-around m-6">
          <button onClick={handleClearFields} className="bg-secondary text-white p-3 rounded-md">
            Cancelar
          </button>
          <button onClick={handleSave} className="bg-accent text-white p-3 rounded-md">
            Guardar
          </button>
        </div>
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="bg-white p-6 rounded-lg shadow-lg m-6">
              <p className="mb-4">Cotización enviada con éxito! espere 24hrs.</p>
              <Link href="/">
                <button className="bg-accent text-white p-3 rounded-md">Aceptar</button>
              </Link>
            </div>
          </div>
        )}
      </main>
      <WebFooter />
    </div>
  );
}
