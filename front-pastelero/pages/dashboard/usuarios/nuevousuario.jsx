import Link from "next/link";
import NavbarDashboard from "@/src/components/navbardashboard";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { useForm } from "react-hook-form";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Conocenuestrosproductos() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data); // Handle form submission
    // You can make an API request here if needed
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex flex-row">
        <Asideadmin />
        <main className="flex-grow w-3/4 max-w-screen-lg mx-auto mb-16">
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Nuevo usuario</h1>
          <div className="flex flex-col md:flex-row justify-around">
            <div className="flex flex-col">
              <h2 className={`text-2xl p-4 ${sofia.className}`}>Nuevo cliente</h2>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-4 m-4 rounded-xl shadow-xl"
              >
                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email", { required: "El correo electrónico es obligatorio" })}
                    className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                    placeholder="nombre@dominio.com"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-2">{errors.email.message}</p>
                  )}
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    {...register("password", { required: "La contraseña es obligatoria" })}
                    className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                    placeholder=" "
                  />
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-2">{errors.password.message}</p>
                  )}
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="repeat_password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    id="repeat_password"
                    {...register("repeat_password", { required: "Confirmar la contraseña es obligatorio" })}
                    className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                    placeholder=" "
                  />
                  {errors.repeat_password && (
                    <p className="text-red-600 text-sm mt-2">{errors.repeat_password.message}</p>
                  )}
                </div>
                <div className="grid md:grid-cols-2 md:gap-6 mb-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register("name", { required: "El nombre es obligatorio" })}
                      className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                      placeholder=" "
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-2">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastname"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Apellido
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      {...register("lastname", { required: "El apellido es obligatorio" })}
                      className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                      placeholder=" "
                    />
                    {errors.lastname && (
                      <p className="text-red-600 text-sm mt-2">{errors.lastname.message}</p>
                    )}
                  </div>
                </div>
                <div className="md:gap-6 mb-5">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Número de teléfono (961-456-7890)
                    </label>
                    <input
                      type="tel"
                      pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                      id="phone"
                      {...register("phone", { required: "El número de teléfono es obligatorio" })}
                      className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                      placeholder=" "
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-2">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
                <div className="m-4">
                  <label
                    htmlFor="permissions"
                    className="block mb-2 text-sm font-medium dark:text-white"
                  >
                    Permisos
                  </label>
                  <select
                    id="permissions"
                    {...register("permissions", { required: "El permiso es obligatorio" })}
                    className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Standard">Standard</option>
                    <option value="End user">End user</option>
                  </select>
                  {errors.permissions && (
                    <p className="text-red-600 text-sm mt-2">{errors.permissions.message}</p>
                  )}
                </div>
              </form>
            </div>
            <div className="flex flex-col">
              <h2 className={`text-2xl p-4 ${sofia.className}`}>Datos de facturación</h2>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-4 m-4 rounded-xl shadow-xl"
              >
                <div className="mb-5">
                  <label
                    htmlFor="billing_name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="billing_name"
                    {...register("billing_name", { required: "El nombre de facturación es obligatorio" })}
                    className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                    placeholder=" "
                  />
                  {errors.billing_name && (
                    <p className="text-red-600 text-sm mt-2">{errors.billing_name.message}</p>
                  )}
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="rfc"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    RFC
                  </label>
                  <input
                    type="text"
                    id="rfc"
                    {...register("rfc", { required: "El RFC es obligatorio" })}
                    className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                    placeholder=" "
                  />
                  {errors.rfc && (
                    <p className="text-red-600 text-sm mt-2">{errors.rfc.message}</p>
                  )}
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="address"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="address"
                    {...register("address", { required: "La dirección es obligatoria" })}
                    className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                    placeholder=" "
                  />
                  {errors.address && (
                    <p className="text-red-600 text-sm mt-2">{errors.address.message}</p>
                  )}
                </div>
                <div className="grid md:grid-cols-2 md:gap-6 mb-5">
                  <div>
                    <label
                      htmlFor="billing_email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      id="billing_email"
                      {...register("billing_email", { required: "El correo electrónico de facturación es obligatorio" })}
                      className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                      placeholder=" "
                    />
                    {errors.billing_email && (
                      <p className="text-red-600 text-sm mt-2">{errors.billing_email.message}</p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="flex flex-col items-center md:flex-row md:justify-end mb-10 mt-6">
            <button
              type="button"
              className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm w-64 px-8 py-2.5 text-center ml-2 m-4"
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-64 px-16 py-2.5 text-center ml-2 m-4"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              Guardar
            </button>
          </div>
        </main>
        <FooterDashboard />
      </div>
    </div>
  );
}
