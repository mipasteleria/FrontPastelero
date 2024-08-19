import { useForm } from "react-hook-form";
import { Sofia as SofiaFont } from "next/font/google";

const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const ContactInfo = ({ register, errors }) => (
  <div>
    <div>
      <p className="my-2">Por favor, sube imágenes de inspiración, como la temática, los elementos que te gustaría ver en el pastel, la paleta de colores u otras preferencias.</p>
      <p className="my-2">Esto nos ayudará a crear un diseño personalizado para ti. Puedes subir hasta 5 imágenes de hasta 10MB cada una.</p>
      <div className="flex items-center justify-center m-10">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" multiple accept=".png, .jpg, .jpeg" />
        </label>
      </div>
    </div>
    <div className="flex flex-col md:flex-row m-6">
      <p className="md:w-1/2">¿Podrías informarnos si tienes un presupuesto específico para este pedido? Nos sería de gran ayuda conocer la cantidad que tienes en mente.</p>
      <div className="m-4 md:w-1/2">
        <label htmlFor="budget" className="block mb-2 text-sm font-medium dark:text-white">Presupuesto deseado</label>
        <input type="number" id="budget" name="budget" className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5" placeholder="0.0" {...register("budget", { required: "El presupuesto es obligatorio" })} />
        {errors.budget && <p className="text-red-500">{errors.budget.message}</p>}
      </div>
    </div>
    <div className="m-6">
      <h2 className={`text-3xl m-4 ${sofia.className}`}>Información de contacto</h2>
      <div className="flex flex-col bg-rose-50 p-6 mb-6 rounded-lg">
        <div className="flex flex-col md:flex-row mb-6">
          <div className="m-4 md:w-1/2">
            <label htmlFor="userName" className="block mb-2 text-sm font-medium dark:text-white">Nombre</label>
            <input type="text" id="userName" name="userName" className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:border-accent" placeholder="Juan de Dios" {...register("userName", { required: "El nombre es obligatorio" })} />
            {errors.userName && <p className="text-red-500">{errors.userName.message}</p>}
          </div>
          <div className="m-4 md:w-1/2">
            <label htmlFor="userPhone" className="block mb-2 text-sm font-medium dark:text-white">Número de celular</label>
            <input type="text" id="userPhone" name="userPhone" className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:border-accent" placeholder="9613202460" {...register("userPhone", { required: "El número de celular es obligatorio" })} />
            {errors.userPhone && <p className="text-red-500">{errors.userPhone.message}</p>}
          </div>
        </div>
        <div className="m-4">
          <label htmlFor="userComments" className="block mb-2 text-sm font-medium dark:text-white">Preguntas o comentarios</label>
          <textarea id="userComments" name="userComments" className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:placeholder-secondary dark:focus:border-accent" placeholder="" rows="6" style={{ resize: "none" }} {...register("userComments", { required: "Este campo es obligatorio" })}/>
          {errors.userComments && <p className="text-red-500">{errors.userComments.message}</p>}
        </div>
      </div>
    </div>
  </div>
);

export default ContactInfo;
