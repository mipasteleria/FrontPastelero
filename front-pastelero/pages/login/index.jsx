import Link from "next/link";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await fetch("https://pasteleros-back.vercel.app/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      if (json.data) {
        localStorage.setItem("token", json.data);
        router.push("/dashboard");
      } else {
        setError("¡Usuario o contraseña incorrectos!");
      }
    } catch (error) {
      console.error("Login error: ", error);
      setError("Error al iniciar sesión, por favor intente nuevamente.");
    }
  };

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
          <div className="text-white text-3xl">Pastelería</div>
          <div className="text-white text-4xl">El Ruiseñor</div>
        </div>
      </div>
      <h1 className="text-text text-2xl">Ingresar</h1>
      <form
        className="w-11/12 md:w-10/12 lg:w-6/12 my-10 md:my-10 bg-rose-100 border border-accent p-6 rounded-xl shadow-xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "Correo electrónico es requerido" })}
            className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            placeholder="name@pasteleriaruiseñor.com"
          />
          {errors.email && <p className="text-red-600">{errors.email.message}</p>}
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <input
            type="password"
            id="password"
            {...register("password", { required: "Contraseña es requerida" })}
            className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
            required
          />
          {errors.password && <p className="text-red-600">{errors.password.message}</p>}
        </div>
        <div className="flex items-start mb-5">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 border border-secondary rounded bg-gray-50 focus:ring-3 focus:ring-accent"
            />
          </div>
          <label
            htmlFor="remember"
            className="ms-2 text-sm font-medium text-gray-900"
          >
            Remember me
          </label>
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="text-white bg-secondary hover:bg-accent focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
