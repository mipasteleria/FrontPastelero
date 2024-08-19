import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import DatePicker from "@/src/components/calendario";
const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const CakeForm = ({ register, errors, watch, setValue }) => {
  const cakeFlavor = ["Bizcocho de Vainilla", "Bizcocho de Chocolate", "Bizcocho Red Velvet", "Bizcocho de Naranja", "Bizcocho Dulce de Leche"];
  const cakeFilling = ["Buttercream Vainilla", "Buttercream Chocolate", "Ganache Chocolate semiamargo", "Ganache Chocolate Blanco", "Mermelada de blueberry y LemonCurd", "Queso Crema", "Mermelada Frambuesa", "Mermelada Maracuya"];
  const cober = ["Buttercream Vainilla", "Buttercream Chocolate", "Ganache Chocolate semiamargo", "Ganache Chocolate Blanco"];
  const cakeDecoreOptions = ["Cobertura Buttercream(betun con base en mantequilla)", "Cobertura Ganache Base de Chocolate", "Forrado de Fondant", "Dibujo a mano en Fondant", "Dibujo en Buttercream", "Flores naturales", "Letrero", "Impresion comestible", "Personajes modelados de azúcar", "Pastel 3d de un personaje"];
  const selectedDecorations = watch("decorations", []); 
  const envioValue = watch("envio");

  const handleDecorationsChange = (decoration) => {
    const updatedDecorations = selectedDecorations.includes(decoration)
      ? selectedDecorations.filter((item) => item !== decoration)
      : [...selectedDecorations, decoration];
    setValue("decorations", updatedDecorations);
  };

  return (
    <form className={`${poppins.className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm font-medium dark:text-white">
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Sabor del Bizcocho", name: "flavor", options: cakeFlavor },
              { label: "Número de Porciones", name: "portions", options: [...Array(20)].map((_, i) => (i + 1) * 10) },
              { label: "Número de Niveles", name: "levels", options: [...Array(5)].map((_, i) => i + 1) },
              { label: "Sabor del Relleno", name: "stuffedFlavor", options: cakeFilling },
              { label: "Cobertura", name: "cober", options: cober },
              { label: "Requiere Envío", name: "envio", options: ["si", "no"] },
            ].map(({ label, name, options }) => (
              <div key={name}>
                <label>{label}</label>
                <select
                  className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  {...register(name, { required: "Este campo es obligatorio" })}
                >
                  <option value="">{`Selecciona ${label.toLowerCase()}`}</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors[name] && <p className="text-red-500">{errors[name].message}</p>}
              </div>
            ))}
            <div>
              <label>Lugar de entrega</label>
              <input
                type="text"
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                placeholder="Calle, número y colonia"
                {...register("deliveryAddress", { required: envioValue !== "no" })}
              />
              {errors.deliveryAddress && <p className="text-red-500">{errors.deliveryAddress.message}</p>}
            </div>
          </div>
        </div>
        <div className="md:col-span-1 flex items-start">
          <DatePicker {...register("deliveryDate")} />
        </div>
      </div>
      <div className="flex flex-col bg-rose-50 p-6 mb-6 rounded-lg">
        <h2 className={`text-xl m-4 ${sofia.className}`}>Elige las opciones de decoración que te gustaría que tenga tu pastel</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cakeDecoreOptions.map((option) => (
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
            {...register("other")}
            placeholder="Indica otro tipo de decoración que te gustaría"
          />
        </div>
      </div>
    </form>
  );
};

export default CakeForm;
