import { useState, useEffect } from "react";
import Image from "next/image";
import NavbarDashboard from "@/src/components/navbardashboard";
import CakeForm from "@/src/components/cakeform";
import CupcakeForm from "@/src/components/cupcakeform";
import DessertTableForm from "@/src/components/dessertsform";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function GenerarCotizacion() {
    const units = ["kg", "g", "lb", "oz","porciones"];
    
  // Define el estado del formulario
  const [formData, setFormData] = useState({
    noOrden: "",
    FecExp: "",
    NomCli: "",
    envio: "",
    FecEnt: "",
    LugEnt: ""
  });

  // Maneja los cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  // Verifica que el nombre del cliente sea válido
  const isNameValid = (name) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(name);
  };

  useEffect(() => {
    // Configura FecExp a la fecha actual
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

  useEffect(() => {
    if (formData.envio === "no") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        LugEnt: "Se recogerá en sucursal"
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        LugEnt: ""
      }));
    }
  }, [formData.envio]);

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
                  <div className="flex items-center justify-center w-full">
                      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                          </div>
                          <input id="dropzone-file" type="file" className="hidden" />
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
                  <div className="flex items-center mb-4">
                    <label htmlFor="NomCli" className="block w-1/4 text-sm font-medium dark:text-white">
                      En atención a
                    </label>
                    <input
                      type="text"
                      id="NomCli"
                      name="NomCli"
                      className={`w-3/4 bg-gray-50 border ${isNameValid(formData.NomCli) ? "border-secondary" : "border-red-500"} text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent`}
                      placeholder="Cliente"
                      value={formData.NomCli}
                      onChange={handleInputChange}
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
                      name="FecEnt"
                      className="w-3/4 bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent p-2.5 dark:placeholder-secondary dark:focus:ring-blue-500 dark:focus:border-accent"
                      placeholder="MM/DD/YYYY hh:mm:aa"
                      value={formData.FecEnt}
                      onChange={handleInputChange}
                      required
                    />
                  </div>              
                </div>
              </div>
            </div>
            <CakeForm className="w-3/4 p-4"></CakeForm>
            <CupcakeForm className="w-3/4 p-4"></CupcakeForm>
            <DessertTableForm className="w-3/4 p-4"></DessertTableForm>
          </form>
        </main>
      </div>
    </div>
  );
}
