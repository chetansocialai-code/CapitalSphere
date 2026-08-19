/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../apps/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        // CapitalSphere Master Color Tokens (Midnight Finance)
        cs: {
          bg: "#070A0F",          // Background (70%)
          surface: "#0C1118",     // Primary Surface (20%)
          secondary: "#111823",   // Secondary Surface
          elevated: "#151D29",    // Elevated Surface
          border: "#202B38",      // Border
          text: "#F4F7FA",        // Primary Text
          textSecondary: "#A5AFBD",// Secondary Text
          muted: "#6F7A88",       // Muted Text
          accent: "#4DA3FF",      // Primary Accent (10%)
          accentHover: "#69B2FF", // Accent Hover
          positive: "#22C58B",    // Positive Green
          negative: "#F05252",    // Negative Red
          warning: "#F2B84B",     // Warning Gold
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Consolas", "monospace"],
      },
      fontSize: {
        '3xs': '0.60rem',
        '2xs': '0.68rem',
      },
      maxWidth: {
        'master': '1440px',
      }
    },
  },
  plugins: [],
};
