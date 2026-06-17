import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Swal from "sweetalert2";
import { Nunito as NunitoFont, Sofia as SofiaFont } from "next/font/google";
import { useAuth } from "@/src/context";

const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "700", "800"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const PRODUCTO_LABEL = {
  pastel: "Pastel personalizado",
  cupcake: "Cupcakes",
  "mesa-postres": "Mesa de postres",
};

/**
 * Vista pública de una cotización (enlace de invitado).
 *
 * El cliente la abre sin login (token en la URL). Ve el detalle + precio +
 * validez y elige cómo continuar:
 *  - Pagar en línea (se recomienda crear cuenta — bloque animado).
 *  - Confirmar con anticipo por transferencia / efectivo.
 */
export default function VerCotizacion() {
  const router = useRouter();
  const { token } = router.query;
  const { isLoggedIn } = useAuth();

  const [cot, setCot] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mostrarPago, setMostrarPago] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/cotizacion-personalizada/public/${token}`)
      .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => {
        if (!ok) throw new Error(j.message || "No encontrada");
        setCot(j.data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [token]);

  const confirmarTransferencia = async (metodo) => {
    setConfirmando(true);
    try {
      const r = await fetch(`${API_BASE}/cotizacion-personalizada/public/${token}/confirmar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metodo }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Error");
      setCot((c) => ({ ...c, confirmacionCliente: { confirmado: true, metodo } }));
      Swal.fire({
        icon: "success",
        title: "¡Pedido confirmado!",
        html: `Te contactaremos para coordinar el anticipo del 50% por <strong>${metodo}</strong>.`,
        confirmButtonColor: "#FF6F7D",
        background: "#fff1f2",
        color: "#540027",
      });
    } catch (e) {
      Swal.fire({ icon: "error", title: e.message, confirmButtonColor: "#FF6F7D" });
    } finally {
      setConfirmando(false);
    }
  };

  if (cargando) {
    return <Pantalla><p style={{ color: "var(--text-soft)" }}>Cargando tu cotización…</p></Pantalla>;
  }
  if (error || !cot) {
    return (
      <Pantalla>
        <h1 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "2rem" }}>Cotización no disponible</h1>
        <p style={{ color: "var(--text-soft)", marginTop: 8 }}>
          El enlace no es válido o expiró. Contáctanos para reenviarte tu cotización.
        </p>
        <Link href="/" style={{ color: "var(--rosa)", fontWeight: 700, marginTop: 16, display: "inline-block" }}>← Inicio</Link>
      </Pantalla>
    );
  }

  const precio = Number(cot.precio) || 0;
  const anticipo = cot.anticipo != null ? Number(cot.anticipo) : Math.round(precio * 0.5);
  const vence = cot.validUntil ? new Date(cot.validUntil) : null;
  const vencida = vence ? Date.now() > vence.getTime() : false;
  const yaConfirmado = cot.confirmacionCliente?.confirmado;
  const esMesa = cot.tipoProducto === "mesa-postres";

  return (
    <Pantalla wide>
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,111,125,0.45); transform: translateY(0); }
          50% { box-shadow: 0 0 0 10px rgba(255,111,125,0); transform: translateY(-2px); }
        }
        .reco-card { animation: pulse-glow 2.2s ease-in-out infinite; }
        .reco-badge {
          position: absolute; top: -10px; right: 16px; background: var(--rosa);
          color: #fff; font-size: .7rem; font-weight: 800; padding: 3px 12px;
          border-radius: var(--r-pill); letter-spacing: .04em; text-transform: uppercase;
        }
        .btn {
          border: none; border-radius: var(--r-pill); padding: .8rem 1.4rem; font-weight: 800;
          font-size: .92rem; cursor: pointer; font-family: var(--font-nunito); transition: all 150ms;
        }
        .btn:hover { transform: translateY(-1px); }
        .row { display: flex; justify-content: space-between; padding: .45rem 0; border-bottom: 1px dashed var(--border-color); font-size: .9rem; }
      `}</style>

      <p style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--rosa)" }}>
        Tu cotización
      </p>
      <h1 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "clamp(2rem,5vw,3rem)", lineHeight: 1.05, marginBottom: 4 }}>
        {PRODUCTO_LABEL[cot.tipoProducto] || "Cotización"}
      </h1>
      <p style={{ color: "var(--text-soft)", fontSize: ".9rem", marginBottom: 24 }}>
        Hola {cot.cliente?.nombre || ""}, aquí está el detalle de tu pedido.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }}>
        {/* Detalle */}
        <div style={card}>
          <h2 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.3rem", marginBottom: 10 }}>Detalle</h2>
          <div className="row"><span style={{ color: "var(--text-soft)" }}>Evento</span><strong>{cot.evento?.tipo} · {cot.evento?.invitados} {esMesa ? "personas" : "porciones"}</strong></div>
          <div className="row"><span style={{ color: "var(--text-soft)" }}>Fecha</span><strong>{cot.evento?.fecha ? new Date(cot.evento.fecha).toLocaleDateString("es-MX") : "—"}</strong></div>
          {esMesa ? (
            <>
              <div className="row"><span style={{ color: "var(--text-soft)" }}>Postres / persona</span><strong>{cot.postresPorPersona}</strong></div>
              <div className="row"><span style={{ color: "var(--text-soft)" }}>Postres</span><strong style={{ maxWidth: "60%", textAlign: "right" }}>{(cot.postres || []).map((p) => p.nombre).join(", ") || "—"}</strong></div>
            </>
          ) : (
            <>
              <div className="row"><span style={{ color: "var(--text-soft)" }}>{cot.tipoProducto === "cupcake" ? "Cupcake" : "Bizcocho"}</span><strong>{cot.sabor?.nombre || "—"}</strong></div>
              <div className="row"><span style={{ color: "var(--text-soft)" }}>Relleno</span><strong>{cot.relleno?.nombre || "—"}</strong></div>
              <div className="row"><span style={{ color: "var(--text-soft)" }}>Cobertura</span><strong>{cot.cobertura?.nombre || "—"}</strong></div>
              {(cot.decoraciones || []).length > 0 && (
                <div className="row"><span style={{ color: "var(--text-soft)" }}>Decoraciones</span><strong style={{ maxWidth: "60%", textAlign: "right" }}>{cot.decoraciones.map((d) => d.nombre).join(", ")}</strong></div>
              )}
            </>
          )}
          {cot.estilo?.comentarios && (
            <div className="row"><span style={{ color: "var(--text-soft)" }}>Comentarios</span><strong style={{ maxWidth: "60%", textAlign: "right" }}>{cot.estilo.comentarios}</strong></div>
          )}
        </div>

        {/* Precio */}
        <div style={{ ...card, background: "linear-gradient(180deg,var(--burdeos),#3D001D)", color: "#fff" }}>
          {precio > 0 ? (
            <>
              <div className="row" style={{ borderColor: "rgba(255,255,255,.15)" }}><span style={{ color: "#FFD8DF" }}>Precio total</span><strong style={{ fontSize: "1.2rem" }}>${precio.toLocaleString("es-MX")}</strong></div>
              <div className="row" style={{ borderColor: "rgba(255,255,255,.15)" }}><span style={{ color: "#FFD8DF" }}>Anticipo (50%)</span><strong>${anticipo.toLocaleString("es-MX")}</strong></div>
              <div className="row" style={{ borderColor: "rgba(255,255,255,.15)" }}><span style={{ color: "#FFD8DF" }}>Saldo al entregar</span><strong>${(precio - anticipo).toLocaleString("es-MX")}</strong></div>
            </>
          ) : (
            <p style={{ color: "#FFD8DF" }}>Tu precio está en revisión. Te lo compartiremos muy pronto por este mismo enlace.</p>
          )}
          {vence && (
            <p style={{ fontSize: ".78rem", color: vencida ? "#FFB3BD" : "#FFD8DF", marginTop: 10, fontWeight: 700 }}>
              {vencida ? "⚠️ Esta cotización venció el " : "Válida hasta el "}
              {vence.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}.
            </p>
          )}
        </div>

        {/* Acciones */}
        {precio > 0 && !vencida && (
          yaConfirmado ? (
            <div style={{ ...card, borderColor: "var(--menta-deep, #6FC9A8)" }}>
              <h2 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.2rem" }}>¡Pedido confirmado! 🎉</h2>
              <p style={{ color: "var(--text-soft)", marginTop: 6 }}>
                Coordinaremos contigo el anticipo por {cot.confirmacionCliente?.metodo || "transferencia"}. ¡Gracias!
              </p>
            </div>
          ) : (
            <div style={card}>
              <h2 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.3rem", marginBottom: 12 }}>
                Aparta tu fecha con el 50%
              </h2>

              {/* Recomendado: crear cuenta + pagar en línea */}
              <div className="reco-card" style={{ position: "relative", border: "2px solid var(--rosa)", borderRadius: "var(--r-lg)", padding: "1.1rem 1.1rem 1.25rem", background: "var(--rosa-4,#FFF3F5)" }}>
                <span className="reco-badge">Recomendado</span>
                <h3 style={{ fontWeight: 800, color: "var(--burdeos)", fontSize: "1.02rem", marginBottom: 6 }}>
                  💳 Paga en línea
                </h3>
                <p style={{ fontSize: ".85rem", color: "var(--text-soft)", lineHeight: 1.5, marginBottom: 12 }}>
                  Crea tu cuenta para apartar tu fecha al instante, dar seguimiento a tu pedido
                  y pagar el resto contra entrega. ¡Es rápido!
                </p>
                {isLoggedIn ? (
                  <button className="btn" style={{ background: "var(--burdeos)", color: "#fff", width: "100%" }} onClick={() => setMostrarPago(true)}>
                    Continuar al pago
                  </button>
                ) : (
                  <>
                    <Link href={`/registrarse?next=${encodeURIComponent(`/cotizacion/ver/${token}`)}`}>
                      <button className="btn" style={{ background: "var(--burdeos)", color: "#fff", width: "100%" }}>
                        Crear cuenta y pagar
                      </button>
                    </Link>
                    <button
                      className="btn"
                      style={{ background: "transparent", color: "var(--burdeos)", width: "100%", marginTop: 8, fontWeight: 700, fontSize: ".82rem" }}
                      onClick={() => setMostrarPago(true)}
                    >
                      o continuar como invitado
                    </button>
                  </>
                )}
                {mostrarPago && (
                  <p style={{ fontSize: ".8rem", color: "var(--burdeos)", marginTop: 10, background: "#fff", padding: "8px 10px", borderRadius: 8 }}>
                    El pago en línea estará disponible en breve. Mientras tanto puedes apartar
                    con transferencia o efectivo abajo. 👇
                  </p>
                )}
              </div>

              {/* Transferencia / efectivo */}
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px dashed var(--border-color)" }}>
                <h3 style={{ fontWeight: 800, color: "var(--burdeos)", fontSize: "1.02rem", marginBottom: 6 }}>
                  🏦 Pagar el anticipo por transferencia o efectivo
                </h3>
                <p style={{ fontSize: ".85rem", color: "var(--text-soft)", marginBottom: 12 }}>
                  Confirma tu pedido y te enviamos los datos para depositar el 50%.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="btn" disabled={confirmando} style={{ background: "var(--rosa)", color: "#fff", flex: 1 }} onClick={() => confirmarTransferencia("transferencia")}>
                    Confirmar (transferencia)
                  </button>
                  <button className="btn" disabled={confirmando} style={{ background: "#fff", color: "var(--burdeos)", border: "1.5px solid var(--burdeos)", flex: 1 }} onClick={() => confirmarTransferencia("efectivo")}>
                    Confirmar (efectivo)
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <Link href="/" style={{ color: "var(--text-soft)", fontSize: ".85rem", marginTop: 24, display: "inline-block" }}>← Volver al inicio</Link>
    </Pantalla>
  );
}

const card = {
  background: "var(--bg-raised,#fff)",
  borderRadius: "var(--r-xl)",
  border: "1px solid var(--border-color)",
  boxShadow: "var(--shadow-sm)",
  padding: "1.25rem 1.4rem",
};

function Pantalla({ children, wide }) {
  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)" }}>
      <div aria-hidden="true" className="ru-pattern-sprinkle fixed inset-0 pointer-events-none" style={{ opacity: 0.06 }} />
      <main style={{ position: "relative", maxWidth: wide ? 640 : 520, margin: "0 auto", padding: "3.5rem 1.25rem 4rem" }}>
        {children}
      </main>
    </div>
  );
}
