import WebFooter from "@/src/components/WebFooter";
import NavbarAdmin from "@/src/components/navbar";
import CakeForm from "@/src/components/cotizacion/cakeprice";
import CupcakeForm from "@/src/components/cotizacion/cupcakeprice";
import DessertTableForm from "@/src/components/cotizacion/snackprice";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function SolicitarCotizacion() {


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const onSubmit = (data) => {
    console.log("Form Data: ", data);

    if (!data) {
      setError("formType", {
        type: "manual",
        message: "Por favor, selecciona un producto.",
      });
    }
  };

  const getButtonText = () => {
    switch (selectedForm) {
      case "cake":
        return "Cotizar pastel";
      case "cupcake":
        return "Cotizar cupcakes";
      case "dessertTable":
        return "Cotizar mesa de postres";
      default:
        return "Enviar";
    }
  };

  return (
    <div>
    <main 
    className={`text-text ${poppins.className} mt-32 max-w-screen-lg mx-auto`}>
      <NavbarAdmin />
      <h1 
      className={`text-4xl m-6 ${sofia.className}`}>Solicitar cotización</h1>
        <p 
        className="m-6">
          Le pedimos que complete cada campo con la mayor cantidad de detalles
          posible para acelerar el proceso de cotización. Recuerda que somos es
          una empresa pequeña que realiza pocos pasteles a la semana. Por favor,
          solicita tu cotización con suficiente anticipación. Hacemos todo lo
          posible para responder rápidamente, pero a veces puede haber retrasos.
          Agradecemos tu comprensión.
        </p>

        <form 
        className="m-4" 
        onSubmit={(e) => e.preventDefault()}>
          <div 
          className="mb-6">
            <label 
            className={`text-2xl m-4 ${sofia.className}`}>
              Selecciona el producto que deseas cotizar:
            </label>
            <div 
            className="flex justify-between m-4 w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent">
              {["cake", "cupcake", "dessertTable"].map(type => (
                <label key={type} 
                className="mr-4">
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
            {errors.formType && (
              <p className="text-red-500">{errors.formType.message}</p>
            )}
          </div>

          {selectedForm === "cake" && (
            <CakeForm register={register} errors={errors} />
          )}
          {selectedForm === "cupcake" && (
            <CupcakeForm register={register} errors={errors} />
          )}
          {selectedForm === "dessertTable" && (
            <DessertTableForm register={register} errors={errors} />
          )}
        </form>
      </main>
      <WebFooter />
    </div>
  );
}
