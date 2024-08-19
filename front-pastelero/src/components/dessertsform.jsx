import { useState } from "react";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Link from "next/link";
import Calendar from 'react-calendar';
import DatePicker from "@/src/components/calendario";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const isNameValid = (name) => {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  return regex.test(name);
};

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
    numberOfPeople: "",
    dessertsPerPerson: "",
    dessertOptions: [],
    others: "",
    envio: "",
    LugEnt: "",
    budget: "",
    images: [],
    eventDate: new Date(),
    eventTime: "09:00",
    userName: "",
    userPhone: "",
    userComments: "",
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

  const handleDessertsChange = (dessert) => {
    setFormData((prevData) => {
      const dessertOptions = prevData.dessertOptions.includes(dessert)
        ? prevData.dessertOptions.filter((item) => item !== dessert)
        : [...prevData.dessertOptions, dessert];
      return {
        ...prevData,
        dessertOptions,
      };
    });
  };

  const handleClearFields = () => {
    setFormData({
      numberOfPeople: "",
      dessertsPerPerson: "",
      dessertOptions: [],
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

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    const [hours, minutes] = selectedTime.split(":").map(Number);
    if ((hours >= 9 && hours < 17) || (hours === 17 && minutes === 0)) {
      setFormData((prevData) => ({
        ...prevData,
        eventTime: selectedTime,
      }));
    } else {
      alert("Selecciona un horario entre 09:00 am y 5:00 pm");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear una instancia de FormData
    const data = new FormData();

    // Agregar campos del formulario a FormData
    for (const key in formData) {
      if (key === "images") {
        formData[key].forEach((file, index) => {
          data.append("images", file);
          console.log(`Imagen ${index + 1}:`, file);
        });
      } else {
        data.append(key, formData[key]);
        console.log(`${key}:`, formData[key]);
      }
    }

    // Verificar el contenido de FormData
    for (let pair of data.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    // Enviar la solicitud usando fetch
    fetch("/api/submit", {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };




  return (
    <form onSubmit={handleSubmit} className={`${poppins.className}`}>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label>Número de Personas</label>
                    <select
                    className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                    name="numberOfPeople"
                    value={formData.numberOfPeople}
                    onChange={handleInputChange}
                    >
                    <option value="">Selecciona el número de personas</option>
                    {[...Array(8)].map((_, i) => (
                        <option key={i} value={30 + i * 10}>
                        {30 + i * 10}
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
                    <option value="">Selecciona el número de postres</option>
                    {[...Array(6)].map((_, i) => (
                        <option key={i} value={3 + i}>
                        {3 + i}
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
            
        
        <div className="md:col-span-1 flex items-end">
          {/*Schedule */}
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
       
        {/* style full screan with margin  */}
        <div className="w-full max-w-xs">
          <label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Selecciona un horario válido:
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 end-0 top-0 flex items-center pr-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="time"
              id="time"
              name="eventTime"
              className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-300 dark:focus:border-red-400"
              min="09:00"
              max="17:00"
              value={formData.eventTime}
              onChange={handleTimeChange}
              required
            />
          </div>
        </div>

        </div>
        </div>
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
                class="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                checked={formData.dessertOptions.includes(dessert)}
                onChange={() => handleDessertsChange(dessert)}
                disabled={formData.dessertOptions.length >= formData.dessertsPerPerson && !formData.dessertOptions.includes(dessert)}
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
      {/*Buget*/}
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
{/*Contact information*/}      
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
 
            

  {/* Botón para limpiar campos */}
  <div className="flex flex-col md:flex-row items-center justify-end m-4 mb-8 gap-4 ml-4">
    <button
      type="button"
      className="bg-secondary text-white py-2 px-4 rounded hover:bg-accent transition"
      onClick={handleClearFields}
    >
      Limpiar campos
    </button>
    <Link href="/enduser/detallesolicitudpostres">
    <button
        type="submit"
        className="bg-secondary text-white py-2 px-4 rounded hover:bg-accent transition"
      >
        Cotizar Mesa de Postres
      </button>
      </Link> 
  </div>

     
    </form>
  );
};

export default DessertTableForm;