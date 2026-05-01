import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Swal from "sweetalert2";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function RecuperarContrasena() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${API_BASE}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      // Always show success message (backend doesn't leak whether email exists)
      setSent(true);
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
        {sent ? (
          /* ── Success state ── */
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📬</div>
            <h1 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "2rem", marginBottom: "0.75rem" }}>
              Revisa tu correo
            </h1>
            <p style={{ color: "var(--text-soft)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.75rem" }}>
              Si la dirección está registrada, recibirás un enlace para restablecer tu contraseña en los próximos minutos. Revisa también tu carpeta de spam.
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
                Volver al inicio de sesión
              </button>
            </Link>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <h1 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "2rem", marginBottom: "0.5rem" }}>
              ¿Olvidaste tu contraseña?
            </h1>
            <p style={{ color: "var(--text-soft)", fontSize: "0.88rem", lineHeight: 1.65, marginBottom: "1.75rem" }}>
              Escribe el correo que usaste para registrarte y te enviaremos un enlace para elegir una nueva contraseña.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-soft)", marginBottom: 6 }}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  {...register("email", { required: "El correo es requerido" })}
                  placeholder="tu@correo.com"
                  style={{
                    width: "100%",
                    border: errors.email ? "1.5px solid var(--rosa)" : "1.5px solid var(--border-color)",
                    borderRadius: "var(--r-md)",
                    padding: "12px 16px",
                    fontSize: "0.9rem",
                    fontFamily: "var(--font-nunito)",
                    background: "var(--bg-sunken)",
                    color: "var(--color-text)",
                    outline: "none",
                    transition: "border-color 150ms",
                    boxSizing: "border-box",
                  }}
                />
                {errors.email && (
                  <p style={{ color: "var(--rosa)", fontSize: "0.78rem", marginTop: 4 }}>{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "var(--r-pill)",
                  background: isSubmitting ? "var(--border-strong)" : "var(--burdeos)",
                  color: "#fff",
                  border: "none",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-nunito)",
                  transition: "all 150ms",
                }}
              >
                {isSubmitting ? "Enviando…" : "Enviar enlace de recuperación"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <Link href="/login" style={{ color: "var(--burdeos)", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}>
                ← Volver al inicio de sesión
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
