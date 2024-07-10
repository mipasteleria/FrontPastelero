import { useState, useEffect } from "react";
import Image from "next/image";
import NavbarDashboard from "@/src/components/navbardashboard";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const options = [
  { id: 1, costo: 1, name: "Cobertura Buttercream(betun con base en mantequilla)",tipo: "gr", cantidad:300 },
  { id: 2, costo: 2, name: "Cobertura Ganache Base de Chocolate",tipo: "gr", cantidad:650 },
  { id: 3, costo: 3, name: "Forrado de Fondant", tipo: "gr", cantidad:150 },
  { id: 4, costo: 4, name: "Dibujo a mano en Fondant",tipo: "unidad", cantidad:1 },
  { id: 5, costo: 5, name: "Dibujo en Buttercream",tipo: "unidad", cantidad:1 },
  { id: 6, costo: 6, name: "Flores naturales",tipo: "unidad", cantidad:1 },
  { id: 7, costo: 7, name: "Letrero",tipo: "unidad", cantidad:1 },
  { id: 8, costo: 8, name: "Pastel 3d de un personaje", tipo: "unidad", cantidad:1 },
];



const elementos = [
  {id:1, costo: 80, name: "Vainilla",  tipo: "porción", cantidad:1},
  {id:2, costo: 159,name: "Buttercream Vainilla",  tipo: "gr", cantidad:300 },
  {id:3, costo: 90, name: "Base de madera",  tipo: "unidad", cantidad:300 }
];
export default function GenerarCotizacion() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState("");
  const [formData, setFormData] = useState({
    dropdownName: "",
    quantity: "",
    unit: "",
    customName: "",
    customQuantity: "",
    customUnit: "",
    customPrice: ""
  });
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Calcular la suma total del costo cada vez que cambian las opciones seleccionadas
    const sum = selectedOptions.reduce((acc, id) => {
      const option = options.find(option => option.id === id);
      return acc + (option ? option.costo : 0);
    }, 0);
    setTotalCost(sum);
  }, [selectedOptions]);

  const handleToggle = (id) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((optionId) => optionId !== id)
        : [...prevSelected, id]
    );
  };

  const handleRadioChange = (value) => {
    setSelectedRadio(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para agregar los datos a la tabla de opciones seleccionadas.
    if (selectedRadio === "option1") {
      // lógica para option1
    } else if (selectedRadio === "option2") {
      // lógica para option2
    }
  };

  return (
    <div className={`text-text min-h-screen ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex flex-row">
        <Asideadmin className="w-1/4" />
        <main className="w-3/4 p-4">
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Ver detalle de Solicitud de cotización</h1>
          <form className="m-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 pr-2">
                <div className="mb-6">
                  <h3 className={`text-xl p-2 ${poppins.className}`}>Diseño Solicitado o Imágenes de inspiración</h3>
                  <Image 
                    className="mx-2"
                    src="/img/logo.JPG"
                    width={164}
                    height={164}
                    alt="imagen"
                  /> 
                 

                </div>
              </div>
              
              <div className="w-full md:w-1/2 pl-2">
                <div className="grid gap-6 mb-6">
                  <div className="flex items-center mb-4">
                    <label htmlFor="noOrden" className="block w-1/4 text-sm font-medium dark:text-white">
                      Número de orden
                    </label>
                    <input
                      type="text"
                      id="noOrden"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="123456"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="FecExp" className="block w-1/4 text-sm font-medium dark:text-white">
                      Fecha de expedición
                    </label>
                    <input
                      type="text"
                      id="FecExp"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="MM/DD/YYYY hh:mm:aa"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="NomCli" className="block w-1/4 text-sm font-medium dark:text-white">
                      En atención a
                    </label>
                    <input
                      type="text"
                      id="NomCli"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="Cliente"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="FecEnt" className="block w-1/4 text-sm font-medium dark:text-white">
                      Fecha y hora de entrega
                    </label>
                    <input
                      type="text"
                      id="FecEnt"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="MM/DD/YYYY hh:mm:aa"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="LugEnt" className="block w-1/4 text-sm font-medium dark:text-white">
                      Lugar de entrega
                    </label>
                    <input
                      type="text"
                      id="LugEnt"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="Calle, número y colonia"
                      required
                    />
                  </div>
                  
                  <h3 className={`text-xl p-2 bg-highlightText rounded-lg flex items-center justify-center ${poppins.className}`}>
                    Detalles del pedido
                  </h3>
                  <div className="flex items-center mb-4">
                    <label htmlFor="quantity" className="w-1/4 text-sm font-medium dark:text-white">
                      Número de porciones
                    </label>
                    <input
                      type="text"
                      id="quantity"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="0.0"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="SabBiz" className="w-1/4 text-sm font-medium dark:text-white">
                      Sabor de bizcocho
                    </label>
                    <input
                      type="text"
                      id="SabBiz"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="Sabor"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="Relleno" className="w-1/4 text-sm font-medium dark:text-white">
                      Relleno
                    </label>
                    <input
                      type="text"
                      id="Relleno"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="Relleno"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="SabCob" className="w-1/4 text-sm font-medium dark:text-white">
                      Sabor cobertura
                    </label>
                    <input
                      type="text"
                      id="SabCob"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="Sabor cobertura"
                      required
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <label htmlFor="Forr" className="w-1/4 text-sm font-medium dark:text-white">
                      Forrado
                    </label>
                    <input
                      type="text"
                      id="Forr"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="Forrado"
                      required
                    />
                  </div>                  

               </div>
               </div>
               </div>
          </form>
          {isClient && (
            <div className="mt-8 bg-highlightText">
              <h2 className={`text-2xl p-4 ${sofia.className}`}>Decoraciones Seleccionadas</h2>
              <div className="flex flex-wrap">
                {options.map((option) => (
                  <div key={option.id} className="w-full md:w-1/2 p-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={selectedOptions.includes(option.id)}
                        onChange={() => handleToggle(option.id)}
                      />
                      <span className="text-sm font-medium">{option.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-8">
            <h2 className={`text-2xl p-4 ${sofia.className}`}>Agregar Opción</h2>
            <div className="flex items-center mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="option1"
                  checked={selectedRadio === "option1"}
                  onChange={() => handleRadioChange("option1")}
                />
                <span className="ml-2">Usar opción existente</span>
              </label>
            </div>
            {selectedRadio === "option1" && (
              <div className="flex flex-wrap mb-4">
                <div className="w-full md:w-1/3 p-2">
                  <select
                    name="dropdownName"
                    value={formData.dropdownName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5"
                  >
                    <option value="">Seleccionar nombre</option>
                    {options.map((name, index) => (
                      <option key={index} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-1/3 p-2">
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Cantidad"
                    className="w-full bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5"
                  />
                </div>
                <div className="w-full md:w-1/3 p-2">
                  <select
                    name="unit"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5"
                  >
                    <option value="">Unidad</option>
                    {elementos.map((tipo, index) => (
                      <option key={index} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <div className="flex items-center mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="option2"
                  checked={selectedRadio === "option2"}
                  onChange={() => handleRadioChange("option2")}
                />
                <span className="ml-2">Agregar nueva opción</span>
              </label>
            </div>
            {selectedRadio === "option2" && (
              <div className="flex flex-wrap mb-4">
                <div className="w-full md:w-1/4 p-2">
                  <input
                    type="text"
                    name="customName"
                    value={formData.customName}
                    onChange={handleInputChange}
                    placeholder="Nombre"
                    className="w-full bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5"
                  />
                </div>
                <div className="w-full md:w-1/4 p-2">
                  <input
                    type="text"
                    name="customQuantity"
                    value={formData.customQuantity}
                    onChange={handleInputChange}
                    placeholder="Cantidad"
                    className="w-full bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5"
                  />
                </div>
                <div className="w-full md:w-1/4 p-2">
                  <select
                    name="customUnit"
                    value={formData.customUnit}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5"
                  >
                    <option value="">Unidad</option>
                    {elementos.map((unit, index) => (
                      <option key={index} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-1/4 p-2">
                  <input
                    type="text"
                    name="customPrice"
                    value={formData.customPrice}
                    onChange={handleInputChange}
                    placeholder="Precio por unidad"
                    className="w-full bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5"
                  />
                </div>
              </div>
            )}
            <button
              type="submit"
              className="text-white bg-accent hover:bg-primary focus:ring-4 focus:outline-none focus:ring-accent-light font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-accent dark:hover:bg-primary dark:focus:ring-accent-light"
            >
              Agregar opción
            </button>
          </div>

          {isClient && (
            <div className="mt-8">
              <h2 className={`text-2xl p-4 ${sofia.className}`}>Opciones seleccionadas</h2>
              <table className="min-w-full bg-white dark:bg-gray-800">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">Nombre</th>
                  <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">Cantidad</th>
                  <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">Unidad</th>
                  <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">Costo</th>
                </tr>
              </thead>
              <tbody>
                {selectedOptions.map((option, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">{option.name}</td>
                    <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">{option.cantidad}</td>
                    <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">{option.tipo}</td>
                    <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">{option.costo}</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700" colSpan="3">
                    <strong>Total</strong>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">{totalCost}</td>
                </tr>
              </tbody>
            </table>
              <div className="flex mt-4  items-start mb-4">
                    <label htmlFor="quantity" className="w-1/4 text-sm font-medium dark:text-white">
                    Agregar texto a la seccion de Extras en la cotizacion del cliente
                    </label>
                    <input
                      type="text"
                      id="quantity"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="agrega la informacion importante que desees compartir"
                      required
                    />
                  </div>
              <div className="mt-4 text-xl font-bold">
                Costo total: {totalCost}
              </div>
              <div className="flex w-full justify-between mt-4">
              <button
              onClick={handleFormSubmit}
              className="bg-primary text-text rounded-lg px-16 py-2 mt-4"
            >
              Limpiar
            </button>
            <button
              onClick={handleFormSubmit}
              className="bg-primary text-text rounded-lg px-16 py-2 mt-4"
            >
              Guardar
            </button>
            <button
              onClick={handleFormSubmit}
              className="bg-primary text-text rounded-lg px-16 py-2 mt-4"
            >
              Guardar y Enviar
            </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

