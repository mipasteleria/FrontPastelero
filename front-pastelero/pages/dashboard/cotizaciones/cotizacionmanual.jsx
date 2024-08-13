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

export default function GenerarCotizacionManual() {
  const [selectedForm, setSelectedForm] = useState("cake");
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };


  const handleFormSelection = (e) => {
    setSelectedForm(e.target.value);
  };

  return (
    <div className={`text-text min-h-screen ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex flex-row">
        <Asideadmin className="w-1/4 fixed top-0 left-0 h-full bg-white shadow-md" />
        <main className="w-full ml-1/4 max-w-4xl p-4">
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Capturar Cotizacion Manual</h1>
          <form className="m-4" onSubmit={(e) => e.preventDefault()}>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Seleccionar tipo de cotización:
              </label>
              <div className="flex justify-between">
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
