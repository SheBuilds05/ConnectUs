/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'runner-bg': '#D3D3D3',     // Light Gray Background
        'runner-light': '#6E8649',  // Moss Green
        'runner-medium': '#477023', // Leaf Green
        'runner-dark': '#2D531A',   // Forest Green
        'runner-deep': '#0D330E',   // Deep Jungle Green
      },
    },
  },
  plugins: [],
}