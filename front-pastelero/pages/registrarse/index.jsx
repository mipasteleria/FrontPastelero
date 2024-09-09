import Link from "next/link";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAuth } from "@/src/context";
import Swal from "sweetalert2";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      // Realiza la solicitud de registro
      const registerResponse = await fetch(`${API_BASE}/users`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      });
      
      const registerJson = await registerResponse.json();
  
      if (registerResponse.ok) {
        // Si el registro es exitoso, proceder con el login automático
        const loginResponse = await fetch(`${API_BASE}/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
  
        const loginJson = await loginResponse.json();
  
        if (loginResponse.ok && loginJson.token) {
          // Muestra el SweetAlert de éxito
          Swal.fire({
            title: '¡Registro e inicio de sesión exitosos!',
            text: 'Has sido registrado e iniciado sesión correctamente.',
            icon: 'success',
            background: '#fff1f2',
            color: '#540027',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            login(loginJson.token); // Actualiza el estado de autenticación global
            router.push("/"); // Redirige al home
          });
        } else {
          // Maneja el error si el login falla después del registro
          Swal.fire({
            title: '¡Error al iniciar sesión!',
            text: 'Usuario o contraseña incorrectos.',
            icon: 'error',
            background: '#fff1f2',
            color: '#540027',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          });
        }
      } else {
        // Maneja el error si el registro falla
        Swal.fire({
          title: '¡Error al registrarse!',
          text: registerJson.message || 'Ocurrió un error desconocido.',
          icon: 'error',
          background: '#fff1f2',
          color: '#540027',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    } catch (error) {
      // Maneja cualquier error de red o solicitud
      console.error("Error:", error.message || "An unexpected error occurred");
      Swal.fire({
        title: 'Error',
        text: 'Error al procesar la solicitud, por favor intente nuevamente.',
        icon: 'error',
        background: '#fff1f2',
        color: '#540027',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  };
  
  return (
    <main
      className={`bg-primary min-h-screen flex flex-col justify-center items-center ${poppins.className}`}
    >
      <div 
      className={`flex mt-6 justify-center rounded-xl ${sofia.className}`}>
        <Link href="/">
          <Image
            className="h-32 w-32"
            src="/img/logo.JPG"
            width={400}
            height={400}
            alt="Logo de Pastelería El Ruiseñor"
          />
        </Link>
        <div 
        className="px-2">
          <div 
          className="text-white text-3xl">
            Pastelería
          </div>
          <div 
          className="text-white text-4xl">
            El Ruiseñor
          </div>
        </div>
      </div>
      <h1 
      className="text-text text-2xl mt-10">
        Registrarse
      </h1>
      <form
        className="w-11/12 md:w-10/12 lg:w-6/12 my-10 bg-rose-100 border border-accent p-6 rounded-xl shadow-xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div 
        className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Correo electrónico es requerido",
            })}
            className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            placeholder="nombre@dominio.com"
            aria-required="true"
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>
        <div 
        className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            {...register("password", { required: "Contraseña es requerida" })}
            className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            placeholder=" "
            aria-required="true"
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-red-600 mt-1">{errors.password.message}</p>
          )}
        </div>
        <div 
        className="mb-5">
          <label
            htmlFor="floating_repeat_password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Confirmar contraseña
          </label>
          <input
            type="password"
            id="floating_repeat_password"
            {...register("floating_repeat_password", {
              required: "Confirmar contraseña es requerida",
            })}
            className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            placeholder=" "
            aria-required="true"
            aria-invalid={!!errors.floating_repeat_password}
          />
          {errors.floating_repeat_password && (
            <p className="text-red-600 mt-1">
              {errors.floating_repeat_password.message}
            </p>
          )}
        </div>
        <div 
        className="grid md:grid-cols-2 md:gap-6 mb-5">
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
              {...register("name", { required: "Nombre es requerido" })}
              className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
              placeholder=" "
              aria-required="true"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-red-600 mt-1">{errors.name.message}</p>
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
              {...register("lastname", { required: "Apellido es requerido" })}
              className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
              placeholder=" "
              aria-required="true"
              aria-invalid={!!errors.lastname}
            />
            {errors.lastname && (
              <p className="text-red-600 mt-1">{errors.lastname.message}</p>
            )}
          </div>
        </div>
        <div 
        className="mb-5">
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Número de teléfono (961-456-7890)
          </label>
          <input
            type="tel"
            id="phone"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            {...register("phone", {
              required: "Número de teléfono es requerido",
            })}
            className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            placeholder=" "
            aria-required="true"
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className="text-red-600 mt-1">{errors.phone.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="text-white bg-secondary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Enviar
        </button>
      </form>
    </main>
  );
}
