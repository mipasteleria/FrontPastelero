import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import DatePicker from "@/src/components/calendario";
import { useForm } from "react-hook-form";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const CakeForm = () => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

  const cakeFlavor = [
    "Bizcocho de Vainilla",
    "Bizcocho de Chocolate",
    "Bizcocho Red Velvet",
    "Bizcocho de Naranja",
    "Bizcocho Dulce de Leche",
  ];

  const cakeFilling = [
    "Buttercream Vainilla",
    "Buttercream Chocolate",
    "Ganache Chocolate semiamargo",
    "Ganache Chocolate Blanco",
    "Mermelada de blueberry y LemonCurd",
    "Queso Crema",
    "Mermelada Frambuesa",
    "Mermelada Maracuya",
  ];

  const cober = [
    "Buttercream Vainilla",
    "Buttercream Chocolate",
    "Ganache Chocolate semiamargo",
    "Ganache Chocolate Blanco",
  ];

  const cakeDecoreOptions = [
    "Cobertura Buttercream(betun con base en mantequilla)",
    "Cobertura Ganache Base de Chocolate",
    "Forrado de Fondant",
    "Dibujo a mano en Fondant",
    "Dibujo en Buttercream",
    "Flores naturales",
    "Letrero",
    "Impresion comestible",
    "Personajes modelados de azúcar",
    "Pastel 3d de un personaje",
  ];

  const selectedDecorations = watch("decorations", []);
  const envioValue = watch("envio");

  const handleDecorationsChange = (decoration) => {
    const updatedDecorations = selectedDecorations.includes(decoration)
      ? selectedDecorations.filter((item) => item !== decoration)
      : [...selectedDecorations, decoration];
    setValue("decorations", updatedDecorations);
  };



  return (
    <form onSubmit={handleSubmit((data) => console.log(data))} className={`${poppins.className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm font-medium dark:text-white">
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Sabor del Bizcocho</label>
              <select
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                {...register("cakeFlavor", { required: "Este campo es obligatorio" })}
              >
                <option value="">Selecciona un sabor</option>
                {cakeFlavor.map((flavor) => (
                  <option key={flavor} value={flavor}>
                    {flavor}
                  </option>
                ))}
              </select>
              {errors.cakeFlavor && <p className="text-red-500">{errors.cakeFlavor.message}</p>}
            </div>

            <div>
              <label>Número de Porciones</label>
              <select
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                {...register("portions", { required: "Este campo es obligatorio" })}
              >
                <option value="">Selecciona el número de porciones</option>
                {[...Array(20)].map((_, i) => (
                  <option key={i} value={(i + 1) * 10}>
                    {(i + 1) * 10}
                  </option>
                ))}
              </select>
              {errors.portions && <p className="text-red-500">{errors.portions.message}</p>}
            </div>

            <div>
              <label>Número de Niveles</label>
              <select
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                {...register("levels", { required: "Este campo es obligatorio" })}
              >
                <option value="">Selecciona el número de niveles</option>
                {[...Array(5)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              {errors.levels && <p className="text-red-500">{errors.levels.message}</p>}
            </div>

            <div>
              <label>Sabor del Relleno</label>
              <select
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                {...register("cakeFilling", { required: "Este campo es obligatorio" })}
              >
                <option value="">Selecciona el sabor del relleno</option>
                {cakeFilling.map((filling) => (
                  <option key={filling} value={filling}>
                    {filling}
                  </option>
                ))}
              </select>
              {errors.cakeFilling && <p className="text-red-500">{errors.cakeFilling.message}</p>}
            </div>

            <div>
              <label>Cobertura</label>
              <select
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                {...register("cober", { required: "Este campo es obligatorio" })}
              >
                <option value="">Selecciona la cobertura</option>
                {cober.map((cover) => (
                  <option key={cover} value={cover}>
                    {cover}
                  </option>
                ))}
              </select>
              {errors.cober && <p className="text-red-500">{errors.cober.message}</p>}
            </div>

            <div>
              <label>Requiere Envío</label>
              <select
                className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                {...register("envio", { required: "Este campo es obligatorio" })}
              >
                <option value="">Selecciona una opción</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
              {errors.envio && <p className="text-red-500">{errors.envio.message}</p>}
            </div>

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
            {...register("otherDeco")}
            placeholder="Indica otro tipo de decoración que te gustaría"
          />
        </div>
      </div>
    </form>
  );
};

export default CakeForm;
