import { useState } from "react";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Link from "next/link";
import DatePicker from "@/src/components/calendario";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const DessertTableForm = () => {
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

  const [formData, setFormData] = useState({
    persons: "",
    dessertsPerPerson: "",
    selectedDesserts: [],
    others: "",
    envio: "",
    LugEnt: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDessertsChange = (dessert) => {
    setFormData((prevData) => {
      const selectedDesserts = prevData.selectedDesserts.includes(dessert)
        ? prevData.selectedDesserts.filter((item) => item !== dessert)
        : [...prevData.selectedDesserts, dessert];
      return {
        ...prevData,
        selectedDesserts,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const isDessertOptionDisabled = (dessert) => {
    return (
      !formData.selectedDesserts.includes(dessert) &&
      formData.selectedDesserts.length >= parseInt(formData.dessertsPerPerson)
    );
  };

  return (
    <form onSubmit={handleSubmit} className={`${poppins.className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label>Número de Personas</label>
          <select
            className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            name="persons"
            value={formData.persons}
            onChange={handleInputChange}
          >
            <option value="">Selecciona el número de personas</option>
            {[...Array(18)].map((_, i) => (
              <option key={i} value={(i + 3) * 10}>
                {(i + 3) * 10}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Número de Postres por Persona</label>
          <select
            className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            name="dessertsPerPerson"
            value={formData.dessertsPerPerson}
            onChange={handleInputChange}
          >
            <option value="">Selecciona el número de postres por persona</option>
            {[...Array(6)].map((_, i) => (
              <option key={i} value={i + 3}>
                {i + 3}
              </option>
            ))}
          </select>
        </div>
        <div>
          <DatePicker />
        </div>
        <div>
          <label>Requiere Envio</label>
          <select
            id="envio"
            name="envio"
            className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            value={formData.envio}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label>Lugar de entrega</label>
          <input
            type="text"
            id="LugEnt"
            name="LugEnt"
            className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            placeholder={formData.envio === "no" ? "Se recogerá en sucursal" : "Calle, número y colonia"}
            value={formData.LugEnt}
            onChange={handleInputChange}
            disabled={formData.envio === "no"}
            required
          />
        </div>
      </div>
      <div className="flex flex-col bg-rose-50 p-6 mb-6 rounded-lg">
        <h2 className={`text-xl m-4 ${sofia.className}`}>
          Elige las opciones de postres que te gustaría que tenga tu mesa de postres
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {desserts.map((dessert) => (
            <label key={dessert} className="flex items-center">
              <input
                type="checkbox"
                name="selectedDesserts"
                checked={formData.selectedDesserts.includes(dessert)}
                onChange={() => handleDessertsChange(dessert)}
                disabled={isDessertOptionDisabled(dessert)}
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
            value={formData.others}
            onChange={handleInputChange}
          />
        </div>
      </div>

    </form>
  );
};

export default DessertTableForm;
