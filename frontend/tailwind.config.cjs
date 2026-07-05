/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F7DF3',
          50: '#eff4ff',
          100: '#dbeafe',
          500: '#4F7DF3',
          600: '#3b6be3',
        },
        secondary: {
          DEFAULT: '#3CCFCF',
        },
        accent: {
          DEFAULT: '#8B5CF6',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        background: '#F6F8FC',
        card: '#FFFFFF',
        border: '#E5E7EB',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 20px 60px -15px rgba(0,0,0,0.05)',
        'float': '0 8px 30px rgba(0,0,0,0.08)',
        'glow': '0 8px 25px rgba(79, 125, 243, 0.4)',
      },
      borderRadius: {
        'xl': '18px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
}
