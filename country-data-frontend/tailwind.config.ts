import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    screens: {
      'xs': '320px',

      'sm': '475px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      // Add your custom breakpoint here
      'custom': '1100px', // This adds a breakpoint at 1100px
    },
    extend: {},
  },
  plugins: [],
};

export default config;
