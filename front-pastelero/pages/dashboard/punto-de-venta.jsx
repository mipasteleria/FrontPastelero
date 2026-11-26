import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { useAuth } from "@/src/context";
import { poppins, sofia } from "@/src/lib/fonts";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const money = (n) =>
  `$${Number(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * Punto de venta para el mostrador.
 *
 * Pensado para cobrar rápido y de pie: se toca el producto para agregarlo,
 * se elige cómo pagó y se registra. El cobro en sí ocurre fuera —efectivo
 * en caja o la terminal de Mercado Pago—, aquí solo queda el registro.
 *
 * El precio NUNCA se manda desde aquí para los productos del catálogo: el
 * servidor usa el suyo. Esta pantalla la opera personal de mostrador, y
 * el precio no debe depender de lo que llegue del navegador.
 */
export default function PuntoDeVenta() {
  const { userToken, isLoggedIn, loading } = useAuth();
  const authHeader = useMemo(
    () => (userToken ? { Authorization: `Bearer ${userToken}` } : {}),
    [userToken]
  );

  const [catalogo, setCatalogo] = useState({ galletas: [], postres: [] });
  const [cargando, setCargando] = useState(true);
  const [carrito, setCarrito] = useState([]);
  const [carritoCargado, setCarritoCargado] = useState(false);
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [efectivoRecibido, setEfectivoRecibido] = useState("");
  const [referencia, setReferencia] = useState("");
  const [descuento, setDescuento] = useState("");
  const [cobrando, setCobrando] = useState(false);
  const [corte, setCorte] = useState(null);
  const [ultima, setUltima] = useState(null);

  // Concepto libre
  const [libreNombre, setLibreNombre] = useState("");
  const [librePrecio, setLibrePrecio] = useState("");

  const cargarCatalogo = useCallback(async () => {
    if (!userToken) return;
    try {
      const r = await fetch(`${API_BASE}/ventas-mostrador/catalogo`, { headers: authHeader });
      if (!r.ok) throw new Error("No se pudo cargar el catálogo");
      const j = await r.json();
      setCatalogo(j.data || { galletas: [], postres: [] });
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  }, [userToken, authHeader]);

  const cargarCorte = useCallback(async () => {
    if (!userToken) return;
    try {
      const r = await fetch(`${API_BASE}/ventas-mostrador`, { headers: authHeader });
      if (!r.ok) return;
      const j = await r.json();
      setCorte(j.corte || null);
    } catch { /* el corte es informativo */ }
  }, [userToken, authHeader]);

  useEffect(() => { cargarCatalogo(); cargarCorte(); }, [cargarCatalogo, cargarCorte]);

  // ── La venta en curso sobrevive a recargas ──
  //
  // En el mostrador una recarga, un cierre de sesión o un navegador que
  // se cierra solo no deben obligar a recapturar lo que el cliente ya
  // puso en el mostrador. Se guarda en el navegador y se limpia al
  // cobrar.
  useEffect(() => {
    try {
      const guardado = localStorage.getItem("pos:venta");
      if (guardado) {
        const items = JSON.parse(guardado);
        if (Array.isArray(items) && items.length > 0) setCarrito(items);
      }
    } catch { /* si está corrupto, se empieza en blanco */ }
    setCarritoCargado(true);
  }, []);

  useEffect(() => {
    if (!carritoCargado) return; // no pisar lo guardado antes de leerlo
    try {
      if (carrito.length > 0) localStorage.setItem("pos:venta", JSON.stringify(carrito));
      else localStorage.removeItem("pos:venta");
    } catch { /* sin almacenamiento, el POS sigue funcionando */ }
  }, [carrito, carritoCargado]);

  const agregar = (p) => {
    setCarrito((c) => {
      const i = c.findIndex((x) => x.tipo === p.tipo && String(x.refId) === String(p.refId));
      if (i >= 0) {
        const copia = [...c];
        copia[i] = { ...copia[i], cantidad: copia[i].cantidad + 1 };
        return copia;
      }
      return [...c, { tipo: p.tipo, refId: p.refId, nombre: p.nombre, precioUnitario: p.precio, cantidad: 1, stock: p.stock }];
    });
  };

  const cambiarCantidad = (idx, delta) =>
    setCarrito((c) =>
      c.map((x, i) => (i === idx ? { ...x, cantidad: Math.max(1, x.cantidad + delta) } : x))
    );
  const quitar = (idx) => setCarrito((c) => c.filter((_, i) => i !== idx));

  const agregarLibre = () => {
    const precio = Number(librePrecio);
    if (!libreNombre.trim() || !Number.isFinite(precio) || precio <= 0) {
      return Swal.fire({ icon: "info", title: "Falta nombre o precio", timer: 1800, showConfirmButton: false, background: "#fff1f2", color: "#540027" });
    }
    setCarrito((c) => [...c, { tipo: "libre", refId: null, nombre: libreNombre.trim(), precioUnitario: precio, cantidad: 1, stock: null }]);
    setLibreNombre(""); setLibrePrecio("");
  };

  const subtotal = carrito.reduce((a, x) => a + x.precioUnitario * x.cantidad, 0);
  const desc = Math.max(0, Number(descuento) || 0);
  const total = Math.max(0, subtotal - desc);
  const recibido = Number(efectivoRecibido);
  const cambio = metodoPago === "efectivo" && Number.isFinite(recibido) ? recibido - total : null;
  const faltaEfectivo = metodoPago === "efectivo" && efectivoRecibido !== "" && cambio < 0;

  const limpiar = () => {
    setCarrito([]); setEfectivoRecibido(""); setReferencia(""); setDescuento("");
  };

  const cobrar = async () => {
    if (carrito.length === 0) return;
    if (faltaEfectivo) {
      return Swal.fire({ icon: "warning", title: "El efectivo no alcanza", text: `Faltan ${money(Math.abs(cambio))}`, background: "#fff1f2", color: "#540027" });
    }
    setCobrando(true);
    try {
      const r = await fetch(`${API_BASE}/ventas-mostrador`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({
          metodoPago,
          // Para el catálogo solo va la referencia y la cantidad: el
          // precio lo pone el servidor.
          items: carrito.map((x) =>
            x.tipo === "libre"
              ? { tipo: "libre", nombre: x.nombre, precioUnitario: x.precioUnitario, cantidad: x.cantidad }
              : { tipo: x.tipo, refId: x.refId, cantidad: x.cantidad }
          ),
          descuento: desc || 0,
          efectivoRecibido: metodoPago === "efectivo" && efectivoRecibido !== "" ? recibido : null,
          referencia: metodoPago === "terminal" ? referencia : "",
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "No se pudo registrar la venta");

      setUltima(j.data);
      limpiar();
      await Promise.all([cargarCatalogo(), cargarCorte()]);
      Swal.fire({
        icon: "success",
        title: `Venta registrada · ${money(j.data.total)}`,
        html: j.data.cambio != null ? `Cambio: <strong>${money(j.data.cambio)}</strong>` : j.data.numeroOrden,
        timer: 2600,
        showConfirmButton: false,
        background: "#fff1f2",
        color: "#540027",
      });
    } catch (e) {
      Swal.fire({ icon: "error", title: "No se registró", text: String(e.message || e), background: "#fff1f2", color: "#540027" });
    } finally {
      setCobrando(false);
    }
  };

  if (loading) return null;
  if (!isLoggedIn) return null;

  const productos = [...catalogo.galletas, ...catalogo.postres];

  return (
    <div className={poppins.className}>
      <NavbarAdmin />
      <div className="flex">
        <Asideadmin />
        <main className="flex-1 p-4 md:p-6" style={{ background: "var(--bg-sunken)", minHeight: "100vh" }}>
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
            <h1 className={sofia.className} style={{ fontSize: "2.2rem", color: "var(--burdeos)" }}>
              Punto de venta
            </h1>
            {corte && (
              <div className="text-xs text-right" style={{ color: "var(--text-soft)" }}>
                <div>Hoy: <strong>{corte.ventas}</strong> ventas · <strong>{money(corte.total)}</strong></div>
                <div style={{ color: "var(--text-muted)" }}>
                  Efectivo {money(corte.efectivo)} · Terminal {money(corte.terminal)}
                </div>
              </div>
            )}
          </div>

          <div className="pos-grid">
            {/* ── Productos ── */}
            <section>
              {cargando ? (
                <p className="text-sm text-gray-500">Cargando productos…</p>
              ) : (
                <div className="prod-grid">
                  {productos.map((p) => {
                    const agotado = p.stock != null && p.stock <= 0;
                    return (
                      <button
                        key={`${p.tipo}-${p.refId}`}
                        type="button"
                        disabled={agotado}
                        onClick={() => agregar(p)}
                        className="prod"
                      >
                        {p.imagen ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.imagen} alt={p.nombre} />
                        ) : (
                          <span className="emoji">{p.emoji || "🍰"}</span>
                        )}
                        <span className="nom">{p.nombre}</span>
                        <span className="pre">{money(p.precio)}</span>
                        {p.stock != null && (
                          <span className={`stk ${p.stock <= 5 ? "bajo" : ""}`}>
                            {agotado ? "agotado" : `${p.stock} disp.`}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Concepto libre: lo que se vende pero no está dado de alta */}
              <div className="libre">
                <span className="lbl">Concepto libre</span>
                <input
                  placeholder="Ej. Rebanada de pastel"
                  value={libreNombre}
                  onChange={(e) => setLibreNombre(e.target.value)}
                />
                <input
                  type="number" min="0" step="0.5" inputMode="decimal" placeholder="$"
                  value={librePrecio}
                  onChange={(e) => setLibrePrecio(e.target.value)}
                  style={{ maxWidth: 110 }}
                />
                <button type="button" onClick={agregarLibre}>Agregar</button>
              </div>
            </section>

            {/* ── Cobro ── */}
            <aside className="cobro">
              <h2 className="tit">Venta</h2>

              {carrito.length === 0 ? (
                <p className="vacio">Toca un producto para empezar.</p>
              ) : (
                <div className="lista">
                  {carrito.map((x, i) => (
                    <div className="row" key={i}>
                      <div className="info">
                        <span className="n">{x.nombre}</span>
                        <span className="u">{money(x.precioUnitario)} c/u</span>
                      </div>
                      <div className="qty">
                        <button type="button" onClick={() => cambiarCantidad(i, -1)}>−</button>
                        <span>{x.cantidad}</span>
                        <button
                          type="button"
                          onClick={() => cambiarCantidad(i, 1)}
                          disabled={x.stock != null && x.cantidad >= x.stock}
                        >+</button>
                      </div>
                      <span className="sub">{money(x.precioUnitario * x.cantidad)}</span>
                      <button type="button" className="del" onClick={() => quitar(i)}>×</button>
                    </div>
                  ))}
                </div>
              )}

              {carrito.length > 0 && (
                <>
                  <div className="linea"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
                  <div className="linea">
                    <span>Descuento</span>
                    <input
                      type="number" min="0" step="1" inputMode="decimal" placeholder="0"
                      value={descuento} onChange={(e) => setDescuento(e.target.value)}
                      style={{ width: 90, textAlign: "right" }}
                    />
                  </div>
                  <div className="total"><span>Total</span><strong>{money(total)}</strong></div>

                  <div className="metodos">
                    <button
                      type="button"
                      className={metodoPago === "efectivo" ? "on" : ""}
                      onClick={() => setMetodoPago("efectivo")}
                    >💵 Efectivo</button>
                    <button
                      type="button"
                      className={metodoPago === "terminal" ? "on" : ""}
                      onClick={() => setMetodoPago("terminal")}
                    >💳 Terminal</button>
                  </div>

                  {metodoPago === "efectivo" ? (
                    <>
                      <label className="campo">
                        <span>Con cuánto paga</span>
                        <input
                          type="number" min="0" step="1" inputMode="decimal" placeholder={String(Math.ceil(total))}
                          value={efectivoRecibido}
                          onChange={(e) => setEfectivoRecibido(e.target.value)}
                        />
                      </label>
                      {efectivoRecibido !== "" && (
                        <div className={`cambio ${faltaEfectivo ? "falta" : ""}`}>
                          {faltaEfectivo
                            ? <>Faltan <strong>{money(Math.abs(cambio))}</strong></>
                            : <>Cambio <strong>{money(cambio)}</strong></>}
                        </div>
                      )}
                    </>
                  ) : (
                    <label className="campo">
                      <span>Folio de la terminal <em>(opcional)</em></span>
                      <input
                        placeholder="Para conciliar con Mercado Pago"
                        value={referencia}
                        onChange={(e) => setReferencia(e.target.value)}
                      />
                    </label>
                  )}

                  <button type="button" className="cobrar" onClick={cobrar} disabled={cobrando}>
                    {cobrando ? "Registrando…" : `Cobrar ${money(total)}`}
                  </button>
                  <button type="button" className="limpiar" onClick={limpiar}>Limpiar venta</button>
                </>
              )}

              {ultima && carrito.length === 0 && (
                <div className="ultima">
                  Última: <strong>{ultima.numeroOrden}</strong> · {money(ultima.total)}
                  {ultima.cambio != null && <> · cambio {money(ultima.cambio)}</>}
                </div>
              )}
            </aside>
          </div>

          <style jsx>{`
            .pos-grid { display:grid; grid-template-columns: 1fr 360px; gap:1.25rem; align-items:start; }
            @media (max-width: 900px) { .pos-grid { grid-template-columns: 1fr; } }

            .prod-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(140px,1fr)); gap:10px; }
            .prod {
              background:#fff; border:1px solid var(--border-color); border-radius:14px;
              padding:10px; display:flex; flex-direction:column; align-items:center; gap:4px;
              cursor:pointer; transition:all 140ms; text-align:center; min-height:132px;
            }
            .prod:hover:not(:disabled) { border-color:var(--rosa); transform:translateY(-2px); box-shadow:var(--shadow-sm); }
            .prod:disabled { opacity:.45; cursor:not-allowed; }
            .prod img { width:56px; height:56px; object-fit:cover; border-radius:10px; }
            .prod .emoji { font-size:2rem; line-height:1; }
            .prod .nom { font-size:.76rem; font-weight:700; color:var(--color-text); line-height:1.25; }
            .prod .pre { font-size:.95rem; font-weight:800; color:var(--burdeos); }
            .prod .stk { font-size:.62rem; color:var(--text-muted); }
            .prod .stk.bajo { color:#B4484B; font-weight:700; }

            .libre { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:14px;
              background:#fff; border:1px dashed var(--border-strong); border-radius:12px; padding:10px 12px; }
            .libre .lbl { font-size:.72rem; font-weight:800; color:var(--text-soft); text-transform:uppercase; letter-spacing:.05em; }
            .libre input { flex:1; min-width:120px; border:1px solid var(--border-color); border-radius:8px; padding:6px 10px; font-size:.85rem; }
            .libre button { background:var(--burdeos); color:#fff; border:none; border-radius:999px; padding:6px 16px; font-size:.8rem; font-weight:700; cursor:pointer; }

            .cobro { background:#fff; border:1px solid var(--border-color); border-radius:16px; padding:1rem; position:sticky; top:16px; }
            .cobro .tit { font-weight:800; color:var(--burdeos); margin-bottom:10px; }
            .vacio { font-size:.85rem; color:var(--text-muted); }
            .lista { display:flex; flex-direction:column; gap:6px; max-height:38vh; overflow:auto; margin-bottom:10px; }
            .row { display:grid; grid-template-columns:1fr auto auto auto; gap:8px; align-items:center; font-size:.82rem; }
            .row .info { display:flex; flex-direction:column; min-width:0; }
            .row .n { font-weight:700; color:var(--color-text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
            .row .u { font-size:.68rem; color:var(--text-muted); }
            .qty { display:flex; align-items:center; gap:6px; }
            .qty button { width:24px; height:24px; border-radius:50%; border:1px solid var(--border-color); background:#fff; cursor:pointer; font-weight:800; line-height:1; }
            .qty button:disabled { opacity:.35; cursor:not-allowed; }
            .row .sub { font-weight:800; color:var(--burdeos); min-width:62px; text-align:right; }
            .row .del { background:none; border:none; color:#B4484B; cursor:pointer; font-size:1rem; }

            .linea { display:flex; justify-content:space-between; align-items:center; font-size:.85rem; padding:3px 0; color:var(--text-soft); }
            .linea input { border:1px solid var(--border-color); border-radius:8px; padding:3px 8px; font-size:.85rem; }
            .total { display:flex; justify-content:space-between; align-items:baseline; border-top:2px solid var(--rosa);
              margin-top:6px; padding-top:8px; font-size:1.05rem; color:var(--burdeos); font-weight:800; }
            .total strong { font-size:1.5rem; }

            .metodos { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin:12px 0 8px; }
            .metodos button { border:1.5px solid var(--border-color); background:#fff; border-radius:10px; padding:9px; font-size:.85rem; font-weight:700; cursor:pointer; }
            .metodos button.on { border-color:var(--burdeos); background:var(--burdeos); color:#fff; }

            .campo { display:block; margin-bottom:8px; }
            .campo span { display:block; font-size:.72rem; font-weight:700; color:var(--text-soft); margin-bottom:3px; }
            .campo em { font-weight:400; color:var(--text-muted); }
            .campo input { width:100%; border:1px solid var(--border-color); border-radius:10px; padding:9px 12px; font-size:1rem; }

            .cambio { background:#DCF5E9; color:#1D5A45; border-radius:10px; padding:8px 12px; font-size:.9rem; margin-bottom:8px; }
            .cambio.falta { background:#FDECEC; color:#8A2B2B; }
            .cambio strong { font-size:1.15rem; }

            .cobrar { width:100%; background:var(--burdeos); color:#fff; border:none; border-radius:12px;
              padding:13px; font-size:1rem; font-weight:800; cursor:pointer; }
            .cobrar:disabled { opacity:.6; cursor:not-allowed; }
            .limpiar { width:100%; background:none; border:none; color:var(--text-muted); font-size:.75rem; margin-top:6px; cursor:pointer; }
            .ultima { font-size:.75rem; color:var(--text-muted); margin-top:10px; padding-top:8px; border-top:1px dashed var(--border-color); }
          `}</style>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}
