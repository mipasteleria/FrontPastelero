import { useState } from "react";
import DatePicker from "@/src/components/calendario";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const CupcakeForm = ({ register, errors }) => {
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
    "Sprinkles",
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

  return (
    <div className={`${poppins.className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Sabor de Cupcake</label>
              <select
                {...register("cupcakeFlavor", { required: "Selecciona un sabor de cupcake" })}
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
              {errors.cupcakeFlavor && <p className="text-red-500">{errors.cupcakeFlavor.message}</p>}
            </div>
            <div>
              <label>Relleno</label>
              <select
                {...register("cupcakeFilling", { required: "Selecciona un relleno" })}
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                name="cupcakeFilling"
                value={formData.cupcakeFilling}
                onChange={handleInputChange}
              >
                <option value="">Selecciona un relleno</option>
                {cupcakeFilling.map((filling) => (
                  <option key={filling} value={filling}>
                    {filling}
                  </option>
                ))}
              </select>
              {errors.cupcakeFilling && <p className="text-red-500">{errors.cupcakeFilling.message}</p>}
            </div>
            <div>
              <label>Cobertura deseada</label>
              <select
                {...register("cober", { required: "Selecciona una cobertura" })}
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                name="cober"
                value={formData.cober}
                onChange={handleInputChange}
              >
                <option value="">Selecciona la cobertura</option>
                {cober.map((cover) => (
                  <option key={cover} value={cover}>
                    {cover}
                  </option>
                ))}
              </select>
              {errors.cober && <p className="text-red-500">{errors.cober.message}</p>}
            </div>
            <div>
              <label>Número de Porciones</label>
              <select
                {...register("portions", { required: "Selecciona el número de porciones" })}
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
              {errors.portions && <p className="text-red-500">{errors.portions.message}</p>}
            </div>
            <div>
              <label className="ms-2 text-sm font-medium text-text">
                <input
                  type="checkbox"
                  {...register("fondant")}
                  name="fondant"
                  className="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                  checked={formData.fondant}
                  onChange={handleInputChange}
                />
                Forrado de Fondant
              </label>
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
                {...register("decorations")}
                name="decorations"
                className="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
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
            {...register("others")}
            className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 mt-2"
            name="others"
            value={formData.others}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
<<<<<<< HEAD
    <div className="m-4">
      <label
        htmlFor="userComments"
        className="block mb-2 text-sm font-medium dark:text-white"
      >
        Preguntas o comentarios
      </label>
      <textarea
        id="userComments"
        name="userComments"
        className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:border-accent"
        placeholder=""
        value={formData.userComments}
        onChange={handleInputChange}
        required
        rows="6"
        style={{ resize: "none" }}
      />
    </div>
  </div>

  {/* Botón para limpiar campos */}
  <div className="flex flex-col md:flex-row items-center justify-end m-4 mb-8 gap-4 ml-4">
    <button
      type="button"
      className="bg-secondary text-white py-2 px-4 rounded hover:bg-accent transition"
      onClick={handleClearFields}
    >
      Limpiar campos
    </button>
    <Link href="/enduser/detallesolicitudcupcake">
    <button
        type="submit"
        className="bg-secondary text-white py-2 px-4 rounded hover:bg-accent transition"
      >
        Cotizar Cupcakes
      </button>
      </Link>
  </div>
      
    </form>
=======
>>>>>>> e15d296f208f5c11e5c0f7ee401b5c953be8b4bf
  );
};

export default CupcakeForm;
