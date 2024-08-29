import { useState, useEffect } from "react";
import Image from "next/image";
import NavbarAdmin from "@/src/components/navbar";
import VerCotizacion from "@/src/components/cotizacionview";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import { useRouter } from "next/router";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function GenerarCotizacion() {
  const router = useRouter(); // Inicializa useRouter
  const { id, source } = router.query; // Obtén los parámetros de consulta
  const units = ["kg", "g", "lb", "oz", "porciones"];
  const [recetas, setRecetas] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [trabajoManual] = useState([
    {
      Elemento: "Un piso",
      Unidad: "Porcion",
      PrecioUnidad: 50
    }
  ]);

  const [formData, setFormData] = useState({
    noOrden: "",
    FecExp: "",
    Total: 0,
    Anticipo: 0,
    Extras: ""
  });

  const [selectedType, setSelectedType] = useState("precargado");
  const [customElement, setCustomElement] = useState({
    Elemento: "",
    Cantidad: 0,
    Unidad: "",
    PrecioUnidad: 0
  });
  const [selectedElement, setSelectedElement] = useState(null);
  const [addedElements, setAddedElements] = useState([]);

  useEffect(() => {
    // Fetch recetas
    fetch('http://localhost:3001/recetas/recetas', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        const recetasData = data.data.map(item => ({
          Elemento: item.nombre_receta,
          Unidad: "Porcion", // Ajusta según la unidad de medida en tus datos
          PrecioUnidad: item.total_cost
        }));
        setRecetas(recetasData);
      })
      .catch(error => console.error('Error fetching recetas:', error));
  
    // Fetch insumos
    fetch('http://localhost:3001/insumos', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        const insumosData = data.map(item => ({
          Elemento: item.name,
          Unidad: "gr", // Ajusta según la unidad de medida en tus datos
          PrecioUnidad: item.cost
        }));
        setInsumos(insumosData);
      })
      .catch(error => console.error('Error fetching insumos:', error));
  }, []);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleElementChange = (e) => {
    const { name, value } = e.target;
    setCustomElement((prevElement) => ({
      ...prevElement,
      [name]: value
    }));
  };

  const handleSelectElement = (e) => {
    const selected = e.target.value;
    const allElements = [...recetas, ...trabajoManual, ...insumos];
    const element = allElements.find((el) => el.Elemento === selected);
    setSelectedElement(element);
  };

  const handleAddElement = () => {
    const element = selectedType === "precargado" ? selectedElement : customElement;
    setAddedElements((prevElements) => [...prevElements, element]);
    setFormData((prevFormData) => ({
      ...prevFormData,
      Total: prevFormData.Total + element.PrecioUnidad * element.Cantidad,
      Anticipo: (prevFormData.Total + element.PrecioUnidad * element.Cantidad) / 2
    }));
  };

  const handleDeleteElement = (index) => {
    const element = addedElements[index];
    const newTotal = formData.Total - element.PrecioUnidad * element.Cantidad;
    const newElements = addedElements.filter((_, i) => i !== index);
    setAddedElements(newElements);
    setFormData((prevFormData) => ({
      ...prevFormData,
      Total: newTotal,
      Anticipo: newTotal / 2
    }));
  };

  useEffect(() => {
    const today = new Date();
    const date = today.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      FecExp: date
    }));
  }, []);

  const handleFormSelection = (e) => {
    setSelectedForm(e.target.value);
  };

  const handleTypeSelection = (e) => {
    setSelectedType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    let url;
    switch (source) {
      case 'pastel':
        url = `http://localhost:3001/pricecake/${id}`;
        break;
      case 'cupcake':
        url = `http://localhost:3001/pricecupcake/${id}`;
        break;
      case 'snack':
        url = `http://localhost:3001/pricesnack/${id}`;
        break;
      default:
        console.error("Invalid source");
        return;
    }
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          precio: formData.Total,
          anticipo: formData.Anticipo,
          status: true
        }),
      });
      console.log({precio: formData.Total,
        anticipo: formData.Anticipo,
        status: aprobado})
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      // Redirigir a /dashboard/cotizaciones
      router.push("/dashboard/cotizaciones");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  

  return (
    <div className={`text-text min-h-screen ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin className="w-1/4" />
        <main className="w-full md:w-3/4 p-4">
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Generar Cotizacion</h1>
          <form className="m-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 pr-2">
                <div className="grid gap-6 mb-6">
                  <div className="flex items-center mb-4">
                    <label htmlFor="noOrden" className="block w-1/4 text-sm font-medium dark:text-white">
                      Número de orden
                    </label>
                    <input
                      type="text"
                      id="noOrden"
                      name="noOrden"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="123456"
                      value={formData.noOrden}
                      onChange={handleInputChange}
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
                      name="FecExp"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="MM/DD/YYYY hh:mm:aa"
                      value={formData.FecExp}
                      onChange={handleInputChange}
                      required
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

          <VerCotizacion />

          <div className="mt-8">
            <div className="my-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Seleccionar tipo de elemento:
              </label>
              <div className="flex">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="elementType"
                    value="precargado"
                    checked={selectedType === "precargado"}
                    onChange={handleTypeSelection}
                    className="mr-1"
                  />
                  Elemento precargado
                </label>
                <label className="mr-4">
                  <input
                    type="radio"
                    name="elementType"
                    value="personalizado"
                    checked={selectedType === "personalizado"}
                    onChange={handleTypeSelection}
                    className="mr-1"
                  />
                  Elemento personalizado
                </label>
              </div>
            </div>

            {selectedType === "precargado" && (
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Seleccionar elemento:
                </label>
                <select
                  className="w-full bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                  onChange={handleSelectElement}
                >
                  <option value="">Selecciona un elemento</option>
                  {[...recetas, ...trabajoManual, ...insumos].map((el, idx) => (
                    <option key={idx} value={el.Elemento || "Elemento no definido"}>
                    {el.Elemento || "Elemento sin nombre"}
                  </option>                  
                  ))}
                </select>
                {selectedElement && (
                  <div className="mt-4">
                    <p>Unidad: {selectedElement.Unidad}</p>
                    <p>Precio por unidad: {selectedElement.PrecioUnidad}</p>
                    <input
                      type="number"
                      name="Cantidad"
                      placeholder="Cantidad"
                      onChange={(e) =>
                        setSelectedElement((prevElement) => ({
                          ...prevElement,
                          Cantidad: e.target.value
                        }))
                      }
                      className="w-full bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 mt-2 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                    />
                  </div>
                )}
              </div>
            )}

            {selectedType === "personalizado" && (
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Elemento personalizado:
                </label>
                <input
                  type="text"
                  name="Elemento"
                  placeholder="Nombre del elemento"
                  onChange={handleElementChange}
                  className="w-full bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 mb-2 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                />
                <input
                  type="number"
                  name="Cantidad"
                  placeholder="Cantidad"
                  onChange={handleElementChange}
                  className="w-full bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 mb-2 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                />
                <select
                  name="Unidad"
                  onChange={handleElementChange}
                  className="w-full bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 mb-2 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                >
                  <option value="">Selecciona la unidad</option>
                  {units.map((unit, idx) => (
                    <option key={idx} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="PrecioUnidad"
                  placeholder="Precio por unidad"
                  onChange={handleElementChange}
                  className="w-full bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 mb-2 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                />
              </div>
              
            )}

            <button
              type="button"
              onClick={handleAddElement}
              className="bg-accent text-white px-4 py-2 rounded-lg"
            >
              Agregar
            </button>

            <div className="overflow-x-auto mt-6">
              <h2 className="text-2xl">Elementos agregados</h2>
              <table className="w-full my-8 bg-white rounded-lg shadow-md">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Elemento</th>
                    <th className="py-2 px-4 border-b">Cantidad</th>
                    <th className="py-2 px-4 border-b">Unidad</th>
                    <th className="py-2 px-4 border-b">Precio por unidad</th>
                    <th className="py-2 px-4 border-b">Total</th>
                    <th className="py-2 px-4 border-b">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {addedElements.map((el, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-4 border-b">{el.Elemento}</td>
                      <td className="py-2 px-4 border-b">{el.Cantidad}</td>
                      <td className="py-2 px-4 border-b">{el.Unidad}</td>
                      <td className="py-2 px-4 border-b">{el.PrecioUnidad}</td>
                      <td className="py-2 px-4 border-b">{el.PrecioUnidad * el.Cantidad}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          type="button"
                          onClick={() => handleDeleteElement(idx)}
                          className="bg-red-500 text-white px-2 py-1 rounded-lg mr-2"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex mt-4  items-start mb-4">
                      <label htmlFor="Extras" className="w-1/4 text-sm font-medium dark:text-white">
                      Agregar texto a la seccion de Extras en la cotizacion del cliente
                      </label>
                      <input
                        type="Extras"
                        id="Extras"
                        className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                        placeholder="agrega la informacion importante que desees compartir"
                        required
                      />
                    </div>
              <div className="mt-4">
                <p>Total: {formData.Total}</p>
                <p>Anticipo (50%): {formData.Anticipo}</p>
              </div>
            </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between mt-4">
                <button
                onClick={handleAddElement}
                className="bg-primary text-text rounded-lg px-16 py-2 mt-4"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-primary text-text rounded-lg px-16 py-2 mt-4"
              >
                Guardar y Enviar
              </button>
                </div>
          </form>
        </main>
      </div>
    </div>
  );
}
