"use client";
import { useEffect, useRef } from "react";

// Sprinkle shapes using canvas — sin interferir con SSR
const SPRINKLES = [
  { x: 0.06, y: 0.18, color: "#fda4af", w: 18, h: 6,  speed: 0.8, amp: 14, type: "rect" },
  { x: 0.91, y: 0.25, color: "#fbbf24", w: 10, h: 10, speed: 1.0, amp: 10, type: "circle" },
  { x: 0.44, y: 0.07, color: "#c4b5fd", w: 20, h: 5,  speed: 0.7, amp: 18, type: "rect" },
  { x: 0.76, y: 0.62, color: "#f0abfc", w: 8,  h: 8,  speed: 1.2, amp: 8,  type: "circle" },
  { x: 0.14, y: 0.70, color: "#86efac", w: 16, h: 5,  speed: 0.9, amp: 12, type: "rect" },
  { x: 0.60, y: 0.85, color: "#fed7aa", w: 22, h: 6,  speed: 0.6, amp: 20, type: "rect" },
  { x: 0.33, y: 0.42, color: "#fef08a", w: 12, h: 12, speed: 1.1, amp: 9,  type: "circle" },
  { x: 0.84, y: 0.48, color: "#fda4af", w: 18, h: 5,  speed: 0.75,amp: 16, type: "rect" },
  { x: 0.52, y: 0.32, color: "#bae6fd", w: 10, h: 10, speed: 0.95,amp: 11, type: "circle" },
  { x: 0.22, y: 0.55, color: "#f9a8d4", w: 24, h: 6,  speed: 1.05,amp: 14, type: "rect" },
  { x: 0.70, y: 0.12, color: "#fbbf24", w: 9,  h: 9,  speed: 0.85,amp: 17, type: "circle" },
  { x: 0.38, y: 0.78, color: "#c4b5fd", w: 16, h: 5,  speed: 1.15,amp: 10, type: "rect" },
  { x: 0.03, y: 0.48, color: "#fed7aa", w: 20, h: 6,  speed: 0.70,amp: 13, type: "rect" },
  { x: 0.96, y: 0.82, color: "#86efac", w: 8,  h: 8,  speed: 1.00,amp: 8,  type: "circle" },
  { x: 0.50, y: 0.58, color: "#f0abfc", w: 18, h: 5,  speed: 0.88,amp: 19, type: "rect" },
];

export default function SprinklesBackground({ height = 600 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0;

    const draw = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < SPRINKLES.length; i++) {
        const s = SPRINKLES[i];
        const phase = i * 1.3;
        const x = s.x * canvas.width  + s.amp * Math.sin(t * s.speed + phase);
        const y = s.y * canvas.height + s.amp * Math.cos(t * s.speed * 0.7 + phase);
        const angle = t * s.speed * 0.5 + phase;

        ctx.save();
        ctx.globalAlpha = 0.55 + 0.30 * Math.sin(t * 0.5 + phase);
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = s.color;

        if (s.type === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, s.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.roundRect(-s.w / 2, -s.h / 2, s.w, s.h, 3);
          ctx.fill();
        }

        ctx.restore();
      }

      t += 0.015;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
