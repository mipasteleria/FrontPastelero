import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

export default function UsuarioForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const { id } = router.query; // Obtén el ID desde la query de la URL
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${API_BASE}/users/${id}`);
          if (response.ok) {
            const result = await response.json();
            setUserData(result.data);
            reset({
              name: result.data.name || "",
              lastname: result.data.lastname || "",
              email: result.data.email || "",
              phone: result.data.phone || "",
              permissions: result.data.permissions || "",
              billing_name: result.data.billing_name || "",
              rfc: result.data.rfc || "",
              address: result.data.address || "",
              billing_email: result.data.billing_email || "",
              password: "", // Mantén vacíos los campos de contraseña
              repeat_password: "",
            });
          } else {
            const errorResult = await response.json();
            setErrorMessage(errorResult.message);
          }
        } catch (error) {
          setErrorMessage("Error al conectar con el servidor.");
        }
      };

      fetchUserData();
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      // Usa PUT siempre, ya que solo se permite actualizar
      const url = `${API_BASE}/users/${id}`;

      // Elimina los campos de contraseña si están vacíos
      const updatedData = { ...data };
      if (!updatedData.password) delete updatedData.password;
      if (!updatedData.repeat_password) delete updatedData.repeat_password;

      const response = await fetch(url, {
        method: "PUT", // Solo PUT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(result.message);
        reset();
        router.push("/dashboard/usuarios");
      } else {
        const errorResult = await response.json();
        setErrorMessage(errorResult.message);
      }
    } catch (error) {
      setErrorMessage("Error al conectar con el servidor.");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/usuarios"); // Redirige a la página de usuarios
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
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className="flex-grow w-3/4 max-w-screen-lg mx-auto mb-16">
          <h1 className={`text-4xl p-4 ${sofia.className}`}>
            {id ? "Editar Usuario" : "Nuevo Usuario"}
          </h1>
          <div className="flex flex-col md:flex-row justify-around">
            <div className="flex flex-col">
              <h2 className={`text-2xl p-4 ${sofia.className}`}>
                Datos del Usuario
              </h2>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-4 m-4 rounded-xl shadow-xl"
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
                  register={register("password")}
                  errors={errors.password}
                />
                <InputField
                  id="repeat_password"
                  type="password"
                  label="Confirmar Contraseña"
                  register={register("repeat_password")}
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
                  id="permissions"
                  label="Permisos"
                  register={register("permissions", {
                    required: "El permiso es obligatorio",
                  })}
                  errors={errors.permissions}
                  options={["Admin", "Standard", "End user"]}
                />
              </form>
            </div>
            <div className="flex flex-col">
              <h2 className={`text-2xl p-4 ${sofia.className}`}>
                Datos de Facturación
              </h2>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-4 m-4 rounded-xl shadow-xl"
              >
                <InputField
                  id="billing_name"
                  type="text"
                  label="Nombre"
                  register={register("billing_name")}
                  errors={errors.billing_name}
                />
                <InputField
                  id="rfc"
                  type="text"
                  label="RFC"
                  register={register("rfc")}
                  errors={errors.rfc}
                />
                <InputField
                  id="address"
                  type="text"
                  label="Dirección"
                  register={register("address")}
                  errors={errors.address}
                />
                <div className="grid md:grid-cols-2 md:gap-6 mb-5">
                  <InputField
                    id="billing_email"
                    type="email"
                    label="Correo electrónico"
                    register={register("billing_email")}
                    errors={errors.billing_email}
                  />
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
          <div className="flex justify-center">
            <ActionButton
              text="Cancelar"
              onClick={handleCancel}
              disabled={isSubmitting}
            />
            <ActionButton
              text="Guardar"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            />
          </div>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}
