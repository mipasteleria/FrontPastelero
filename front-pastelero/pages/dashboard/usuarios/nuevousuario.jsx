import Link from "next/link";
import NavbarDashboard from "@/src/components/navbardashboard";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { useRef } from "react";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Conocenuestrosproductos() {
  const formRef1 = useRef(null);
  const formRef2 = useRef(null);

  const handleCancel = () => {
    if (formRef1.current && formRef2.current) {
      formRef1.current.reset();
      formRef2.current.reset();
    }
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarDashboard />
      <div className="flex flex-row">
        <Asideadmin />
        <main className="flex-grow w-3/4">
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Nuevo usuario</h1>
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-col">
              <h2 className={`text-2xl p-4 ${sofia.className}`}>Nuevo cliente</h2>
              <form
                ref={formRef1}
                className="p-4 m-4 rounded-xl shadow-xl"
              >
                <div className="mb-5">
                  <label
                    htmlFor="floating_email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="floating_email"
                    className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                    placeholder="nombre@dominio.com"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="floating_password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="floating_password"
                    className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                    placeholder=" "
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="floating_repeat_password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    name="floating_repeat_password"
                    id="floating_repeat_password"
                    className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                    placeholder=" "
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 md:gap-6 mb-5">
                  <div>
                    <label
                      htmlFor="floating_first_name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="floating_first_name"
                      className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                      placeholder=" "
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="floating_last_name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      id="floating_last_name"
                      className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                      placeholder=" "
                      required
                    />
                  </div>
                </div>
                <div className="md:gap-6 mb-5">
                  <div>
                    <label
                      htmlFor="floating_phone"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Número de teléfono (961-456-7890)
                    </label>
                    <input
                      type="tel"
                      pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                      name="phone"
                      id="floating_phone"
                      className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                      placeholder=" "
                      required
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="flex flex-col">
              <h2 className={`text-2xl p-4 ${sofia.className}`}>Datos de facturación</h2>
              <form
                ref={formRef2}
                className="p-4 m-4 rounded-xl shadow-xl"
              >
                <div className="mb-5">
                  <label
                    htmlFor="floating_email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nombre
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="floating_email"
                    className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                    placeholder="nombre@dominio.com"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="floating_password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    RFC
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="floating_password"
                    className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                    placeholder=" "
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="floating_repeat_password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Dirección
                  </label>
                  <input
                    type="password"
                    name="floating_repeat_password"
                    id="floating_repeat_password"
                    className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                    placeholder=" "
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 md:gap-6 mb-5">
                  <div>
                    <label
                      htmlFor="floating_first_name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Correo electrónico
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="floating_first_name"
                      className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
                      placeholder=" "
                      required
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <button
              type="button"
              className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-8 py-2.5 text-center ml-2 m-4"
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <Link
              className="flex justify-end"
              href="/dashboard/cotizaciones/cotizacionmanual"
            >
              <button
                type="submit"
                className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center ml-2 m-4"
              >
                Guardar
              </button>
            </Link>
          </div>
        </main>
        <FooterDashboard />
      </div>
    </div>
  );
}
