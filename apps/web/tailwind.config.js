/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "0.8rem",
        md: "calc(0.8rem - 2px)",
        sm: "calc(0.8rem - 4px)",
      },
      boxShadow: {
        soft: "0 12px 42px -18px rgba(242, 169, 0, 0.5)",
      },
      backgroundImage: {
        "brand-glow":
          "radial-gradient(circle at 10% 10%, rgba(242, 169, 0, 0.18), transparent 35%), radial-gradient(circle at 90% 80%, rgba(255, 194, 71, 0.12), transparent 30%)",
      },
    },
  },
  plugins: [],
};
