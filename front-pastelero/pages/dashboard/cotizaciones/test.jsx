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
  const units = ["kg", "g", "lb", "oz", "porciones"];
  
  const [formData, setFormData] = useState({
    noOrden: "",
    FecExp: "",
    NomCli: "",
    envio: "",
    FecEnt: "",
    LugEnt: ""
  });

  const [selectedForm, setSelectedForm] = useState("cake");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const isNameValid = (name) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(name);
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

  const handleFormSelection = (e) => {
    setSelectedForm(e.target.value);
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
              
             
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seleccionar tipo de cotización:</label>
              <div className="flex">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="formType"
                    value="cake"
                    checked={selectedForm === "cake"}
                    onChange={handleFormSelection}
                    className="mr-1"
                  />
                  Pastel
                </label>
                <label className="mr-4">
                  <input
                    type="radio"
                    name="formType"
                    value="cupcake"
                    checked={selectedForm === "cupcake"}
                    onChange={handleFormSelection}
                    className="mr-1"
                  />
                  Cupcake
                </label>
                <label className="mr-4">
                  <input
                    type="radio"
                    name="formType"
                    value="dessertTable"
                    checked={selectedForm === "dessertTable"}
                    onChange={handleFormSelection}
                    className="mr-1"
                  />
                  Mesa de postres
                </label>
              </div>
            </div>

            {selectedForm === "cake" && <CakeForm className="w-3/4 p-4" />}
            {selectedForm === "cupcake" && <CupcakeForm className="w-3/4 p-4" />}
            {selectedForm === "dessertTable" && <DessertTableForm className="w-3/4 p-4" />}
          </form>
        </main>
      </div>
    </div>
  );
}
