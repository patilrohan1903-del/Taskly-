/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        surface: 'var(--surface)',
        primary: '#4F46E5', // Updated precise primary color
        primaryHover: '#4338CA',
        textMain: 'var(--text-main)',
        textMuted: 'var(--text-muted)',
        danger: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B', // Added orange for pending
        borderLight: 'var(--border-light)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
