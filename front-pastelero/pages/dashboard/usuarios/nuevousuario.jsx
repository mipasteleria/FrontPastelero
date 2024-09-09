import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Swal from "sweetalert2";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function Conocenuestrosproductos() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const onSubmit = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      Swal.fire({
        title: "¡Éxito!",
        text: "Usuario agregado correctamente.",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff1f2",
        color: "#540027",
      }).then(() => {
        // Limpiar todos los campos manualmente
        reset();
        setSuccessMessage("");
        setErrorMessage("");
      });
    } else {
      const errorResult = await response.json();
      setErrorMessage(errorResult.message);
      Swal.fire({
        title: "Error",
        text: errorResult.message || "No se pudo agregar el usuario.",
        icon: "error",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff1f2",
        color: "#540027",
      });
    }
  } catch (error) {
    setErrorMessage("Error al conectar con el servidor.");
    Swal.fire({
      title: "Error",
      text: "Error al conectar con el servidor.",
      icon: "error",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      background: "#fff1f2",
      color: "#540027",
    });
  }
};

  const SelectField = ({ id, label, register, errors, options }) => (
    <div className="m-4">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium dark:text-white"
      >
        {label}
      </label>
      <select
        id={id}
        {...register}
        className="bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors && <p className="text-red-600 text-sm mt-2">{errors.message}</p>}
    </div>
  );

  const ActionButton = ({ text, onClick, disabled }) => (
    <button
      type="button"
      className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm w-64 px-8 py-2.5 text-center ml-2 m-4"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );

  const handleCancel = () => reset();

  const InputField = ({
    id,
    type,
    label,
    register,
    errors,
    placeholder,
    pattern,
  }) => (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        {...register}
        className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
        placeholder={placeholder}
        pattern={pattern}
      />
      {errors && <p className="text-red-600 text-sm mt-2">{errors.message}</p>}
    </div>
  );

  return (
    <div 
    className={`text-text ${poppins.className}`}>
      <NavbarAdmin 
      className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className="flex-grow w-3/4 max-w-screen-lg mx-auto mb-16">
          <h1 className={`text-4xl p-4 ${sofia.className}`}>Nuevo usuario</h1>
          <div className="flex flex-col md:flex-row justify-star">
            <div className="flex flex-col">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-4 m-4 rounded-xl w-full shadow-xl"
              >
                <InputField
                  id="email"
                  type="email"
                  label="Correo electrónico"
                  placeholder="nombre@dominio.com"
                  register={register("email", {
                    required: "El correo electrónico es obligatorio",
                  })}
                  errors={errors.email}
                />
                <InputField
                  id="password"
                  type="password"
                  label="Contraseña"
                  register={register("password", {
                    required: "La contraseña es obligatoria",
                  })}
                  errors={errors.password}
                />
                <InputField
                  id="repeat_password"
                  type="password"
                  label="Confirmar contraseña"
                  register={register("repeat_password", {
                    required: "Confirmar la contraseña es obligatorio",
                  })}
                  errors={errors.repeat_password}
                />
                <div className="grid md:grid-cols-2 md:gap-6 mb-5">
                  <InputField
                    id="name"
                    type="text"
                    label="Nombre"
                    register={register("name", {
                      required: "El nombre es obligatorio",
                    })}
                    errors={errors.name}
                  />
                  <InputField
                    id="lastname"
                    type="text"
                    label="Apellido"
                    register={register("lastname", {
                      required: "El apellido es obligatorio",
                    })}
                    errors={errors.lastname}
                  />
                </div>
                <InputField
                  id="phone"
                  type="tel"
                  label="Número de teléfono (961-456-7890)"
                  placeholder=" "
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  register={register("phone", {
                    required: "El número de teléfono es obligatorio",
                  })}
                  errors={errors.phone}
                />
                <SelectField
                  id="role"
                  label="Rol"
                  register={register("role", {
                    required: "El Rol es obligatorio",
                  })}
                  errors={errors.permissions}
                  options={["user", "admin"]}
                />
              </form>
            </div>
          </div>
          {successMessage && (
            <p className="text-green-600 text-sm mt-2">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
          )}
          <div className="flex flex-col items-center md:flex-row md:justify-star mb-10 mt-6">
            <ActionButton text="Cancelar" onClick={handleCancel} />
            <ActionButton
              text="Guardar"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            />
          </div>
        </main>
        <FooterDashboard />
      </div>
    </div>
  );
}
