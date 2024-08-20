import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import DatePicker from "@/src/components/calendario";
import { useForm } from "react-hook-form";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const CakeForm = () => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const selectedDecorations = watch("decorations", []);
  const envioValue = watch("envio");

  const handleDecorationsChange = (decoration) => {
    setValue("decorations", selectedDecorations.includes(decoration)
      ? selectedDecorations.filter((item) => item !== decoration)
      : [...selectedDecorations, decoration]
    );
  };

  const options = [
    { label: "Sabor del Bizcocho", name: "cakeFlavor", choices: ["Bizcocho de Vainilla", "Bizcocho de Chocolate", "Bizcocho Red Velvet", "Bizcocho de Naranja", "Bizcocho Dulce de Leche"] },
    { label: "Número de Porciones", name: "portions", choices: Array.from({ length: 20 }, (_, i) => (i + 1) * 10) },
    { label: "Número de Niveles", name: "levels", choices: Array.from({ length: 5 }, (_, i) => i + 1) },
    { label: "Sabor del Relleno", name: "cakeFilling", choices: ["Buttercream Vainilla", "Buttercream Chocolate", "Ganache Chocolate semiamargo", "Ganache Chocolate Blanco", "Mermelada de blueberry y LemonCurd", "Queso Crema", "Mermelada Frambuesa", "Mermelada Maracuya"] },
    { label: "Cobertura", name: "cober", choices: ["Buttercream Vainilla", "Buttercream Chocolate", "Ganache Chocolate semiamargo", "Ganache Chocolate Blanco"] },
    { label: "Requiere Envío", name: "envio", choices: ["si", "no"] }
  ];

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))} className={poppins.className}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm font-medium dark:text-white">
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map(({ label, name, choices }) => (
            <div key={name}>
              <label>{label}</label>
              <select
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                {...register(name, { required: "Este campo es obligatorio" })}
              >
                <option value="">Selecciona una opción</option>
                {choices.map((choice) => (
                  <option key={choice} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
              {errors[name] && <p className="text-red-500">{errors[name]?.message}</p>}
            </div>
          ))}

          <div>
            <label>Lugar de entrega</label>
            <input
              type="text"
              className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
              placeholder="Calle, número y colonia"
              {...register("LugEnt", { required: envioValue !== "no" })}
            />
            {errors.LugEnt && <p className="text-red-500">{errors.LugEnt.message}</p>}
          </div>

          <div className="flex items-center mb-4">
            <label className="ms-2 text-sm font-medium text-text">
              <input
                type="checkbox"
                className="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                {...register("fondant")}
              />
              Forrado de Fondant
            </label>
          </div>
        </div>

        <div className="md:col-span-1 flex items-start">
          <DatePicker />
        </div>
      </div>

      <div className="flex flex-col bg-rose-50 p-6 mb-6 rounded-lg">
        <h2 className={`text-xl m-4 ${sofia.className}`}>
          Elige las opciones de decoración que te gustaría que tenga tu pastel
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["Cobertura Buttercream(betun con base en mantequilla)", "Cobertura Ganache Base de Chocolate", "Forrado de Fondant", "Dibujo a mano en Fondant", "Dibujo en Buttercream", "Flores naturales", "Letrero", "Impresion comestible", "Personajes modelados de azúcar", "Pastel 3d de un personaje"].map((option) => (
            <label key={option} className="ms-2 text-sm font-medium text-text flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2 focus:border-accent"
                checked={selectedDecorations.includes(option)}
                onChange={() => handleDecorationsChange(option)}
              />
              <span className="ml-2">{option}</span>
            </label>
          ))}
        </div>
        <div>
          <label>Otros</label>
          <input
            type="text"
            className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 mt-2"
            {...register("otherDeco")}
            placeholder="Indica otro tipo de decoración que te gustaría"
          />
        </div>
      </div>
    </form>
  );
};

export default CakeForm;
