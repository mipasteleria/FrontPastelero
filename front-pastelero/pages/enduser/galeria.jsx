import React, { useState } from "react";
import Image from "next/image";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

const GALLERY_ITEMS = [
  { src: "/img/animalcrossing.jpg", alt: "Pastel Animal Crossing" },
  { src: "/img/coockies.jpg",       alt: "Galletas decoradas" },
  { src: "/img/yoda.jpg",           alt: "Pastel Yoda 3D" },
  { src: "/img/galletas.jpg",       alt: "Galletas americanas" },
  { src: "/img/pay.jpeg",           alt: "Pay de queso" },
];

export default function Galeria() {
  const [current, setCurrent] = useState(0);

  return (
    <div
      className={nunito.className}
      style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", flexDirection: "column" }}
    >
      {/* Sprinkle overlay */}
      <div
        aria-hidden="true"
        className="ru-pattern-sprinkle fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.07 }}
      />

      <NavbarAdmin />

      <main
        className="flex-grow relative z-10"
        style={{ marginTop: "4rem", padding: "2.5rem 1.25rem 3rem", maxWidth: 900, marginLeft: "auto", marginRight: "auto", width: "100%" }}
      >
        {/* ── Page header ───────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--rosa)",
              marginBottom: 8,
            }}
          >
            Nuestras creaciones
          </p>
          <h1
            className={sofia.className}
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--burdeos)", lineHeight: 1.1, marginBottom: 12 }}
          >
            Galería
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, maxWidth: 320, margin: "0 auto" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Cada pieza, única
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
          </div>
        </div>

        {/* ── Main preview ───────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            maxHeight: 460,
            borderRadius: "var(--r-xl)",
            overflow: "hidden",
            boxShadow: "var(--shadow-lg)",
            marginBottom: "1.25rem",
            background: "var(--crema)",
          }}
        >
          <Image
            src={GALLERY_ITEMS[current].src}
            fill
            priority
            style={{ objectFit: "cover", transition: "opacity 300ms" }}
            alt={GALLERY_ITEMS[current].alt}
          />
          {/* Caption bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "1rem 1.5rem",
              background: "linear-gradient(to top, rgba(84,0,39,0.7), transparent)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.95rem",
            }}
          >
            {GALLERY_ITEMS[current].alt}
          </div>

          {/* Prev / Next arrows */}
          {GALLERY_ITEMS.length > 1 && (
            <>
              <button
                onClick={() => setCurrent((c) => (c - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length)}
                style={{
                  position: "absolute", top: "50%", left: 12, transform: "translateY(-50%)",
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(255,243,245,0.85)",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--burdeos)", boxShadow: "var(--shadow-sm)",
                }}
                aria-label="Imagen anterior"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={() => setCurrent((c) => (c + 1) % GALLERY_ITEMS.length)}
                style={{
                  position: "absolute", top: "50%", right: 12, transform: "translateY(-50%)",
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(255,243,245,0.85)",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--burdeos)", boxShadow: "var(--shadow-sm)",
                }}
                aria-label="Imagen siguiente"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* ── Thumbnails ─────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GALLERY_ITEMS.length}, 1fr)`,
            gap: "0.75rem",
          }}
        >
          {GALLERY_ITEMS.map((item, i) => (
            <button
              key={item.src}
              onClick={() => setCurrent(i)}
              style={{
                position: "relative",
                aspectRatio: "1/1",
                borderRadius: "var(--r-md)",
                overflow: "hidden",
                border: "3px solid",
                borderColor: i === current ? "var(--burdeos)" : "transparent",
                cursor: "pointer",
                padding: 0,
                background: "var(--crema)",
                transition: "border-color 200ms, transform 200ms",
                transform: i === current ? "scale(1.03)" : "scale(1)",
                boxShadow: i === current ? "var(--shadow-md)" : "var(--shadow-xs)",
              }}
              aria-label={item.alt}
              aria-current={i === current}
            >
              <Image
                src={item.src}
                fill
                style={{ objectFit: "cover" }}
                alt={item.alt}
              />
              {/* Dim overlay when not active */}
              {i !== current && (
                <div
                  style={{
                    position: "absolute", inset: 0,
                    background: "rgba(84,0,39,0.18)",
                    transition: "background 200ms",
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* ── Dot indicator ──────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: "1.5rem" }}>
          {GALLERY_ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                borderRadius: "var(--r-pill)",
                border: "none",
                background: i === current ? "var(--burdeos)" : "var(--border-strong)",
                cursor: "pointer",
                transition: "all 250ms",
                padding: 0,
              }}
              aria-label={`Imagen ${i + 1}`}
            />
          ))}
        </div>
      </main>

      <WebFooter />
    </div>
  );
}
