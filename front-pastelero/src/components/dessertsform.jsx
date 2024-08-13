import { useState } from "react";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import DatePicker from "@/src/components/calendario";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const DessertTableForm = ({ register, errors }) => {
  const desserts = [
    "Pay de queso",
    "Brownie",
    "Galletas Decoradas",
    "Alfajores",
    "Macarrons",
    "Donas",
    "Paletas Magnum",
    "Cupcakes",
    "Pan de Naranja",
    "Tarta de Frutas",
    "Galletas Americanas",
    "Tarta de Manzana",
  ];

  return (
    <div className={`${poppins.className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Número de Personas</label>
              <select
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                name="numberOfPeople"
                {...register("numberOfPeople", { required: "Este campo es obligatorio" })}
              >
                <option value="">Selecciona el número de personas</option>
                {[...Array(8)].map((_, i) => (
                  <option key={i} value={30 + i * 10}>
                    {30 + i * 10}
                  </option>
                ))}
              </select>
              {errors.numberOfPeople && <p className="text-red-500">{errors.numberOfPeople.message}</p>}
            </div>
            <div>
              <label>Número de Postres por Persona</label>
              <select
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                name="dessertsPerPerson"
                {...register("dessertsPerPerson", { required: "Este campo es obligatorio" })}
              >
                <option value="">Selecciona el número de postres</option>
                {[...Array(6)].map((_, i) => (
                  <option key={i} value={3 + i}>
                    {3 + i}
                  </option>
                ))}
              </select>
              {errors.dessertsPerPerson && <p className="text-red-500">{errors.dessertsPerPerson.message}</p>}
            </div>
            <div>
              <label>Requiere Envio</label>
              <select
                id="envio"
                name="envio"
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                {...register("envio", { required: "Este campo es obligatorio" })}
              >
                <option value="">Selecciona una opción</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
              {errors.envio && <p className="text-red-500">{errors.envio.message}</p>}
            </div>
            <div>
              <label>Lugar de entrega</label>
              <input
                type="text"
                id="LugEnt"
                name="LugEnt"
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                placeholder="Calle, número y colonia"
                {...register("LugEnt", { required: "Este campo es obligatorio" })}
              />
              {errors.LugEnt && <p className="text-red-500">{errors.LugEnt.message}</p>}
            </div>
          </div>
        </div>
        <div className="md:col-span-1 flex items-start">
          <DatePicker />
        </div>
      </div>

      <div className="flex flex-col bg-rose-50 p-6 mb-6 rounded-lg">
        <h2 className={`text-xl m-4 ${sofia.className}`}>
          Elige los postres que te gustaría incluir en tu mesa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {desserts.map((dessert) => (
            <label key={dessert} className="ms-2 text-sm font-medium text-text flex items-center">
              <input
                type="checkbox"
                name="dessertOptions"
                className="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                {...register("dessertOptions")}
              />
              <span className="ml-2">{dessert}</span>
            </label>
          ))}
        </div>
        <div>
          <label>Otros</label>
          <input
            type="text"
            className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 mt-2"
            name="others"
            {...register("others")}
          />
        </div>
      </div>
    </div>
  );
};

export default DessertTableForm;
