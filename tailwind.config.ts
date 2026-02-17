import type { Config } from "tailwindcss";

const config: Config = {
 // tailwind.config.ts
content: [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/components/**/*.{js,ts,jsx,tsx,mdx}", // <--- CAMBIA 'componentes' por 'components'
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;