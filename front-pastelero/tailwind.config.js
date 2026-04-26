/** @type {import('tailwindcss').Config} */
module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    }
  },
  content: [
    "./node_modules/flowbite-react/lib/**/*.js",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Aliases existentes (backward-compat) ──────────────────────
        primary:       "#FFC3C9",   // rosa-3
        secondary:     "#D6A7BC",
        text:          "#540027",   // burdeos
        accent:        "#FF6F7D",   // rosa
        background:    "#FFF3F5",   // crema
        highlightText: "rgba(255,195,201,0.2)",

        // ── Tokens El Ruiseñor ────────────────────────────────────────
        burdeos: {
          DEFAULT: "#540027",
          2:       "#7A1F44",
        },
        rosa: {
          DEFAULT: "#FF6F7D",
          2:       "#FFA1AA",
          3:       "#FFC3C9",
          4:       "#FFE2E7",
        },
        crema: {
          DEFAULT: "#FFF3F5",
          2:       "#FAEDE3",
        },
        // Acentos bold-pastel
        menta:       { DEFAULT: "#B8E6D3", deep: "#6FC9A8" },
        pistache:    { DEFAULT: "#D4E3A8", deep: "#9FB864" },
        mantequilla: "#FFE99B",
        durazno:     "#FFC9A5",
        lavanda:     "#D9C4E8",

        // Semánticos (usables como clases Tailwind bg-surface, text-soft…)
        surface:     "#FFFFFF",
        sunken:      "#FFEEF1",
        "text-soft":  "#5A3548",
        "text-muted": "#8B6B7A",
        "on-dark":    "#FFF3F5",
        border:       "#F5D4DA",
        "border-strong": "#E8B5BE",
      },

      fontFamily: {
        // Fuentes del rediseño
        sofia:   ["Sofia", "cursive"],        // títulos — preferencia del cliente
        fraunces:["Fraunces", "serif"],       // display serif (card-heads, sección)
        nunito:  ["Nunito", "sans-serif"],    // body sans
        // Fuentes anteriores (backward-compat)
        poppins: ["Poppins", "sans-serif"],
      },

      borderRadius: {
        sm:  "6px",
        md:  "12px",
        lg:  "20px",
        xl:  "28px",
        "2xl": "36px",
        pill: "999px",
      },

      boxShadow: {
        xs:   "0 1px 2px rgba(84,0,39,0.06)",
        sm:   "0 2px 6px rgba(84,0,39,0.08)",
        md:   "0 8px 20px rgba(84,0,39,0.12)",
        lg:   "0 16px 36px rgba(84,0,39,0.16)",
        xl:   "0 30px 60px rgba(84,0,39,0.22)",
        glow: "0 0 0 4px rgba(255,111,125,0.18)",
      },

      backgroundImage: {
        "gradient-radial":  "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":   "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        // Patrones SVG
        "sprinkle": "url('/patterns/sprinkle-wash.svg')",
        "branches":  "url('/patterns/branch-wash.svg')",
      },

      transitionDuration: {
        fast: "150ms",
        med:  "280ms",
        slow: "480ms",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
