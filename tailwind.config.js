/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "3D": "inset -1px -2px 4px rgb(0 0 0 / 25%)",
      },
      animation: {
        foldDown: "foldDown 0.5s linear forwards",
        foldUp: "foldUp 0.5s linear forwards",
        progress: "progress 0.5s linear forwards",
      },
      keyframes: {
        foldDown: {
          "0%": {
            opacity: "0",
            height: "0",
            paddingBlock: "0 ",
            transform: "translateY(-100%)",
          },
          "20%, 50%": {
            position: "relative",
            zIndex: "-1",
            opacity: "0",
            height: "auto",
            paddingBlock: "0.5rem ",
            transform: "translateY(-50%)",
          },
          "100%": {
            opacity: "1",
            height: "auto",
            paddingBlock: "0.5rem ",
            transform: "translateY(0)",
          },
        },
        foldUp: {
          "0%": {
            opacity: "1",
            transform: "translateY(0)",
          },
          "20%, 50%, 70%": {
            position: "relative",
            zIndex: "-1",
            opacity: "0",
            paddingBlock: "0",
            height: "0",
            transform: "translateY(-50%)",
          },
          "100%": {
            opacity: "0",
            paddingBlock: "0",
            height: "0",
            transform: "translateY(-100%)",
          },
        },
        progress: {
          "0%": { width: "0" },
          "25%": { width: "25%" },
          "50%": { width: "50%" },
          "75%": { width: "75%" },
          "100%": { width: "90%" },
        },
      },
    },
  },
  plugins: [],
};
