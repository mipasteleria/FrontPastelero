import { useState } from "react";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import ContactInfo from "./contactinfo";
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
    "Sin Relleno",
    "Chocolate",
    "Nutella",
    "Dulce de Leche",
    "Queso Crema",
    "Mermelada Frambuesa",
    "Mermelada Maracuya",
    "Mermelada de blueberry y LemonCurd (Crema de limon)",
  ];

  const cober = [
    "Buttercream Vainilla",
    "Buttercream Chocolate",
    "Ganache Chocolate semiamargo",
    "Ganache Chocolate Blanco",
  ];

  const cupcakesDecoreOptions = [
    "Dibujo a mano en Fondant",
    "Dibujo en Buttercream",
    "Flores naturales",
    "Letrero",
    "Impresion comestible",
    "Sprinkles"
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
    budget: "",
      images: [],
      userName: "",
      userPhone: "",
      userComments: "",
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
  const handleClearFields = () => {
    setFormData({
        cupcakeFlavor: "",
        portions: "",
        cupcakeFilling: "",
        cober: "",
        fondant: false,
        decorations: [],
        others: "",
        envio: "",
        LugEnt: "",
        budget: "",
        images: [],
        userName: "",
        userPhone: "",
        userComments: "",
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={`${poppins.className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <div className="md:col-span-3">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <label>Relleno</label>
        <select
          className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
          name="cupcakeFilling"
          value={formData.cupcakeFilling}
          onChange={handleInputChange}
        >
          <option value="">Selecciona un sabor</option>
          {cupcakeFilling.map((flavor) => (
            <option key={flavor} value={flavor}>
              {flavor}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Cobertura deseada</label>
        <select
          className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
          name="cober"
          value={formData.cober}
          onChange={handleInputChange}
        >
          <option value="">Selecciona la cobertura</option>
          {cober.map((flavor) => (
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
            <option key={i} value={(i + 1) * 12}>
              {(i + 1) * 12}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
  <div className="md:col-span-1 flex items-start">
    <DatePicker />
  </div>
</div>

      <div className="flex flex-col bg-rose-50 p-6 mb-6 rounded-lg">
        <h2 className={`text-xl m-4 ${sofia.className}`}>
          Elige las opciones de decoración que te gustaría que tengan tus Cupcakes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cupcakesDecoreOptions.map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                name="decorations"
                class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
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
    </form>
  );
};

export default CupcakeForm;