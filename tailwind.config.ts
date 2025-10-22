import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        quicksand: ["Quicksand", "sans-serif"],
      },
      colors: {
        primary: "#6446fe",
        secondary: "#2c3e50",
        muted: "#98a5c3",
        "light-gray": "#dbe0e5",
        "medium-gray": "#6c7a88",
        placeholder: "#c4cacf",
        "text-gray": "#494949",
        "icon-gray": "#979797",
        "icon-hover": "#343434",
      },
      backgroundImage: {
        "auth-bg": "url('/img/img-auth-bg.jpg')",
      },
    },
  },
} satisfies Config;
