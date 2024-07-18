import { useState } from "react";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Link from "next/link";
import DatePicker from "@/src/components/calendario";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const CupcakeForm = () => {
  const cupcakeFlavor = [
    "Vainilla",
    "Chocolate",
    "Chocochip",
    "Red Velvet",
    "Zanahoria",
    "Limon",
  ];

  const cupcakeFilling = [
    "Buttercream Vainilla",
    "Buttercream Chocolate",
    "Ganache Chocolate semiamargo",
    "Ganache Chocolate Blanco",
    "Mermelada de blueberry y LemonCurd",
    "Queso Crema",
    "Mermelada Frambuesa",
    "Mermelada Maracuya",
  ];

  const cober = [
    "Buttercream Vainilla",
    "Buttercream Chocolate",
    "Ganache Chocolate semiamargo",
    "Ganache Chocolate Blanco",
  ];

  const cupcakesDecoreOptions = [
    "Cobertura Buttercream(betun con base en mantequilla)",
    "Cobertura Ganache Base de Chocolate",
    "Forrado de Fondant",
    "Dibujo a mano en Fondant",
    "Dibujo en Buttercream",
    "Flores naturales",
    "Letrero",
    "Impresion comestible",
  ];

  const [formData, setFormData] = useState({
    cupcakeFlavor: "",
    portions: "",
    cupcakeFilling: "",
    cober: "",
    fondant: false,
    decorations: [],
    others: "",
    envio: "",
    LugEnt: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleDecorationsChange = (decoration) => {
    setFormData((prevData) => {
      const decorations = prevData.decorations.includes(decoration)
        ? prevData.decorations.filter((item) => item !== decoration)
        : [...prevData.decorations, decoration];
      return {
        ...prevData,
        decorations,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={`${poppins.className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label>Sabor de Cupcake</label>
          <select
            className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            name="cupcakeFlavor"
            value={formData.cupcakeFlavor}
            onChange={handleInputChange}
          >
            <option value="">Selecciona un sabor</option>
            {cupcakeFlavor.map((flavor) => (
              <option key={flavor} value={flavor}>
                {flavor}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Número de Porciones</label>
          <select
            className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            name="portions"
            value={formData.portions}
            onChange={handleInputChange}
          >
            <option value="">Selecciona el número de porciones</option>
            {[...Array(20)].map((_, i) => (
              <option key={i} value={(i + 1) * 10}>
                {(i + 1) * 10}
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
          Elige las opciones de decoración que te gustaría que tengan tus cupcakes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cupcakesDecoreOptions.map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                name="decorations"
                checked={formData.decorations.includes(option)}
                onChange={() => handleDecorationsChange(option)}
              />
              <span className="ml-2">{option}</span>
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
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default CupcakeForm;
