import { useState } from "react";
import WebFooter from "@/src/components/WebFooter";
import NavbarAdmin from "@/src/components/navbar";
import CakeForm from "@/src/components/cakeform";
import CupcakeForm from "@/src/components/cupcakeform";
import DessertTableForm from "@/src/components/dessertsform";
import ContactInfo from "@/src/components/contactinfo";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { useForm } from "react-hook-form";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function SolicitarCotizacion() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [selectedForm, setSelectedForm] = useState("cake");

  const handleFormSelection = (e) => setSelectedForm(e.target.value);

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http:localhost:3001/pricecake', {  // Reemplaza '/api/submitForm' con la URL de tu API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Error al enviar los datos');
      }
  
      const result = await response.json();
      console.log('Form submission successful:', result);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };  

  const getButtonText = () => {
    if (selectedForm === "cake") return "Cotizar pastel";
    if (selectedForm === "cupcake") return "Cotizar cupcakes";
    if (selectedForm === "dessertTable") return "Cotizar mesa de postres";
    return "Cotizar"; // 
  };
  
  return (
    <div>
      <NavbarAdmin />
      <main className={`text-text ${poppins.className} mt-24 max-w-screen-lg mx-auto`}>
        <h1 className={`text-4xl m-4 ${sofia.className}`}>Solicitar cotización</h1>
        <p className="m-6">
          Le pedimos que complete cada campo con la mayor cantidad de detalles posible para acelerar el proceso de cotización. Recuerda que somos una empresa pequeña que realiza pocos pasteles a la semana. Por favor, solicita tu cotización con suficiente anticipación. Hacemos todo lo posible para responder rápidamente, pero a veces puede haber retrasos. Agradecemos tu comprensión.
        </p>
        <form className="m-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label className={`text-2xl m-4 ${sofia.className}`}>Selecciona el producto que deseas cotizar:</label>
            <div className="flex justify-between mt-6">
              {["cake", "cupcake", "dessertTable"].map((type) => (
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
            {errors.formType && <p className="text-red-500">{errors.formType.message}</p>}
          </div>

          {selectedForm === "cake" && <CakeForm register={register} errors={errors} watch={watch} />}
          {selectedForm === "cupcake" && <CupcakeForm register={register} errors={errors} watch={watch} />}
          {selectedForm === "dessertTable" && <DessertTableForm register={register} errors={errors} watch={watch} />}

          <ContactInfo register={register} errors={errors} />

          <button
            type="submit"
            className="text-white bg-secondary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-6"
          >
            {getButtonText()}
          </button>
        </form>
      </main>
      <WebFooter />
    </div>
  );
}
