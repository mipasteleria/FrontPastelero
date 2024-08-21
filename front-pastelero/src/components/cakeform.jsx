<<<<<<< HEAD
=======
import { useState } from "react";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Link from "next/link";
import Calendar from 'react-calendar';

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const isNameValid = (name) => {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  return regex.test(name);
};

const CakeForm = () => {
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
    eventDate: new Date(),
    eventTime: "09:00",
  });
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        images: [...prevData.images, ...Array.from(files)],
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
      eventDate: new Date(),
      eventTime: "09:00",
      userComments: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleDateChange = (date) => {
    const today = new Date();
    const minDate = new Date(today.setDate(today.getDate() + 4)); // Fecha mínima de 4 días a partir de hoy

    if (date >= minDate) {
      setFormData((prevData) => ({
        ...prevData,
        eventDate: date,
      }));
    } else {
      alert("Selecciona una fecha con al menos 4 días de anticipación.");
    }
  };

  return (
  
    <form onSubmit={handleSubmit} className={`${poppins.className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm font-medium dark:text-white">
  {/* Basic request information */}

            <div className="md:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div> {/* Cake flavor */}
                <label>Sabor del Bizcocho</label>
                <select
                  className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
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
              <div> {/* Cake portions */}
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
              <div> {/* Cake levels */}
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
              <div> {/* filling*/}
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
              <div> {/* cober */}
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

              <div> {/* Shipping */}
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
              </div>
            </div>
{/*Schedule*/}
      <div className="md:col-span-1 flex items-start">
      
      <div className="flex flex-col items-center m-6 p-6 bg-white rounded-lg shadow-md">
        <h2 className={`text-xl m-2 ${poppins.className}`}>
          Fecha y Hora del Evento
        </h2>
        <Calendar
          onChange={handleDateChange}
          value={formData.eventDate}
          className="mb-6 custom-calendar"
        />
        </div>   

      </div>

      </div>
      {/*Decorations selection */}
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
                value={formData.decorations}
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
      
    {/*Images*/}
      <div>
        <p className="my-2">
          Por favor, sube imágenes de inspiración, como la temática, los
          elementos que te gustaría ver en el pastel, la paleta de colores u
          otras preferencias.
        </p>
        <p className="my-2">
          Esto nos ayudará a crear un diseño personalizado para ti. Puedes
          subir hasta 5 imágenes de hasta 10MB cada una.
        </p>
        <div className="flex items-center justify-center m-10">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16l-4-4m0 0l4-4m-4 4h18M13 16l4-4m0 0l-4-4m4 4H3"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">
                  Haz clic para subir imágenes
                </span>{" "}
                o arrástralas aquí
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF (máx. 10MB)</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              name="images"
             
              multiple
              accept="image/png, image/jpeg, image/gif"
              onChange={handleInputChange}
            />
          </label>
        </div>
      </div>
    {/*Buget */}
      <div className="flex flex-col md:flex-row m-6">
        <p className="md:w-1/2">
          ¿Podrías informarnos si tienes un presupuesto específico para este pedido? Nos sería de gran ayuda conocer la cantidad que tienes en mente.
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

      {/*Contact information */}
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
              placeholder= "Escribe tu nombre"
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
              placeholder="0123456789"
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
            Preguntas o comentarios, platicanos más acerca de tu idea o tematica, nos especializamos en diseñar dulsuras a la medida
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
        <Link href="/enduser/detallesolicitudpastel">
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
>>>>>>> 0a37e0502cbeb910f34263918a6df6d1736fa6a7
