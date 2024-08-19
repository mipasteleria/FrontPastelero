import { useState } from "react";
import WebFooter from "@/src/components/WebFooter";
import NavbarAdmin from "@/src/components/navbar";
import CakeForm from "@/src/components/cakeform";
import CupcakeForm from "@/src/components/cupcakeform";
import DessertTableForm from "@/src/components/dessertsform";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { useForm } from "react-hook-form";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function SolicitarCotizacion() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const [selectedForm, setSelectedForm] = useState("cake");

  const handleFormSelection = (e) => {
    setSelectedForm(e.target.value);
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
      <NavbarAdmin />
      <main
        className={`text-text ${poppins.className} mt-24 max-w-screen-lg mx-auto`}
      >
        <h1 className={`text-4xl m-4 ${sofia.className}`}>
          Solicitar cotización
        </h1>
        <p className="m-6">
          Le pedimos que complete cada campo con la mayor cantidad de detalles
          posible para acelerar el proceso de cotización. Recuerda que somos una
          empresa pequeña que realiza pocos pasteles a la semana. Por favor,
          solicita tu cotización con suficiente anticipación. Hacemos todo lo
          posible para responder rápidamente, pero a veces puede haber retrasos.
          Agradecemos tu comprensión.
        </p>

        <form className="m-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label className={`text-2xl m-4 ${sofia.className}`}>
              Selecciona el producto que deseas cotizar:
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
