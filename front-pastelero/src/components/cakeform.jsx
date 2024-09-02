import { useState } from "react";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Link from "next/link";
import DatePicker from "@/src/components/calendario";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const CakeForm = () => {
<<<<<<< HEAD
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const selectedDecorations = watch("decorations", []);
  const envioValue = watch("envio");

  const handleDecorationsChange = (decoration) => {
    setValue("decorations", selectedDecorations.includes(decoration)
      ? selectedDecorations.filter((item) => item !== decoration)
      : [...selectedDecorations, decoration]
    );
  };

  const options = [
    { label: "Sabor del Bizcocho", name: "cakeFlavor", choices: ["Bizcocho de Vainilla", "Bizcocho de Chocolate", "Bizcocho Red Velvet", "Bizcocho de Naranja", "Bizcocho Dulce de Leche"] },
    { label: "Número de Porciones", name: "portions", choices: Array.from({ length: 20 }, (_, i) => (i + 1) * 10) },
    { label: "Número de Niveles", name: "levels", choices: Array.from({ length: 5 }, (_, i) => i + 1) },
    { label: "Sabor del Relleno", name: "cakeFilling", choices: ["Buttercream Vainilla", "Buttercream Chocolate", "Ganache Chocolate semiamargo", "Ganache Chocolate Blanco", "Mermelada de blueberry y LemonCurd", "Queso Crema", "Mermelada Frambuesa", "Mermelada Maracuya"] },
    { label: "Cobertura", name: "cober", choices: ["Buttercream Vainilla", "Buttercream Chocolate", "Ganache Chocolate semiamargo", "Ganache Chocolate Blanco"] },
    { label: "Requiere Envío", name: "envio", choices: ["si", "no"] }
  ];

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))} className={poppins.className}>
=======
  const cakeFlavor = [
    "Bizcocho de Vainilla",
    "Bizcocho de Chocolate",
    "Bizcocho Red Velvet",
    "Bizcocho de Naranja",
    "Bizcocho Dulce de Leche",
  ];

  const cakeFilling = [
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

  const cakeDecoreOptions = [
    "Cobertura Buttercream(betun con base en mantequilla)",
    "Cobertura Ganache Base de Chocolate",
    "Forrado de Fondant",
    "Dibujo a mano en Fondant",
    "Dibujo en Buttercream",
    "Flores naturales",
    "Letrero",
    "Impresion comestible",
    "Personajes modelados de azúcar",
    "Pastel 3d de un personaje",
  ];

  const [formData, setFormData] = useState({
    cakeFlavor: "",
    portions: "",
    levels: "",
    cakeFilling: "",
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
      cakeFlavor: "",
      portions: "",
      levels: "",
      cakeFilling: "",
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
>>>>>>> 451aba3c84373313e5bd350e33b149aa73cbb64c
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm font-medium dark:text-white">
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map(({ label, name, choices }) => (
            <div key={name}>
              <label>{label}</label>
              <select
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
<<<<<<< HEAD
                {...register(name, { required: "Este campo es obligatorio" })}
=======
                name="cakeFlavor"
                value={formData.cakeFlavor}
                onChange={handleInputChange}
              >
                <option value="">Selecciona un sabor</option>
                {cakeFlavor.map((flavor) => (
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
              <label>Número de Niveles</label>
              <select
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                name="levels"
                value={formData.levels}
                onChange={handleInputChange}
              >
                <option value="">Selecciona el número de niveles</option>
                {[...Array(5)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Sabor del Relleno</label>
              <select
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                name="cakeFilling"
                value={formData.cakeFilling}
                onChange={handleInputChange}
              >
                <option value="">Selecciona el sabor del relleno</option>
                {cakeFilling.map((filling) => (
                  <option key={filling} value={filling}>
                    {filling}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Cobertura</label>
              <select
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
>>>>>>> 451aba3c84373313e5bd350e33b149aa73cbb64c
              >
                <option value="">Selecciona una opción</option>
                {choices.map((choice) => (
                  <option key={choice} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
<<<<<<< HEAD
              {errors[name] && <p className="text-red-500">{errors[name]?.message}</p>}
            </div>
          ))}

          <div>
            <label>Lugar de entrega</label>
            <input
              type="text"
              className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
              placeholder="Calle, número y colonia"
              {...register("LugEnt", { required: envioValue !== "no" })}
            />
            {errors.LugEnt && <p className="text-red-500">{errors.LugEnt.message}</p>}
          </div>

          <div className="flex items-center mb-4">
            <label className="ms-2 text-sm font-medium text-text">
              <input
                type="checkbox"
                className="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                {...register("fondant")}
              />
              Forrado de Fondant
            </label>
=======
            </div>
            <div>
              <label>Lugar de entrega</label>
              <input
                type="text"
                id="LugEnt"
                name="LugEnt"
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                placeholder={
                  formData.envio === "no"
                    ? "Se recogerá en sucursal"
                    : "Calle, número y colonia"
                }
                value={formData.LugEnt}
                onChange={handleInputChange}
                disabled={formData.envio === "no"}
                required
              />
            </div>
            <div class="flex items-center mb-4">
              <label class="ms-2 text-sm font-medium text-text">
                <input
                  type="checkbox"
                  name="fondant"
                  checked={formData.fondant}
                  onChange={handleInputChange}
                  class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                />
                Forrado de Fondant
              </label>
            </div>
>>>>>>> 451aba3c84373313e5bd350e33b149aa73cbb64c
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
<<<<<<< HEAD
          {["Cobertura Buttercream(betun con base en mantequilla)", "Cobertura Ganache Base de Chocolate", "Forrado de Fondant", "Dibujo a mano en Fondant", "Dibujo en Buttercream", "Flores naturales", "Letrero", "Impresion comestible", "Personajes modelados de azúcar", "Pastel 3d de un personaje"].map((option) => (
            <label key={option} className="ms-2 text-sm font-medium text-text flex items-center">
=======
          {cakeDecoreOptions.map((option) => (
            <label
              key={option}
              className="ms-2 text-sm font-medium text-text flex items-center"
            >
>>>>>>> 451aba3c84373313e5bd350e33b149aa73cbb64c
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
      <div className="m-6">
        <p className="my-2">
          Por favor, sube imágenes de inspiración, como la temática, los
          elementos que te gustaría ver en el pastel, la paleta de colores u
          otras preferencias.
        </p>
        <p className="my-2">
          Esto nos ayudará a crear un diseño personalizado para ti. Puedes subir
          hasta 5 imágenes de hasta 10MB cada una.
        </p>
      </div>
      <div className="flex items-center justify-center m-10">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
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
        <div className="bg-primary text-xs font-medium text-text text-center p-0.5 leading-none rounded-full">
          {" "}
          45%
        </div>
      </div>

      <div className="flex flex-col md:flex-row m-6">
        <p className="md:w-1/2">
          ¿Podrías informarnos si tienes un presupuesto específico para este
          pedido? Nos sería de gran ayuda conocer la cantidad que tienes en
          mente.
        </p>
        <div className="m-4 md:w-1/2">
          <label
            htmlFor="budget"
            className="block mb-2 text-sm font-medium dark:text-white"
          >
            Presupuesto deseado
          </label>
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
        <h2 className={`text-3xl m-4 ${sofia.className}`}>
          Información de contacto
        </h2>
        <div className="flex flex-col bg-rose-50 p-6 mb-6 rounded-lg">
          <div className="flex flex-col md:flex-row mb-6">
            <div className="m-4 md:w-1/2">
              <label
                htmlFor="userName"
                className="block mb-2 text-sm font-medium dark:text-white"
              >
                Nombre
              </label>
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
              <label
                htmlFor="userPhone"
                className="block mb-2 text-sm font-medium dark:text-white"
              >
                Número de celular
              </label>
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
        <button
          type="submit"
          className="bg-secondary text-white py-2 px-4 rounded hover:bg-accent transition"
        >
          Cotizar Pastel
        </button>
      </div>
    </form>
  );
};

export default CakeForm;
