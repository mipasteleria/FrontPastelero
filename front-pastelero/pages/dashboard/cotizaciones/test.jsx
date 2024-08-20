import { useState } from "react";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Link from "next/link";
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
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear una instancia de FormData
    const data = new FormData();

    // Agregar campos del formulario a FormData
    for (const key in formData) {
      if (key === "images") {
        formData[key].forEach((file) => {
          data.append("images", file);
        });
      } else {
        data.append(key, formData[key]);
      }
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
            <label
              key={dessert}
              className="ms-2 text-sm font-medium text-text flex items-center"
            >
              <input
                type="checkbox"
                name="dessertOptions"
                className="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                checked={formData.dessertOptions.includes(dessert)}
                onChange={() => handleDessertsChange(dessert)}
                disabled={
                  formData.dessertOptions.length >=
                    formData.dessertsPerPerson &&
                  !formData.dessertOptions.includes(dessert)
                }
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Presupuesto</label>
          <input
            type="text"
            id="budget"
            name="budget"
            className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            placeholder="Ingresa tu presupuesto"
            value={formData.budget}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            id="userName"
            name="userName"
            className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            placeholder="Nombre"
            value={formData.userName}
            onChange={handleInputChange}
            required
            disabled={!isNameValid(formData.userName)}
          />
        </div>
        <div>
          <label>Teléfono</label>
          <input
            type="text"
            id="userPhone"
            name="userPhone"
            className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            placeholder="Teléfono"
            value={formData.userPhone}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <div className="mt-4">
        <label>Comentarios Adicionales</label>
        <textarea
          id="userComments"
          name="userComments"
          className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
          placeholder="Añade algún comentario o petición especial"
          value={formData.userComments}
          onChange={handleInputChange}
        ></textarea>
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="bg-primary text-white p-4 rounded-lg w-full"
        >
          Enviar Formulario
        </button>
        <button
          type="button"
          onClick={handleClearFields}
          className="bg-red-600 text-white p-4 rounded-lg w-full mt-4"
        >
          Limpiar Campos
        </button>
      </div>
    </form>
  );
};

export default DessertTableForm;
