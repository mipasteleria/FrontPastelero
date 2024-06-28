import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import DatePicker from "@/src/components/calendario";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Conocenuestrosproductos() {
  return (
    <div>
      <NavbarAdmin />
      <main className={`text-text ${poppins.className}`}>
      <h1 className={`text-4xl m-6 ${sofia.className}`}>Solicitar cotización</h1>
      <p className="m-6">Le pedimos que complete cada campo con la mayor cantidad de detalles posible para acelerar el proceso de cotización.Recuerda que somos es una empresa pequeña que realiza pocos pasteles a la semana. Por favor, solicita tucotización con suficiente anticipación. Hacemos todo lo posible para responder rápidamente, pero a veces puede haber retrasos. Agradecemos tu comprensión.</p>
      <fieldset className="flex font-semibold text-lg justify-between gap-4 m-6">
        <div class="flex items-center">
          <input id="country-option-2" type="radio" name="countries" value="Germany" class="w-6 h-6 border-gray-300 focus:ring-2 focus:ring-accent"/>
          <label for="country-option-2" class="block ms-2">
            Pastel
          </label>
        </div>

        <div class="flex items-center">
          <input id="country-option-3" type="radio" name="countries" value="Spain" class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"/>
          <label for="country-option-3" class="block ms-2">
            Cupcakes
          </label>
        </div>

        <div class="flex items-center">
          <input id="country-option-4" type="radio" name="countries" value="United Kingdom" class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus-ring-blue-600 dark:bg-gray-700 dark:border-gray-600"/>
          <label for="country-option-4" class="block ms-2">
            Mesa de postres
          </label>
        </div>
      </fieldset>
      <div className="flex flex-col md:flex-row justify-around mb-6">
        <div className="flex flex-col md:grid md:grid-cols-2">
            <div className="m-4">
                <label htmlFor="recipe_name" className="block mb-2 text-sm font-medium dark:text-white">
                Sabor del bizcocho
                </label>
                <select
                        id="unit"
                        className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                      >
                        <option value="grams">Vainilla</option>
                        <option value="ml">Chocolate</option>
                      </select>
            </div>
            <div className="m-4">
                <label htmlFor="recipe_name" className="block mb-2 text-sm font-medium dark:text-white">
                ¿Cuántos niveles quieres?
                </label>
                <select
                        id="unit"
                        className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                      >
                        <option value="grams">1 Nivel</option>
                        <option value="ml">2 Niveles</option>
                      </select>
            </div>
            <div className="m-4">
                <label htmlFor="recipe_name" className="block mb-2 text-sm font-medium dark:text-white">
                Número de Porciones
                </label>
                <select
                        id="unit"
                        className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                      >
                        <option value="grams">10</option>
                        <option value="ml">20</option>
                      </select>
            </div>
            <div className="m-4">
                <label htmlFor="recipe_name" className="block mb-2 text-sm font-medium dark:text-white">
                ¿Requieres envío al evento?
                </label>
                <select
                        id="unit"
                        className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      >
                        <option value="grams">Sí</option>
                        <option value="ml">No</option>
                      </select>
            </div>
            <div className="m-4">
                <label htmlFor="recipe_name" className="block mb-2 text-sm font-medium dark:text-white">
                Sabor del relleno
                </label>
                <select
                        id="unit"
                        className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      >
                        <option value="grams">Vainilla</option>
                        <option value="ml">Chocolate</option>
                      </select>
            </div>
            <div className="m-4">
                <label htmlFor="recipe_name" className="block mb-2 text-sm font-medium dark:text-white">
                Ingresa la dirección de la entrega
                </label>
                <input
                type="text"
                id="recipe_name"
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                placeholder="Calle Bonita #10"
                required
                />
            </div>
        </div>
        <DatePicker />
      </div>
      <div className="flex flex-col md:flex-row justify-around bg-rose-50">
        <fieldset className="m-4">
            <div class="flex items-center mb-4">
              <input
                checked
                id="checkbox-1"
                type="checkbox"
                value=""
                class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
              />
              <label for="checkbox-1" class="ms-2 text-sm font-medium text-text">
              Cobertura Buttercream (betún con base en mantequilla).
              </label>
            </div>

          <div class="flex items-center mb-4">
            <input
              id="checkbox-2"
              type="checkbox"
              value=""
              class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
            />
            <label for="checkbox-2" class="ms-2 text-sm font-medium focus:font-bold text-text">Cobertura Garnache (Base de chocolate)</label>
          </div>

          <div class="flex items-center mb-4">
            <input
              id="checkbox-3"
              type="checkbox"
              value=""
              class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
            />
            <label for="checkbox-3" class="ms-2 text-sm font-medium text-text">Cobertura fondant</label>
          </div>
          
          <div class="flex mb-4">
            <div class="flex items-center h-5">
              <input
                id="helper-checkbox"
                aria-describedby="helper-checkbox-text"
                type="checkbox"
                value=""
                class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
              />
            </div>
            <div class="ms-2 text-sm">
              <label for="helper-checkbox" class="font-medium text-text">Dibujo en Buttercream</label>
            </div>
          </div>
          <div class="flex mb-4">
            <div class="flex items-center h-5">
              <input
                id="helper-checkbox"
                aria-describedby="helper-checkbox-text"
                type="checkbox"
                value=""
                class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
              />
            </div>
            <div class="ms-2 text-sm">
              <label for="helper-checkbox" class="font-medium text-text">Dibujo en Fondant</label>
            </div>
          </div>
          <div class="flex mb-4">
            <div class="flex items-center h-5">
              <input
                id="helper-checkbox"
                aria-describedby="helper-checkbox-text"
                type="checkbox"
                value=""
                class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
              />
            </div>
            <div class="ms-2 text-sm">
              <label for="helper-checkbox" class="font-medium text-text">Figura 3d en Fondant</label>
            </div>
          </div>

        </fieldset>
        <fieldset className="m-4">
            <div class="flex items-center mb-4">
              <input
                checked
                id="checkbox-1"
                type="checkbox"
                value=""
                class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
              />
              <label for="checkbox-1" class="ms-2 text-sm font-medium text-text">
              Flores naturales.
              </label>
            </div>

          <div class="flex items-center mb-4">
            <input
              id="checkbox-2"
              type="checkbox"
              value=""
              class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
            />
            <label for="checkbox-2" class="ms-2 text-sm font-medium focus:font-bold text-text">Cobertura GFlores de Fondant</label>
          </div>

          <div class="flex items-center mb-4">
            <input
              id="checkbox-3"
              type="checkbox"
              value=""
              class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
            />
            <label for="checkbox-3" class="ms-2 text-sm font-medium text-text">Letrero</label>
          </div>
          
          <div class="flex mb-4">
            <div class="flex items-center h-5">
              <input
                id="helper-checkbox"
                aria-describedby="helper-checkbox-text"
                type="checkbox"
                value=""
                class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
              />
            </div>
            <div class="ms-2 text-sm">
              <label for="helper-checkbox" class="font-medium text-text">Pastel 3d de algún pesonaje</label>
            </div>
          </div>
          <div className="mb-6">
                  <label htmlFor="recipe_name" className="block mb-2 text-sm font-medium dark:text-white">
                    Otro
                  </label>
                  <input
                    type="text"
                    id="recipe_name"
                    className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                    placeholder="Pastel de vainilla"
                    required
                  />
                </div>
        </fieldset>
      </div>
      <div className="m-6">
        <p className="my-2">
          Por favor, sube imágenes de inspiración, como la temática, los elementos que te gustaría ver en el pastel, la paleta de colores u otras preferencias. 
        </p>
        <p className="my-2">
          Esto nos ayudará a crear un diseño personalizado para ti. Puedes subir hasta 5 imágenes de hasta 10MB cada una.
        </p>
      </div>
      <div class="flex items-center justify-center m-10">
          <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input id="dropzone-file" type="file" class="hidden" />
          </label>
      </div> 
      <div class=" bg-gray-200 rounded-full m-10">
        <div class="bg-primary text-xs font-medium text-text text-center p-0.5 leading-none rounded-full"> 45%</div>
      </div>
      <div className="flex flex-col md:flex-row m-6">
        <p className="w-1/2">¿Podrías informarnos si tienes un presupuesto específico para este pedido? Nos sería de gran ayuda conocer la cantidad que tienes en mente.</p>
        <div className="m-4 w-1/2">
                <label htmlFor="recipe_name" className="block mb-2 text-sm font-medium dark:text-white">
                Presupuesto deseado
                </label>
                <input
                type="text"
                id="recipe_name"
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:border-accent"
                placeholder="0.0"
                required
                />
            </div>
      </div>
    </main>
    </div>
  );
}