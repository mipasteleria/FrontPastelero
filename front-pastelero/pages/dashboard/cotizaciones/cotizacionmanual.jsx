import { useState, useEffect } from "react";
import Image from "next/image";
import NavbarDashboard from "@/src/components/navbardashboard";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const options = [
  { id: 1, costo: 1, name: "Cobertura Buttercream(betun con base en mantequilla)" },
  { id: 2, costo: 2, name: "Cobertura Ganache Base de Chocolate" },
  { id: 3, costo: 3, name: "Forrado de Fondant" },
  { id: 4, costo: 4, name: "Dibujo a mano en Fondant" },
  { id: 5, costo: 5, name: "Dibujo en Buttercream" },
  { id: 6, costo: 6, name: "Flores naturales" },
  { id: 7, costo: 7, name: "Letrero" },
  { id: 8, costo: 8, name: "Pastel 3d de un personaje" },
];

const units = ["kg", "g", "lb", "oz"];
const names = ["Bizcocho de Vainilla", "Buttercream Vainilla", "Base de madera"];


export default function GenerarCotizacion() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [selectedService, setSelectedService] = useState("pastel");
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const sum = selectedOptions.reduce((acc, id) => {
      const option = options.find(option => option.id === id);
      return acc + (option ? option.costo : 0);
    }, 0);
    setTotalCost(sum);
  }, [selectedOptions]);


  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmitAdd = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para agregar los datos a la tabla de opciones seleccionadas.
  };
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
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Cotizacion Manual</h1>
          <form className="m-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 pr-2">
                <div className="mb-6">
                  <h3 className={`text-xl p-2 ${poppins.className}`}>Diseño Solicitado o Imágenes de inspiración</h3>
                  <div class="flex items-center justify-center w-full">
                      <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                          <div class="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                              </svg>
                              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                              <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                          </div>
                          <input id="dropzone-file" type="file" class="hidden" />
                      </label>
                  </div> 
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
                    <label className="block w-1/4 text-sm font-medium dark:text-white">
                      Servicio a solicitar
                    </label>
                    <div className="w-3/4 flex">
                      <label className="mr-4">
                        <input
                          type="radio"
                          name="service"
                          value="pastel"
                          checked={selectedService === "pastel"}
                          onChange={handleServiceChange}
                        /> Pastel
                      </label>
                      <label className="mr-4">
                        <input
                          type="radio"
                          name="service"
                          value="mesa"
                          checked={selectedService === "mesa"}
                          onChange={handleServiceChange}
                        /> Mesa de Postres
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="service"
                          value="cupcakes"
                          checked={selectedService === "cupcakes"}
                          onChange={handleServiceChange}
                        /> Cupcakes
                      </label>
                    </div>
                  </div>
                  
                  {selectedService === "pastel" && (
                    <>
                      <div className="flex items-center mb-4">
                        <label htmlFor="pastelPorciones" className="block w-1/4 text-sm font-medium dark:text-white">
                          Número de porciones
                        </label>
                        <select
                          id="pastelPorciones"
                          className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5"
                          name="dropdownName"
                          value={formData.dropdownName}
                          onChange={handleInputChange}
                        >
                          <option value="">Selecciona una opción</option>
                          {names.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center mb-4">
                        <label htmlFor="quantity" className="block w-1/4 text-sm font-medium dark:text-white">
                          Cantidad
                        </label>
                        <input
                          type="text"
                          id="quantity"
                          className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="flex items-center mb-4">
                        <label htmlFor="unit" className="block w-1/4 text-sm font-medium dark:text-white">
                          Unidad
                        </label>
                        <select
                          id="unit"
                          className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5"
                          name="unit"
                          value={formData.unit}
                          onChange={handleInputChange}
                        >
                          <option value="">Selecciona una opción</option>
                          {units.map((unit) => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {selectedService === "mesa" && (
                    <>
                      <div className="flex items-center mb-4">
                        <label htmlFor="mesaPorciones" className="block w-1/4 text-sm font-medium dark:text-white">
                          Tipo de mesa
                        </label>
                        <select
                          id="mesaPorciones"
                          className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5"
                          name="mesaType"
                          value={formData.mesaType}
                          onChange={handleInputChange}
                        >
                          <option value="">Selecciona una opción</option>
                          {["Mesa Sencilla", "Mesa Elegante", "Mesa Temática"].map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center mb-4">
                        <label htmlFor="mesaCantidad" className="block w-1/4 text-sm font-medium dark:text-white">
                          Cantidad de postres
                        </label>
                        <input
                          type="text"
                          id="mesaCantidad"
                          className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5"
                          name="mesaCantidad"
                          value={formData.mesaCantidad}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}

                  {selectedService === "cupcakes" && (
                    <>
                      <div className="flex items-center mb-4">
                        <label htmlFor="cupcakePorciones" className="block w-1/4 text-sm font-medium dark:text-white">
                          Tipo de cupcakes
                        </label>
                        <select
                          id="cupcakePorciones"
                          className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5"
                          name="cupcakeType"
                          value={formData.cupcakeType}
                          onChange={handleInputChange}
                        >
                          <option value="">Selecciona una opción</option>
                          {["Cupcakes Sencillos", "Cupcakes Decorados", "Cupcakes Gourmet"].map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center mb-4">
                        <label htmlFor="cupcakeCantidad" className="block w-1/4 text-sm font-medium dark:text-white">
                          Cantidad de cupcakes
                        </label>
                        <input
                          type="text"
                          id="cupcakeCantidad"
                          className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5"
                          name="cupcakeCantidad"
                          value={formData.cupcakeCantidad}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}
                  
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
                    {names.map((name, index) => (
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
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5"
                  >
                    <option value="">Unidad</option>
                    {units.map((unit, index) => (
                      <option key={index} value={unit}>{unit}</option>
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
                    {units.map((unit, index) => (
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
              onClick={handleFormSubmitAdd}
              className="bg-primary text-text rounded-lg px-4 py-2 mt-4"
            >
              Agregar
            </button>
          </div>

          {isClient && (
            <div className="mt-8">
              <h2 className={`text-2xl p-4 ${sofia.className}`}>Opciones seleccionadas</h2>
              <table className="min-w-full bg-highlightText">
                <thead>
                  <tr>
                    <th className="py-2">Costo</th>
                    <th className="py-2">Nombre</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOptions.map((id) => {
                    const option = options.find((option) => option.id === id);
                    return (
                      <tr key={id}>
                        
                        <td className="py-2 px-4 border">{option.name}</td>
                        <td className="py-2 px-4 border">{option.costo}</td>
                        <td className="py-2 px-4 border">{option.cantidad}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex  items-start mb-4">
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
