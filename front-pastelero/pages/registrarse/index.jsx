import Link from "next/link";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Image from "next/image";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Login() {
  return (
    <main className="bg-primary min-h-screen flex flex-col justify-center items-center">
      <div className={`flex mt-6 justify-center rounded-xl ${sofia.className}`}>
        <Link href="/">
          <Image
            className="h-32 w-32"
            src="/img/logo.JPG"
            width={400}
            height={400}
            alt="logo de Pastelería El Ruiseñor"
          />
        </Link>
        <div className="px-2">
          <div className="text-white text-3xl">
            Pastelería
          </div>
          <div className="text-white text-4xl">
            El Ruiseñor
          </div>
        </div>
      </div>
      <h1 className="text-text text-2xl">Registrarse</h1>
      <form class="w-11/12 md:w-10/12 lg:w-6/12 my-10 md:my-10 bg-rose-100 border border-accent p-6 rounded-xl shadow-xl mx-auto">
        <div class="mb-5">
            <label for="floating_email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo electrónico</label>
            <input type="email" name="floating_email" id="floating_email" class="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5" placeholder="nombre@dominio.com" required />
        </div>
        <div class="mb-5">
            <label for="floating_password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
            <input type="password" name="floating_password" id="floating_password" class="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5" placeholder=" " required />
        </div>
        <div class="mb-5">
            <label for="floating_repeat_password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirmar contraseña</label>
            <input type="password" name="floating_repeat_password" id="floating_repeat_password" class="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5" placeholder=" " required />
        </div>
        <div class="grid md:grid-cols-2 md:gap-6 mb-5">
            <div>
            <label for="floating_first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
            <input type="text" name="floating_first_name" id="floating_first_name" class="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5" placeholder=" " required />
            </div>
            <div>
            <label for="floating_last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Apellido</label>
            <input type="text" name="floating_last_name" id="floating_last_name" class="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5" placeholder=" " required />
            </div>
        </div>
        <div class="md:gap-6 mb-5">
            <div>
            <label for="floating_phone" class="block mb-2 text-sm font-medium text-gray-900 ">Número de teléfono (961-456-7890)</label>
            <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="floating_phone" id="floating_phone" class="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5" placeholder=" " required />
            </div>
        </div>
        <button type="submit" class="text-white bg-secondary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Enviar</button>
        </form>

    </main>
  );
}
