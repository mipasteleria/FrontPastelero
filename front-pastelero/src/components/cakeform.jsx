import { useState } from "react";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Link from "next/link";
import DatePicker from "@/src/components/calendario";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const CakeForm = () => {
  const cakeFlavor = [
    "Bizcocho de Vainilla", "Bizcocho de Chocolate", "Bizcocho Red Velvet", 
    "Bizcocho de Naranja", "Bizcocho Dulce de Leche"
  ];
  const cakeFilling = [
    "Buttercream Vainilla", "Buttercream Chocolate", "Ganache Chocolate semiamargo", 
    "Ganache Chocolate Blanco", "Mermelada de blueberry y LemonCurd", 
    "Queso Crema", "Mermelada Frambuesa", "Mermelada Maracuya"
  ];
  const cober = [
    "Buttercream Vainilla", "Buttercream Chocolate", "Ganache Chocolate semiamargo", 
    "Ganache Chocolate Blanco"
  ];
  const cakeDecoreOptions = [
    "Cobertura Buttercream(betun con base en mantequilla)", 
    "Cobertura Ganache Base de Chocolate", "Forrado de Fondant", 
    "Dibujo a mano en Fondant", "Dibujo en Buttercream", "Flores naturales", 
    "Letrero", "Impresion comestible", "Personajes modelados de azúcar", 
    "Pastel 3d de un personaje"
  ];

  const [formData, setFormData] = useState({
    cakeFlavor: "", portions: "", levels: "", cakeFilling: "", cober: "", 
    fondant: false, decorations: [], others: "", envio: "", LugEnt: "", 
    budget: "", images: [], userName: "", userPhone: "", userComments: "", 
    Date: "", Hour: ""
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleDecorationsChange = (decoration) => {
    setFormData((prevData) => {
      const decorations = prevData.decorations.includes(decoration)
        ? prevData.decorations.filter((item) => item !== decoration)
        : [...prevData.decorations, decoration];
      return { ...prevData, decorations };
    });
  };

  const handleClearFields = () => {
    setFormData({
      cakeFlavor: "", portions: "", levels: "", cakeFilling: "", cober: "", 
      fondant: false, decorations: [], others: "", envio: "", LugEnt: "", 
      budget: "", images: [], userName: "", userPhone: "", Date: "", 
      Hour: "", userComments: ""
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={`${poppins.className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm font-medium dark:text-white">
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Sabor del Bizcocho", name: "cakeFlavor", options: cakeFlavor },
              { label: "Número de Porciones", name: "portions", options: [...Array(20)].map((_, i) => (i + 1) * 10) },
              { label: "Número de Niveles", name: "levels", options: [...Array(5)].map((_, i) => i + 1) },
              { label: "Sabor del Relleno", name: "cakeFilling", options: cakeFilling },
              { label: "Cobertura", name: "cober", options: cober }
            ].map(({ label, name, options }) => (
              <div key={name}>
                <label>{label}</label>
                <select
                  className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                >
                  <option value="">Selecciona una opción</option>
                  {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
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
        </div>
        <div className="md:col-span-1 flex items-start">
          <DatePicker />
        </div>
      </div>
      <div className="flex flex-col bg-rose-50 p-6 mb-6 rounded-lg">
        <h2 className={`text-xl m-4 ${sofia.className}`}>
          Elige las opciones de decoración que te gustaría que tenga tu pastel
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cakeDecoreOptions.map((option) => (
            <label key={option} className="ms-2 text-sm font-medium text-text flex items-center">
              <input
                type="checkbox"
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
            className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 mt-2"
            name="others"
            value={formData.others}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="m-6">
  <p className="my-2">Por favor, sube imágenes de inspiración, como la temática, los elementos que te gustaría ver en el pastel, la paleta de colores u otras preferencias.</p>
  <p className="my-2">Esto nos ayudará a crear un diseño personalizado para ti. Puedes subir hasta 5 imágenes de hasta 10MB cada una.</p>
  </div>
  <div className="flex items-center justify-center m-10">
    <label
      htmlFor="dropzone-file"
      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100"
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
        </svg>
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
      </div>
      <input
        id="dropzone-file"
        type="file"
        className="hidden"
        multiple
        accept=".png, .jpg, .jpeg"
        onChange={handleInputChange}
      />
    </label>
  </div>
  <div className="bg-gray-200 rounded-full m-10">
    <div className="bg-primary text-xs font-medium text-text text-center p-0.5 leading-none rounded-full">45%</div>
  </div>
  <div className="flex flex-col md:flex-row m-6">
    <p className="md:w-1/2">¿Podrías informarnos si tienes un presupuesto específico para este pedido? Nos sería de gran ayuda conocer la cantidad que tienes en mente.</p>
    <div className="m-4 md:w-1/2">
      <label htmlFor="budget" className="block mb-2 text-sm font-medium dark:text-white">Presupuesto deseado</label>
      <input
        type="number"
        id="budget"
        name="budget"
        className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
        placeholder="0.0"
        value={formData.budget}
        onChange={handleInputChange}
        required
      />
    </div>
  </div>
  <div className="m-6">
    <h2 className={`text-3xl m-4 ${sofia.className}`}>Información de contacto</h2>
    <div className="flex flex-col bg-rose-50 p-6 mb-6 rounded-lg">
      <div className="flex flex-col md:flex-row mb-6">
        <div className="m-4 md:w-1/2">
          <label htmlFor="userName" className="block mb-2 text-sm font-medium dark:text-white">Nombre</label>
          <input
            type="text"
            id="userName"
            name="userName"
            className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:border-accent"
            placeholder="Juan de Dios"
            value={formData.userName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="m-4 md:w-1/2">
          <label htmlFor="userPhone" className="block mb-2 text-sm font-medium dark:text-white">Número de celular</label>
          <input
            type="text"
            id="userPhone"
            name="userPhone"
            className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:border-accent"
            placeholder="9613202460"
            value={formData.userPhone}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <div className="m-4">
        <label htmlFor="userComments" className="block mb-2 text-sm font-medium dark:text-white">Preguntas o comentarios</label>
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
  </div>
  <div className="flex flex-col md:flex-row items-center justify-end m-4 mb-8 gap-4 ml-4">
    <button
      type="button"
      className="bg-secondary text-white py-2 px-4 rounded hover:bg-accent transition"
      onClick={handleClearFields}
    >
      Limpiar campos
    </button>
    <Link href="/enduser/detallecotizacionpastel">
      <button
        type="submit"
        className="bg-secondary text-white py-2 px-4 rounded hover:bg-accent transition"
      >
        Cotizar Pastel
      </button>
    </Link>
  </div>
    </form>
  );
};

export default CakeForm;
