import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import Swal from "sweetalert2";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

const API_BASE   = process.env.NEXT_PUBLIC_API_BASE_URL;
const WA_NUMBER  = "523741025036"; // 52 (México) + número
const WA_LINK_CUSTOM = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  "Hola, quisiera hacer un pedido especial de Galletas NY (sabor o cantidad personalizada)."
)}`;

const SIZES = [
  { label: "Media docena", count: 6,  key: "6"  },
  { label: "Docena",       count: 12, key: "12" },
];

/* ─── Box helpers ────────────────────────────────────────────── */
const emptyBox = () => ({ size: "12", quantities: {} });

function getBoxData(box, saboresMap) {
  const size    = box.size === "6" ? 6 : 12;
  const filled  = Object.values(box.quantities).reduce((s, v) => s + v, 0);
  const items   = Object.entries(box.quantities)
    .filter(([_, q]) => q > 0)
    .map(([slug, q]) => ({ slug, qty: q, sabor: saboresMap[slug] }));
  const subtotal = items.reduce((s, it) => s + (it.sabor?.precio || 0) * it.qty, 0);
  const discount = box.size === "12" && filled === 12 ? 30 : 0;
  return { size, filled, items, subtotal, discount, total: subtotal - discount };
}

/* ─── Component ──────────────────────────────────────────────── */
export default function GalletasNY() {
  const router = useRouter();

  const [sabores, setSabores]               = useState([]);
  const [loadingSabores, setLoadingSabores] = useState(true);
  const [error, setError]                   = useState("");

  const [boxes, setBoxes]                       = useState([emptyBox()]);
  const [activeBoxIndex, setActiveBoxIndex]     = useState(0);

  /* ── Fetch sabores from backend ── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/galletaSabores`);
        if (!cancelled) {
          setSabores(res.data.data || []);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError("No pudimos cargar los sabores. Intenta de nuevo.");
          console.error(err);
        }
      } finally {
        if (!cancelled) setLoadingSabores(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ── Lookup map slug → sabor (for box totals) ── */
  const saboresMap = Object.fromEntries(sabores.map((s) => [s.slug, s]));

  /* ── Restore cart from localStorage on mount (if any) ── */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("galletasCart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed?.boxes) && parsed.boxes.length) {
          setBoxes(parsed.boxes);
          setActiveBoxIndex(0);
        }
      }
    } catch {}
  }, []);

  /* ── Persist cart on change ── */
  useEffect(() => {
    try {
      localStorage.setItem("galletasCart", JSON.stringify({ boxes }));
    } catch {}
  }, [boxes]);

  /* ── Derived from active box ── */
  const currentBox = boxes[activeBoxIndex] || emptyBox();
  const { size: boxSize, filled } = getBoxData(currentBox, saboresMap);
  const quantities = currentBox.quantities;
  const remaining  = boxSize - filled;

  /* ── Slots visualization (which sabor occupies each slot) ── */
  const slots = Array.from({ length: boxSize }, (_, i) => {
    let cum = 0;
    for (const s of sabores) {
      const q = quantities[s.slug] || 0;
      if (i < cum + q) return s;
      cum += q;
    }
    return null;
  });

  /* ── Grand total ── */
  const grandTotal = boxes.reduce((s, b) => s + getBoxData(b, saboresMap).total, 0);
  const totalCajas = boxes.length;
  const totalPiezas = boxes.reduce(
    (s, b) => s + Object.values(b.quantities).reduce((x, v) => x + v, 0),
    0
  );
  const allBoxesFull = boxes.every((b) => {
    const f = Object.values(b.quantities).reduce((x, v) => x + v, 0);
    return f === (b.size === "6" ? 6 : 12);
  });
  const anyBoxStarted = boxes.some((b) => Object.values(b.quantities).some((v) => v > 0));

  /* ── Stock check: cumulative across ALL boxes ── */
  const cumulativeBySlug = {};
  boxes.forEach((b) => {
    Object.entries(b.quantities).forEach(([slug, q]) => {
      cumulativeBySlug[slug] = (cumulativeBySlug[slug] || 0) + q;
    });
  });

  /* ── Actions ── */
  const changeSize = (newSizeKey) => {
    const newSize = newSizeKey === "6" ? 6 : 12;
    const keeps   = filled <= newSize;
    setBoxes((prev) => {
      const next = [...prev];
      next[activeBoxIndex] = {
        ...next[activeBoxIndex],
        size: newSizeKey,
        quantities: keeps ? quantities : {},
      };
      return next;
    });
  };

  const add = (sabor) => {
    if (filled >= boxSize) return;
    if (!sabor || sabor.stock <= 0) return;

    const usedTotal = cumulativeBySlug[sabor.slug] || 0;
    if (usedTotal >= sabor.stock) {
      Swal.fire({
        icon: "info",
        title: "Sin más existencias",
        text: `Solo quedan ${sabor.stock} pieza${sabor.stock === 1 ? "" : "s"} de ${sabor.nombre} y ya están todas en tus cajas.`,
        timer: 2500, showConfirmButton: false,
        background: "#fff1f2", color: "#540027",
      });
      return;
    }

    setBoxes((prev) => {
      const next = [...prev];
      const q = { ...next[activeBoxIndex].quantities };
      q[sabor.slug] = (q[sabor.slug] || 0) + 1;
      next[activeBoxIndex] = { ...next[activeBoxIndex], quantities: q };
      return next;
    });
  };

  const remove = (slug) => {
    setBoxes((prev) => {
      const next = [...prev];
      const q = { ...next[activeBoxIndex].quantities };
      if (!q[slug]) return prev;
      q[slug] -= 1;
      if (q[slug] <= 0) delete q[slug];
      next[activeBoxIndex] = { ...next[activeBoxIndex], quantities: q };
      return next;
    });
  };

  const addBox = () => {
    const newIndex = boxes.length;
    setBoxes((prev) => [...prev, emptyBox()]);
    setActiveBoxIndex(newIndex);
  };

  const removeBox = (index) => {
    if (boxes.length === 1) return;
    setBoxes((prev) => prev.filter((_, i) => i !== index));
    setActiveBoxIndex((prev) => Math.min(prev, boxes.length - 2));
  };

  /* ── Add to cart → go to checkout ── */
  const handleAddToCart = () => {
    if (!anyBoxStarted) {
      return Swal.fire({
        icon: "info",
        title: "Tu caja está vacía",
        text: "Agrega galletas a tu caja antes de continuar.",
        timer: 2200, showConfirmButton: false,
        background: "#fff1f2", color: "#540027",
      });
    }
    if (!allBoxesFull) {
      return Swal.fire({
        icon: "warning",
        title: "Caja incompleta",
        html: `Para agregar al carrito, todas tus cajas deben estar <strong>completamente llenas</strong>. Tienes ${totalPiezas} galleta${totalPiezas === 1 ? "" : "s"} pero falta${remaining === 1 ? "" : "n"} ${remaining} en la caja activa.`,
        confirmButtonText: "Entendido",
        confirmButtonColor: "#FF6F7D",
        background: "#fff1f2", color: "#540027",
      });
    }
    // Persist already done by useEffect — just navigate
    router.push("/enduser/galletas-checkout");
  };

  /* ── Render ── */
  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", flexDirection: "column" }}>
      <style>{`
        .flav-card { transition: all 280ms cubic-bezier(.2,.8,.2,1); }
        .flav-card:hover { transform: translateY(-6px); box-shadow: 0 16px 36px rgba(84,0,39,.16); }
        .flav-card.disabled:hover { transform: none; box-shadow: var(--shadow-sm); }
        .add-circle:hover:not(:disabled) { background: var(--rosa) !important; }
        .box-tab:hover { border-color: var(--burdeos) !important; }
        @media (max-width: 900px) {
          .ny-grid { grid-template-columns: 1fr !important; }
          .box-wrap-sticky { position: relative !important; top: auto !important; }
        }
        @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>

      <div aria-hidden="true" className="ru-pattern-sprinkle fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.06 }} />
      <NavbarAdmin />

      <main className="flex-grow relative z-10" style={{ marginTop: "4rem" }}>

        {/* ── Page header ── */}
        <div style={{ textAlign: "center", padding: "2.5rem 1.25rem 0", maxWidth: 820, margin: "0 auto" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--rosa)", marginBottom: 8 }}>
            Galletas NY · Mega, suaves, rellenas
          </p>
          <h1 className={sofia.className} style={{ fontSize: "clamp(2.5rem,6vw,5rem)", color: "var(--burdeos)", lineHeight: 1, marginBottom: 12 }}>
            Arma tu caja
          </h1>
          <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: "0.95rem", maxWidth: "50ch", margin: "0 auto 1.25rem" }}>
            Elige tamaño y llénala con los sabores que más se te antojen. Las preparamos frescas el día de tu entrega.
          </p>

          {/* ZMG + 72h notices */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: "1.75rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-raised)", border: "1px solid var(--border-color)", borderRadius: "var(--r-pill)", padding: "7px 18px", fontSize: "0.78rem", color: "var(--text-soft)", boxShadow: "var(--shadow-xs)" }}>
              <span style={{ fontSize: "1rem" }}>📍</span>
              <span><strong style={{ color: "var(--burdeos)" }}>Solo Zona Metro GDL.</strong> No envíos nacionales.</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-raised)", border: "1px solid var(--border-color)", borderRadius: "var(--r-pill)", padding: "7px 18px", fontSize: "0.78rem", color: "var(--text-soft)", boxShadow: "var(--shadow-xs)" }}>
              <span style={{ fontSize: "1rem" }}>⏱️</span>
              <span><strong style={{ color: "var(--burdeos)" }}>72 h de anticipación.</strong> Lun a Sáb 10:00–18:30.</span>
            </div>
          </div>

          {/* ── Size tabs — apply to active box ── */}
          <div style={{ marginBottom: "0.5rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>
            Tamaño — Caja {activeBoxIndex + 1}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
            {SIZES.map((sz) => {
              const isActive = currentBox.size === sz.key;
              return (
                <button
                  key={sz.key}
                  onClick={() => changeSize(sz.key)}
                  style={{ padding: "12px 28px", borderRadius: "var(--r-pill)", border: "2px solid", borderColor: isActive ? "var(--rosa)" : "var(--border-color)", background: isActive ? "var(--rosa)" : "var(--bg-raised)", color: isActive ? "#fff" : "var(--text-soft)", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-nunito)", transition: "all 150ms" }}
                >
                  {sz.label}
                  <span style={{ padding: "2px 8px", borderRadius: "var(--r-pill)", fontSize: "0.7rem", background: isActive ? "rgba(255,255,255,.2)" : "var(--rosa-4)", color: isActive ? "#fff" : "var(--burdeos)", fontWeight: 700 }}>{sz.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="ny-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem 3rem", display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.75rem", alignItems: "start" }}>

          {/* ── Flavors panel ── */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <h2 style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--burdeos)" }}>
                Elige tus sabores
                <span style={{ marginLeft: 8, fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)" }}>
                  — Caja {activeBoxIndex + 1} ({filled}/{boxSize})
                </span>
              </h2>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                Click en <strong style={{ color: "var(--rosa)" }}>+</strong> para agregar
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
              Cada galleta pesa ~120 g. Chocolate belga.
            </p>

            {error && (
              <div style={{ background: "#fff1f2", border: "1px solid var(--rosa)", borderRadius: "var(--r-md)", padding: "1rem", color: "var(--burdeos)", marginBottom: "1rem" }}>
                {error}
              </div>
            )}

            {loadingSabores ? (
              <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                Cargando sabores…
              </div>
            ) : sabores.length === 0 ? (
              <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "3rem", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: 6 }}>😴</div>
                <p style={{ color: "var(--burdeos)", fontWeight: 700 }}>No hay sabores disponibles por ahora</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 6 }}>Vuelve más tarde o contáctanos por WhatsApp para un pedido especial.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: "1rem" }}>
                {sabores.map((f) => {
                  const qtyInActive = quantities[f.slug] || 0;
                  const usedTotal   = cumulativeBySlug[f.slug] || 0;
                  const stockLeft   = (f.stock || 0) - usedTotal;
                  const agotado     = (f.stock || 0) <= 0;
                  const sinMas      = stockLeft <= 0; // ya tomé todo lo que hay
                  const pocas       = !agotado && (f.stock < 6);
                  const cardDisabled = agotado;

                  return (
                    <div key={f._id || f.slug} className={`flav-card ${cardDisabled ? "disabled" : ""}`} style={{
                      background: "var(--bg-raised)",
                      borderRadius: "var(--r-xl)",
                      padding: "1rem",
                      boxShadow: "var(--shadow-sm)",
                      cursor: cardDisabled ? "not-allowed" : "pointer",
                      position: "relative",
                      overflow: "hidden",
                      border: qtyInActive > 0 ? "2px solid var(--rosa)" : "2px solid transparent",
                      opacity: cardDisabled ? 0.5 : 1,
                      filter: cardDisabled ? "grayscale(0.5)" : "none",
                    }}>
                      {/* Qty badge (active box) */}
                      {qtyInActive > 0 && (
                        <div style={{ position: "absolute", top: 10, left: 10, width: 26, height: 26, borderRadius: "50%", background: "var(--rosa)", color: "#fff", fontWeight: 800, fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-sm)" }}>{qtyInActive}</div>
                      )}

                      {/* Stock state badge */}
                      {agotado ? (
                        <div style={{ position: "absolute", top: 10, right: 10, background: "#9c2a44", color: "#fff", fontSize: "0.65rem", fontWeight: 700, padding: "3px 8px", borderRadius: "var(--r-pill)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Agotado</div>
                      ) : pocas ? (
                        <div style={{ position: "absolute", top: 10, right: 10, background: "#FFE99B", color: "#6B4F1A", fontSize: "0.65rem", fontWeight: 700, padding: "3px 8px", borderRadius: "var(--r-pill)" }}>¡Quedan pocas!</div>
                      ) : f.tag ? (
                        <div style={{ position: "absolute", top: 10, right: 10, background: f.tagColor || "var(--rosa)", color: f.tagText || "#fff", fontSize: "0.65rem", fontWeight: 700, padding: "3px 8px", borderRadius: "var(--r-pill)" }}>{f.tag}</div>
                      ) : null}

                      {/* Image / emoji */}
                      <div style={{ width: "80%", aspectRatio: "1/1", borderRadius: "50%", background: f.imagen ? "transparent" : (f.bg || "linear-gradient(135deg,#FFE2E7,#FFC3C9)"), margin: "0 auto 0.75rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", position: "relative", overflow: "hidden" }}>
                        <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0" style={{ opacity: 0.3 }} />
                        {f.imagen ? (
                          <img src={f.imagen} alt={f.nombre} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                        ) : (
                          <span style={{ position: "relative", zIndex: 1 }}>{f.emoji || "🍪"}</span>
                        )}
                      </div>

                      <h4 style={{ fontWeight: 700, fontSize: "0.9rem", textAlign: "center", marginBottom: 2 }}>{f.nombre}</h4>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center", marginBottom: pocas ? 4 : "0.75rem" }}>{f.descripcion || "Chocolate belga"}</p>

                      {/* Stock info — solo si pocas o agotadas */}
                      {agotado && (
                        <p style={{ fontSize: "0.72rem", color: "#9c2a44", textAlign: "center", marginBottom: "0.75rem", fontWeight: 700 }}>Sin existencias</p>
                      )}
                      {pocas && (
                        <p style={{ fontSize: "0.7rem", color: "#a06d10", textAlign: "center", marginBottom: "0.75rem" }}>Solo quedan <strong>{f.stock}</strong> piezas</p>
                      )}

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-soft)", fontWeight: 700 }}>${f.precio} c/u</span>
                        <div style={{ display: "flex", gap: 6 }}>
                          {qtyInActive > 0 && (
                            <button onClick={() => remove(f.slug)} style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--rosa-4)", color: "var(--burdeos)", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>−</button>
                          )}
                          <button
                            className="add-circle"
                            onClick={() => add(f)}
                            disabled={cardDisabled || sinMas || (remaining <= 0 && !qtyInActive)}
                            style={{ width: 28, height: 28, borderRadius: "50%", background: (cardDisabled || sinMas || (remaining <= 0 && !qtyInActive)) ? "var(--border-color)" : "var(--burdeos)", color: "#fff", border: "none", cursor: (cardDisabled || sinMas || (remaining <= 0 && !qtyInActive)) ? "not-allowed" : "pointer", fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 150ms", lineHeight: 1 }}
                          >+</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Custom order CTA ── */}
            <div style={{ marginTop: "2rem", background: "linear-gradient(135deg,#fff1f2,#FFE2E7)", borderRadius: "var(--r-xl)", padding: "1.5rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ fontSize: "2.5rem" }}>💬</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h3 className={sofia.className} style={{ fontSize: "1.4rem", color: "var(--burdeos)", marginBottom: 4, lineHeight: 1.2 }}>
                  ¿Quieres algo más rápido o un sabor especial?
                </h3>
                <p style={{ color: "var(--text-soft)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                  Para pedidos urgentes (menos de 72 h), grandes (más de 5 cajas) o sabores fuera de catálogo, escríbenos por WhatsApp y te cotizamos.
                </p>
              </div>
              <a href={WA_LINK_CUSTOM} target="_blank" rel="noopener noreferrer">
                <button style={{ padding: "12px 24px", borderRadius: "var(--r-pill)", background: "#25D366", color: "#fff", border: "none", fontWeight: 800, fontSize: "0.85rem", cursor: "pointer", boxShadow: "var(--shadow-sm)", whiteSpace: "nowrap" }}>
                  💬 WhatsApp
                </button>
              </a>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="box-wrap-sticky" style={{ position: "sticky", top: 84, display: "flex", flexDirection: "column", gap: "0.75rem" }}>

            {/* Box tabs + add */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              {boxes.map((box, i) => {
                const { filled: bf, size: bs } = getBoxData(box, saboresMap);
                const isActive = activeBoxIndex === i;
                return (
                  <div key={i} style={{ position: "relative" }}>
                    <button
                      className="box-tab"
                      onClick={() => setActiveBoxIndex(i)}
                      style={{ padding: "7px 14px", borderRadius: "var(--r-pill)", border: `2px solid ${isActive ? "var(--burdeos)" : "var(--border-color)"}`, background: isActive ? "var(--burdeos)" : "var(--bg-raised)", color: isActive ? "#fff" : "var(--text-soft)", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", fontFamily: "var(--font-nunito)", display: "flex", alignItems: "center", gap: 6, transition: "all 150ms", paddingRight: boxes.length > 1 ? "28px" : "14px" }}
                    >
                      Caja {i + 1}
                      <span style={{ padding: "1px 6px", borderRadius: "var(--r-pill)", background: isActive ? "rgba(255,255,255,.2)" : "var(--rosa-4)", color: isActive ? "#fff" : "var(--burdeos)", fontSize: "0.65rem", fontWeight: 700 }}>
                        {bf}/{bs}
                      </span>
                    </button>
                    {boxes.length > 1 && (
                      <button
                        onClick={() => removeBox(i)}
                        title="Eliminar caja"
                        style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, borderRadius: "50%", background: isActive ? "rgba(255,255,255,.25)" : "var(--border-strong)", border: "none", color: isActive ? "#fff" : "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", lineHeight: 1, padding: 0 }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
              <button
                onClick={addBox}
                style={{ padding: "7px 14px", borderRadius: "var(--r-pill)", border: "2px dashed var(--rosa)", background: "transparent", color: "var(--rosa)", fontWeight: 800, fontSize: "0.78rem", cursor: "pointer", fontFamily: "var(--font-nunito)", transition: "all 150ms", whiteSpace: "nowrap" }}
              >
                + Agregar caja
              </button>
            </div>

            {/* Active box visual */}
            <div style={{ background: "linear-gradient(180deg,#FFC3C9 0%,#FFA1AA 100%)", borderRadius: "var(--r-xl)", padding: "1.25rem", boxShadow: "var(--shadow-md)", position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0" style={{ opacity: 0.4 }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <h3 className={sofia.className} style={{ fontSize: "1.5rem", color: "var(--burdeos)", lineHeight: 1 }}>Caja {activeBoxIndex + 1}</h3>
                  <span style={{ fontSize: "0.7rem", color: "var(--burdeos)", fontWeight: 700, background: "rgba(255,255,255,.7)", padding: "3px 10px", borderRadius: "var(--r-pill)" }}>{filled} / {boxSize}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${currentBox.size === "6" ? 3 : 4},1fr)`, gap: 6, background: "rgba(255,243,245,.7)", backdropFilter: "blur(6px)", borderRadius: "var(--r-md)", padding: "0.75rem", border: "2px dashed rgba(84,0,39,.15)" }}>
                  {slots.map((flavor, i) => (
                    <div key={i} style={{ aspectRatio: "1/1", borderRadius: "50%", background: flavor ? (flavor.bg || "linear-gradient(135deg,#FFE2E7,#FFC3C9)") : "rgba(255,255,255,.4)", border: "2px dashed", borderColor: flavor ? "transparent" : "rgba(84,0,39,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: flavor ? "1.4rem" : "0.85rem", color: "rgba(84,0,39,.35)", fontWeight: 700, animation: flavor ? "bob 4s ease-in-out infinite" : "none", animationDelay: `${i * 0.15}s`, overflow: "hidden" }}>
                      {flavor ? (flavor.imagen ? <img src={flavor.imagen} alt={flavor.nombre} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : flavor.emoji) : "+"}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* All-boxes summary */}
            {anyBoxStarted && (
              <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-md)", padding: "1rem 1.25rem", border: "1px solid var(--border-color)" }}>
                <h4 style={{ fontWeight: 800, fontSize: "0.75rem", color: "var(--burdeos)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Resumen</h4>
                {boxes.map((box, i) => {
                  const data = getBoxData(box, saboresMap);
                  if (!data.items.length) return null;
                  return (
                    <div key={i} style={{ marginBottom: "0.75rem", paddingBottom: "0.75rem", borderBottom: i < boxes.length - 1 ? "1px dashed var(--border-color)" : "none" }}>
                      <div style={{ fontWeight: 800, fontSize: "0.72rem", color: "var(--rosa)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                        Caja {i + 1} — {box.size === "6" ? "Media docena" : "Docena"} ({data.filled}/{data.size})
                      </div>
                      {data.items.map((it) => (
                        <div key={it.slug} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--text-soft)", padding: "2px 0" }}>
                          <span>{it.qty}× {it.sabor?.nombre || it.slug}</span>
                          <span>${(it.qty * (it.sabor?.precio || 0)).toFixed(0)}</span>
                        </div>
                      ))}
                      {data.discount > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--menta-deep)", padding: "2px 0" }}>
                          <span>Descuento docena</span><span>−${data.discount}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: 700, color: "var(--burdeos)", marginTop: 2 }}>
                        <span>Subtotal</span><span>${data.total}</span>
                      </div>
                    </div>
                  );
                })}
                <div style={{ borderTop: "2px solid var(--border-color)", marginTop: "0.5rem", paddingTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800 }}>Total {totalCajas > 1 ? `(${totalCajas} cajas)` : ""}</span>
                  <span className={sofia.className} style={{ fontSize: "1.6rem", color: "var(--burdeos)", lineHeight: 1 }}>${grandTotal}</span>
                </div>
              </div>
            )}

            {/* Checkout bar */}
            <div style={{ background: "var(--burdeos)", color: "#fff", padding: "1rem 1.25rem", borderRadius: "var(--r-md)", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "var(--shadow-md)", gap: "0.75rem", position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0" style={{ opacity: 0.12 }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: "0.65rem", color: "var(--rosa-2)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 2 }}>
                  {!anyBoxStarted ? "Tu caja está vacía" : !allBoxesFull ? `Caja ${activeBoxIndex + 1}: faltan ${remaining}` : `${totalCajas} caja${totalCajas > 1 ? "s" : ""} lista${totalCajas > 1 ? "s" : ""}`}
                </div>
                <div className={sofia.className} style={{ fontSize: "1.5rem", lineHeight: 1 }}>${grandTotal}</div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!anyBoxStarted || !allBoxesFull}
                style={{ padding: "10px 20px", borderRadius: "var(--r-pill)", background: (!anyBoxStarted || !allBoxesFull) ? "rgba(255,255,255,.18)" : "var(--rosa)", color: "#fff", border: "none", fontWeight: 800, fontSize: "0.85rem", cursor: (!anyBoxStarted || !allBoxesFull) ? "not-allowed" : "pointer", fontFamily: "var(--font-nunito)", whiteSpace: "nowrap", transition: "all 150ms", position: "relative" }}
              >
                Agregar al carrito →
              </button>
            </div>
          </div>
        </div>
      </main>

      <WebFooter />
    </div>
  );
}
