import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design tokens — siyah/beyaz ağırlıklı minimal palette
        canvas: {
          DEFAULT: "#0a0a0a",
          secondary: "#111111",
          tertiary: "#1a1a1a",
          elevated: "#222222",
        },
        surface: {
          DEFAULT: "#1a1a1a",
          hover: "#242424",
          active: "#2a2a2a",
          border: "#2e2e2e",
        },
        ink: {
          primary: "#f5f5f5",
          secondary: "#a3a3a3",
          tertiary: "#6b6b6b",
          disabled: "#3d3d3d",
        },
        accent: {
          DEFAULT: "#ffffff",
          muted: "#e5e5e5",
        },
        brand: {
          DEFAULT: "#e2e8f0",
          hover: "#f8fafc",
        },
        semantic: {
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
          info: "#3b82f6",
        },
        // Code syntax colors
        syntax: {
          keyword: "#c792ea",
          string: "#c3e88d",
          number: "#f78c6c",
          comment: "#546e7a",
          function: "#82aaff",
          variable: "#eeffff",
          operator: "#89ddff",
          punctuation: "#89ddff",
          type: "#ffcb6b",
          tag: "#f07178",
          attr: "#c792ea",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        sidebar: "16rem",
        "sidebar-collapsed": "4rem",
        header: "3.5rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "surface-sm": "0 1px 2px 0 rgba(0,0,0,0.4)",
        "surface-md": "0 4px 6px -1px rgba(0,0,0,0.5)",
        "surface-lg": "0 10px 15px -3px rgba(0,0,0,0.6)",
        "surface-xl": "0 20px 25px -5px rgba(0,0,0,0.7)",
        "glow-white": "0 0 20px rgba(255,255,255,0.05)",
      },
      animation: {
        "fade-in": "fadeIn 0.15s ease-out",
        "slide-up": "slideUp 0.2s ease-out",
        "slide-down": "slideDown 0.2s ease-out",
        "scale-in": "scaleIn 0.15s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { transform: "translateY(8px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
        slideDown: { from: { transform: "translateY(-8px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
        scaleIn: { from: { transform: "scale(0.95)", opacity: "0" }, to: { transform: "scale(1)", opacity: "1" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      backgroundImage: {
        "shimmer-gradient": "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
      },
      zIndex: {
        sidebar: "40",
        header: "50",
        modal: "60",
        tooltip: "70",
        toast: "80",
      },
    },
  },
  plugins: [],
};

export default config;
