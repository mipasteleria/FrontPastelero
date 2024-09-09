import Link from "next/link";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Swal from 'sweetalert2';
import { useAuth } from "@/src/context";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState("");
  const { login } = useAuth();
  
  const navigate = () => {
    router.push('/');
    window.location.reload();
  };
  
  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await response.json();
  
      if (json.token) {
        Swal.fire({
          title: '¡Inicio de sesión exitoso!',
          text: 'Has iniciado sesión correctamente.',
          icon: 'success',
          background: '#fff1f2',
          color: '#540027', 
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          login(json.token);
          router.push("/")
        });
      } else {
        Swal.fire({
          title: '¡Error!',
          text: 'Usuario o contraseña incorrectos.',
          icon: 'error',
          background: '#fff1f2',
          color: '#540027', 
          timer: 2000, // Tiempo en milisegundos
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Login error: ", error);
      // Muestra una alerta de error cuando hay un problema con la solicitud
      Swal.fire({
        title: 'Error',
        text: 'Error al iniciar sesión, por favor intente nuevamente.',
        icon: 'error',
        timer: 2000, // Tiempo en milisegundos
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  };

  return (
    <main
      className={`bg-primary min-h-screen flex flex-col justify-center items-center ${poppins.className}`}
    >
      <div className="flex mt-6 justify-center rounded-xl">
          <Link 
          href="/" 
          className="flex items-center">
          <Image
            className="h-32 w-32"
            src="/img/logo.JPG"
            width={400}
            height={400}
            alt="Logo de Pastelería El Ruiseñor"
          />
          
          <div className="flex flex-col items-center justify-center flex-grow px-2 m-6">
            <div 
            className={`text-white text-3xl ${sofia.className}`}>Pastelería</div>
            <div 
            className={`text-white text-4xl mt-3 ${sofia.className}`}>El Ruiseñor</div>
          </div>
        </Link>
      </div>
      
      <h1 className={`text-text text-2xl mt-10 ${poppins.className}`}>
        Ingresar
      </h1>
      <form
        className="w-11/12 md:w-10/12 lg:w-6/12 my-10 bg-rose-100 border border-accent p-6 rounded-xl shadow-xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-5">
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
            placeholder="name@pasteleriaruiseñor.com"
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
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            {...register("password", { required: "Contraseña es requerida" })}
            className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            aria-required="true"
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-red-600 mt-1">{errors.password.message}</p>
          )}
        </div>
        <div 
        className="flex items-center mb-5">
          <input
            id="remember"
            type="checkbox"
            className="w-4 h-4 border border-secondary rounded bg-gray-50 focus:ring-3 focus:ring-accent"
          />
          <label
            htmlFor="remember"
            className="ml-2 text-sm font-medium text-gray-900"
          >
            Recordarme
          </label>
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button
          type="submit"
          className="text-white bg-secondary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Ingresar
        </button>
      </form>
    </main>
  );
}
