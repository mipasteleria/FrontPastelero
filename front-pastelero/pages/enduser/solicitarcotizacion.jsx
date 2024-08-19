import { useState } from "react";
import WebFooter from "@/src/components/WebFooter";
import NavbarAdmin from "@/src/components/navbar";
import CakeForm from "@/src/components/cakeform";
import CupcakeForm from "@/src/components/cupcakeform";
import DessertTableForm from "@/src/components/dessertsform";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function SolicitarCotizacion() {
  const [selectedForm, setSelectedForm] = useState("cake");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleFormSelection = (e) => setSelectedForm(e.target.value);

  return (
    <div>
      <NavbarAdmin />
      <main className={`text-text ${poppins.className} mt-24 max-w-screen-lg mx-auto`}>
        <h1 className={`text-4xl m-4 ${sofia.className}`}>Solicitar cotización</h1>
        <p className="m-6">
          Le pedimos que complete cada campo con la mayor cantidad de detalles
          posible para acelerar el proceso de cotización. Recuerda que somos es
          una empresa pequeña que realiza pocos pasteles a la semana. Por favor,
          solicita tu cotización con suficiente anticipación. Hacemos todo lo
          posible para responder rápidamente, pero a veces puede haber retrasos.
          Agradecemos tu comprensión.
        </p>

        <form className="m-4" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-6">
            <label className={`text-2xl m-4 ${sofia.className}`}>
              Selecciona el producto que deseas cotizar:
            </label>
            <div className="flex justify-between">
              {["cake", "cupcake", "dessertTable"].map(type => (
                <label key={type} className="mr-4">
                  <input
                    type="radio"
                    name="formType"
                    value={type}
                    checked={selectedForm === type}
                    onChange={handleFormSelection}
                    className="mr-1"
                  />
                  {type === "cake" ? "Pastel" : type === "cupcake" ? "Cupcake" : "Mesa de postres"}
                </label>
              ))}
            </div>
          </div>

          {selectedForm === "cake" && <CakeForm className="w-3/4 p-4" />}
          {selectedForm === "cupcake" && <CupcakeForm className="w-3/4 p-4" />}
          {selectedForm === "dessertTable" && <DessertTableForm className="w-3/4 p-4" />}
        </form>
      </main>
      <WebFooter />
    </div>
  );
}
