import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Swal from "sweetalert2";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import VintagePreview from "@/src/components/vintage/VintagePreview";
import { sofia, nunito } from "@/src/lib/fonts";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const WA = "523329295129";

const money = (n) => `$${Number(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fechaLarga = (d) => {
  if (!d) return "Por confirmar";
  const dias  = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const f = new Date(d);
  return `${dias[f.getUTCDay()]} ${f.getUTCDate()} de ${meses[f.getUTCMonth()]}, ${f.getUTCFullYear()}`;
};

/**
 * Vista pública del pedido de Pastel Vintage. El cliente entra con el
 * enlace que le compartimos (sin cuenta), ve su pastel tal como lo armó y
 * puede liquidar el saldo pendiente en línea.
 */
export default function VerPedidoVintage() {
  const router = useRouter();
  const { token } = router.query;

  const [pedido, setPedido] = useState(null);
  const [cat, setCat] = useState({ porciones: [], pisos: [], formas: [], colores: [], decoraciones: [] });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [pagando, setPagando] = useState(false);
  // Reseña: solo disponible cuando el pedido ya se entregó.
  const [resena, setResena] = useState(null);
  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviandoResena, setEnviandoResena] = useState(false);
  const [resenaGuardada, setResenaGuardada] = useState(false);

  useEffect(() => {
    if (router.query.pago === "ok") {
      Swal.fire({ icon: "success", title: "¡Pago recibido!", text: "Gracias, tu pedido queda cubierto.", confirmButtonColor: "#FF6F7D", background: "#fff1f2", color: "#540027" });
    } else if (router.query.pago === "cancelado") {
      Swal.fire({ icon: "info", title: "Pago cancelado", text: "Puedes intentarlo cuando quieras.", confirmButtonColor: "#FF6F7D" });
    }
  }, [router.query.pago]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/vintage-pedidos/publico/${token}`)
      .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => {
        if (!ok) throw new Error(j.message || "No encontrado");
        setPedido(j.data);
        if (j.resena) { setResena(j.resena); setEstrellas(j.resena.rating); setComentario(j.resena.texto || ""); }
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [token, router.query.pago]);

  // Catálogos para reconstruir la imagen del pastel.
  useEffect(() => {
    const g = (p) => fetch(`${API_BASE}/${p}`).then((r) => r.json()).then((j) => j.data || []).catch(() => []);
    Promise.all([
      g("vintage-catalogos/porciones"), g("vintage-catalogos/pisos"), g("vintage-catalogos/formas"),
      g("vintage-catalogos/colores"), g("vintage-catalogos/decoraciones"),
    ]).then(([porciones, pisos, formas, colores, decoraciones]) =>
      setCat({ porciones, pisos, formas, colores, decoraciones }));
  }, []);

  const pagarSaldo = async () => {
    setPagando(true);
    try {
      const r = await fetch(`${API_BASE}/checkout/vintage-checkout`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, paymentOption: "saldo" }),
      });
      const j = await r.json();
      if (!r.ok || !j.url) throw new Error(j.message || "No se pudo iniciar el pago");
      window.location.href = j.url;
    } catch (e) {
      Swal.fire({ icon: "error", title: e.message, confirmButtonColor: "#FF6F7D" });
      setPagando(false);
    }
  };

  const enviarResena = async () => {
    if (!estrellas) {
      Swal.fire({ icon: "info", title: "Elige cuántas estrellas", timer: 1800, showConfirmButton: false });
      return;
    }
    setEnviandoResena(true);
    try {
      const r = await fetch(`${API_BASE}/vintage-pedidos/publico/${token}/resena`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: estrellas, texto: comentario }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "No se pudo guardar tu reseña");
      setResena({ rating: estrellas, texto: comentario });
      setResenaGuardada(true);
      Swal.fire({
        icon: "success", title: "¡Gracias por tu reseña!",
        text: "Nos ayuda muchísimo a seguir mejorando.",
        confirmButtonColor: "#FF6F7D", background: "#fff1f2", color: "#540027",
      });
    } catch (e) {
      Swal.fire({ icon: "error", title: e.message, confirmButtonColor: "#FF6F7D" });
    } finally {
      setEnviandoResena(false);
    }
  };

  if (cargando) return <Shell><p style={{ color: "var(--text-soft)" }}>Cargando tu pedido…</p></Shell>;
  if (error || !pedido) return (
    <Shell>
      <h1 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "2rem", marginBottom: 8 }}>No encontramos este pedido</h1>
      <p style={{ color: "var(--text-soft)", marginBottom: 16 }}>Verifica el enlace o escríbenos y con gusto te ayudamos.</p>
      <a href={`https://wa.me/${WA}`} style={{ display: "inline-block", padding: "12px 26px", background: "#25D366", color: "#fff", textDecoration: "none", borderRadius: 999, fontWeight: 700 }}>💬 WhatsApp</a>
    </Shell>
  );

  const saldo = Number(pedido.saldoPendiente) || 0;
  const pagado = Math.max(Number(pedido.total || 0) - saldo, 0);
  const cancelado = /^Cancelado/.test(pedido.status || "");

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", flexDirection: "column" }}>
      <style>{`@media (max-width: 880px){ .vv-grid { grid-template-columns: 1fr !important; } }`}</style>
      <NavbarAdmin />

      <main style={{ flexGrow: 1, maxWidth: 1000, width: "100%", margin: "0 auto", padding: "5.5rem 1.25rem 3rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--rosa)" }}>Pastel Vintage</p>
          <h1 className={sofia.className} style={{ fontSize: "clamp(2.2rem,5vw,3.4rem)", color: "var(--burdeos)", lineHeight: 1, margin: "6px 0 10px" }}>
            Hola {pedido.cliente?.nombre?.split(" ")[0] || ""}, aquí está tu pedido
          </h1>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "ui-monospace,monospace", fontSize: ".82rem", color: "var(--text-soft)", background: "#fff", padding: "6px 14px", borderRadius: 999, border: "1px solid var(--border-color)" }}>
            Número de orden · {pedido.numeroOrden || "—"}
          </span>
        </div>

        <div className="vv-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", alignItems: "start" }}>
          {/* Pastel + detalles */}
          <section style={{ background: "#fff", borderRadius: "var(--r-xl)", padding: "1.5rem", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-color)" }}>
            <VintagePreview seleccion={pedido.seleccion} cat={cat} vacio="🎂" />

            <h2 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.5rem", margin: "1.25rem 0 .5rem" }}>Tu pastel</h2>
            <Dato k="Porciones" v={pedido.seleccion?.porciones} />
            <Dato k="Entrega" v={pedido.envio?.tipo === "domicilio"
              ? `A domicilio · ${[pedido.envio?.direccion, pedido.envio?.colonia, pedido.envio?.municipio].filter(Boolean).join(", ")}`
              : "Recoger en el local"} />
            <Dato k="Fecha" v={fechaLarga(pedido.fecha)} />
            <Dato k="Hora" v={pedido.envio?.hora || "Por confirmar"} />
            {pedido.notas && <Dato k="Tus notas" v={pedido.notas} />}

            {/* Reseña: solo cuando el pastel ya se entregó. */}
            {pedido.status === "Entregado" && (
              <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border-color)" }}>
                <h3 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.4rem", marginBottom: 4 }}>
                  {resena ? "Tu reseña" : "¿Cómo te fue?"}
                </h3>
                <p style={{ fontSize: ".85rem", color: "var(--text-soft)", marginBottom: 12, lineHeight: 1.5 }}>
                  {resena
                    ? "Puedes cambiarla cuando quieras."
                    : "Tu opinión nos ayuda a mejorar y orienta a otros clientes."}
                </p>

                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setEstrellas(n)}
                      aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
                      style={{
                        background: "none", border: "none", cursor: "pointer", padding: 0,
                        fontSize: "1.9rem", lineHeight: 1,
                        filter: n <= estrellas ? "none" : "grayscale(1)",
                        opacity: n <= estrellas ? 1 : 0.35, transition: "all 140ms",
                      }}>⭐</button>
                  ))}
                </div>

                <textarea rows={4} value={comentario} maxLength={1000}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Cuéntanos qué te pareció (opcional)"
                  style={{
                    width: "100%", padding: "0.7rem 0.9rem", borderRadius: "var(--r-md)",
                    border: "1.5px solid var(--border-color)", fontFamily: "inherit",
                    fontSize: "0.9rem", resize: "vertical", background: "#fff",
                  }} />

                <button onClick={enviarResena} disabled={enviandoResena}
                  style={{
                    marginTop: 12, padding: "11px 28px", borderRadius: 999, border: "none",
                    background: "var(--burdeos)", color: "#fff", fontWeight: 800, fontSize: ".9rem",
                    cursor: enviandoResena ? "wait" : "pointer", opacity: enviandoResena ? 0.6 : 1,
                  }}>
                  {enviandoResena ? "Enviando…" : resena ? "Actualizar reseña" : "Enviar reseña"}
                </button>

                {resenaGuardada && (
                  <p style={{ marginTop: 10, fontSize: ".82rem", color: "#1D5A45", fontWeight: 700 }}>
                    ✓ Guardada. ¡Gracias!
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Pago */}
          <aside style={{ position: "sticky", top: 90, background: "#fff", borderRadius: "var(--r-xl)", padding: "1.5rem", boxShadow: "var(--shadow-md)", border: "1.5px solid var(--rosa)" }}>
            <h3 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.5rem", marginBottom: 10 }}>Tu pago</h3>

            <Fila k="Total del pedido" v={money(pedido.total)} />
            <Fila k="Pagado" v={money(pagado)} color="#1D5A45" />
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 6, borderTop: "2px solid var(--border-color)" }}>
              <strong style={{ color: saldo > 0 ? "#B23A48" : "#1D5A45" }}>{saldo > 0 ? "Saldo pendiente" : "Estado"}</strong>
              <strong style={{ color: saldo > 0 ? "#B23A48" : "#1D5A45", fontSize: "1.15rem" }}>
                {saldo > 0 ? money(saldo) : "Pagado ✓"}
              </strong>
            </div>

            {cancelado ? (
              <p style={{ marginTop: 14, fontSize: ".85rem", color: "var(--text-soft)" }}>Este pedido está cancelado. Escríbenos si necesitas ayuda.</p>
            ) : saldo > 0 ? (
              <>
                <button onClick={pagarSaldo} disabled={pagando}
                  style={{ width: "100%", marginTop: 16, padding: "0.9rem 1.5rem", borderRadius: 999, border: "none", background: "var(--burdeos)", color: "#fff", fontWeight: 800, fontSize: ".95rem", cursor: pagando ? "wait" : "pointer", opacity: pagando ? .6 : 1 }}>
                  {pagando ? "Redirigiendo…" : `Pagar saldo · ${money(saldo)}`}
                </button>
                <p style={{ fontSize: ".72rem", color: "var(--text-soft)", marginTop: 8, textAlign: "center" }}>
                  Pago seguro con Stripe. También puedes liquidarlo por transferencia — escríbenos.
                </p>
              </>
            ) : (
              <p style={{ marginTop: 14, fontSize: ".85rem", color: "#1D5A45", fontWeight: 700 }}>
                ¡Todo listo! Tu pedido está pagado por completo.
              </p>
            )}

            <a href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hola, mi pedido es ${pedido.numeroOrden || ""}`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: "block", textAlign: "center", marginTop: 12, padding: "10px 20px", background: "#25D366", color: "#fff", textDecoration: "none", borderRadius: 999, fontWeight: 700, fontSize: ".88rem" }}>
              💬 Contactar por WhatsApp
            </a>
          </aside>
        </div>
      </main>

      <WebFooter />
    </div>
  );
}

function Dato({ k, v }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px dashed var(--border-color)", fontSize: ".9rem" }}>
      <span style={{ color: "var(--text-soft)" }}>{k}</span>
      <strong style={{ color: "var(--burdeos)", textAlign: "right", maxWidth: "62%" }}>{v || "—"}</strong>
    </div>
  );
}

function Fila({ k, v, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: ".88rem" }}>
      <span style={{ color: "var(--text-soft)" }}>{k}</span>
      <strong style={{ color: color || "var(--burdeos)" }}>{v}</strong>
    </div>
  );
}

function Shell({ children }) {
  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)" }}>
      <NavbarAdmin />
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "7rem 1.25rem", textAlign: "center" }}>{children}</main>
    </div>
  );
}
