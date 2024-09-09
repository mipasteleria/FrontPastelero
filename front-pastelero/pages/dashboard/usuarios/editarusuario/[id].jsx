import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import Swal from "sweetalert2";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { useAuth } from "@/src/context";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function UsuarioForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const { userToken, logout } = useAuth(); // Obtener el token y la función de logout desde el contexto

  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        if (!userToken) {
          Swal.fire({
            title: "Error de autenticación",
            text: "No se encontró el token de autenticación. Por favor, inicia sesión de nuevo.",
            icon: "warning",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            background: "#fff1f2",
            color: "#540027",
          });
          return;
        }

        try {
          const response = await fetch(`${API_BASE}/users/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            reset({
              name: result.data.name || "",
              lastname: result.data.lastname || "",
              email: result.data.email || "",
              phone: result.data.phone || "",
              role: result.data.role || "",
              password: "",
              repeat_password: "",
            });
          } else {
            const errorResult = await response.json();
            setErrorMessage(errorResult.message);
            Swal.fire({
              title: "Error",
              text: errorResult.message || "Error al cargar los datos del usuario.",
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

      fetchUserData();
    }
  }, [id, reset, userToken]); // Añadir 'userToken' como dependencia

  const onSubmit = async (data) => {
    console.log("onSubmit function triggered with data:", data);
    if (!userToken) {
      Swal.fire({
        title: "Error de autenticación",
        text: "No se encontró el token de autenticación. Por favor, inicia sesión de nuevo.",
        icon: "warning",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff1f2",
        color: "#540027",
      });
      return;
    }

    try {
      const url = `${API_BASE}/users/${id}`;

      // Filtrar los datos a enviar
      const updatedData = {
        email: data.email,
        lastname: data.lastname,
        name: data.name,
        phone: data.phone,
        role: data.role,
      };

      // Remover los campos de contraseña si están vacíos
      if (!data.password) delete updatedData.password;
      if (!data.repeat_password) delete updatedData.repeat_password;

      // Logs para verificar los datos enviados
      console.log("URL de la solicitud:", url);
      console.log("Datos enviados al servidor:", updatedData);
      console.log("Token de autenticación:", userToken);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const result = await response.json();
        Swal.fire({
          title: "Usuario actualizado",
          text: "El usuario ha sido actualizado correctamente.",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#fff1f2",
          color: "#540027",
        }).then(() => {
          reset();
          router.push("/dashboard/usuarios");
        });
      } else if (response.status === 401) {
        Swal.fire({
          title: "Sesión expirada",
          text: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo.",
          icon: "warning",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#fff1f2",
          color: "#540027",
        }).then(() => {
          logout();
          router.push("/login");
        });
      } else {
        const errorResult = await response.json();
        Swal.fire({
          title: "Error",
          text: errorResult.message || "Error al actualizar el usuario.",
          icon: "error",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#fff1f2",
          color: "#540027",
        });
        setErrorMessage(errorResult.message);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
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
      setErrorMessage("Error al conectar con el servidor.");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/usuarios");
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
        {...register(id, {
          required: "El campo es obligatorio",
        })}
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
        {...register(id, {
          required: `El campo ${label.toLowerCase()} es obligatorio`,
          pattern: pattern && {
            value: pattern,
            message: "Formato no válido",
          },
        })}
        className="bg-gray-50 border border-secondary text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5"
        placeholder={placeholder}
      />
      {errors && <p className="text-red-600 text-sm mt-2">{errors.message}</p>}
    </div>
  );

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className="flex-grow w-3/4 max-w-screen-lg mx-auto mb-16">
          <h1 className={`text-4xl p-4 ${sofia.className}`}>
            {id ? "Editar Usuario" : "Nuevo Usuario"}
          </h1>
          <div className="flex flex-col md:flex-row justify-star">
            <div className="flex flex-col">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-4 m-4 rounded-xl shadow-xl w-full"
              >
                <InputField
                  id="email"
                  type="email"
                  label="Correo electrónico"
                  placeholder="nombre@dominio.com"
                  register={register}
                  errors={errors.email}
                />
                <InputField
                  id="password"
                  type="password"
                  label="Contraseña"
                  register={register}
                  errors={errors.password}
                />
                <InputField
                  id="repeat_password"
                  type="password"
                  label="Confirmar Contraseña"
                  register={register}
                  errors={errors.repeat_password}
                />
                <div className="grid md:grid-cols-2 md:gap-6 mb-5">
                  <InputField
                    id="name"
                    type="text"
                    label="Nombre"
                    register={register}
                    errors={errors.name}
                  />
                  <InputField
                    id="lastname"
                    type="text"
                    label="Apellido"
                    register={register}
                    errors={errors.lastname}
                  />
                </div>
                <InputField
                  id="phone"
                  type="tel"
                  label="Número de teléfono (961-456-7890)"
                  placeholder="961-456-7890"
                  pattern={/^\d{3}-\d{3}-\d{4}$/}
                  register={register}
                  errors={errors.phone}
                />
                <SelectField
                  id="role"
                  label="Rol"
                  register={register}
                  errors={errors.role}
                  options={["user", "admin"]}
                />
                <div className="flex justify-star">
                  <button
                    type="button"
                    className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm w-64 px-8 py-2.5 text-center ml-2 m-4"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="shadow-md text-text bg-primary hover:bg-accent hover:text-white focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm w-64 px-8 py-2.5 text-center ml-2 m-4"
                    disabled={isSubmitting}
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
          {successMessage && (
            <p className="text-green-600 text-sm mt-4">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-600 text-sm mt-4">{errorMessage}</p>
          )}
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}
