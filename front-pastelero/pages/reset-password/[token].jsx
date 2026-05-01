import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Image from "next/image";
import Swal from "sweetalert2";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ResetPassword() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const router = useRouter();
  const { token } = router.query;
  const [done, setDone] = useState(false);

  const onSubmit = async (data) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/users/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: data.password }),
      });
      const json = await res.json();

      if (res.ok) {
        setDone(true);
      } else {
        Swal.fire({
          title: "Error",
          text: json.message || "No se pudo actualizar la contraseña.",
          icon: "error",
          background: "#fff1f2",
          color: "#540027",
          timer: 4000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "No se pudo conectar con el servidor. Intenta de nuevo.",
        icon: "error",
        background: "#fff1f2",
        color: "#540027",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const inputStyle = (hasError) => ({
    width: "100%",
    border: hasError ? "1.5px solid var(--rosa)" : "1.5px solid var(--border-color)",
    borderRadius: "var(--r-md)",
    padding: "12px 16px",
    fontSize: "0.9rem",
    fontFamily: "var(--font-nunito)",
    background: "var(--bg-sunken)",
    color: "var(--color-text)",
    outline: "none",
    transition: "border-color 150ms",
    boxSizing: "border-box",
  });

  return (
    <main
      className={nunito.className}
      style={{
        minHeight: "100vh",
        background: "var(--bg-sunken)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.25rem",
        position: "relative",
      }}
    >
      {/* Sprinkle overlay */}
      <div aria-hidden="true" className="ru-pattern-sprinkle fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />

      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2rem", textDecoration: "none", position: "relative", zIndex: 1 }}>
        <Image src="/img/logo.JPG" width={64} height={64} alt="Logo El Ruiseñor" style={{ borderRadius: "50%", objectFit: "cover" }} />
        <div>
          <div className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.5rem", lineHeight: 1 }}>Pastelería</div>
          <div className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.75rem", lineHeight: 1 }}>El Ruiseñor</div>
        </div>
      </Link>

      <div
        style={{
          background: "var(--bg-raised)",
          borderRadius: "var(--r-2xl)",
          boxShadow: "var(--shadow-lg)",
          padding: "2.5rem",
          width: "100%",
          maxWidth: 440,
          position: "relative",
          zIndex: 1,
        }}
      >
        {done ? (
          /* ── Success state ── */
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <h1 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "2rem", marginBottom: "0.75rem" }}>
              ¡Contraseña actualizada!
            </h1>
            <p style={{ color: "var(--text-soft)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.75rem" }}>
              Tu contraseña se cambió correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
            <Link href="/login">
              <button
                style={{
                  padding: "12px 32px",
                  borderRadius: "var(--r-pill)",
                  background: "var(--burdeos)",
                  color: "#fff",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  fontFamily: "var(--font-nunito)",
                  transition: "all 150ms",
                }}
              >
                Iniciar sesión
              </button>
            </Link>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <h1 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "2rem", marginBottom: "0.5rem" }}>
              Nueva contraseña
            </h1>
            <p style={{ color: "var(--text-soft)", fontSize: "0.88rem", lineHeight: 1.65, marginBottom: "1.75rem" }}>
              Elige una contraseña segura de al menos 8 caracteres.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-soft)", marginBottom: 6 }}>
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "La contraseña es requerida",
                    minLength: { value: 8, message: "Mínimo 8 caracteres" },
                  })}
                  style={inputStyle(!!errors.password)}
                />
                {errors.password && (
                  <p style={{ color: "var(--rosa)", fontSize: "0.78rem", marginTop: 4 }}>{errors.password.message}</p>
                )}
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-soft)", marginBottom: 6 }}>
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  {...register("repeat_password", {
                    required: "Confirma tu contraseña",
                    validate: (val) => val === watch("password") || "Las contraseñas no coinciden",
                  })}
                  style={inputStyle(!!errors.repeat_password)}
                />
                {errors.repeat_password && (
                  <p style={{ color: "var(--rosa)", fontSize: "0.78rem", marginTop: 4 }}>{errors.repeat_password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !token}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "var(--r-pill)",
                  background: (isSubmitting || !token) ? "var(--border-strong)" : "var(--burdeos)",
                  color: "#fff",
                  border: "none",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  cursor: (isSubmitting || !token) ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-nunito)",
                  transition: "all 150ms",
                }}
              >
                {isSubmitting ? "Guardando…" : "Guardar nueva contraseña"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
