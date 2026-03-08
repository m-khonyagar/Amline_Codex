/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
// const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['"IRANSansX"', 'tahoma'],
      },
      fontSize: {
        base: ['14px', { lineHeight: '1.7145' }],
      },
      lineHeight: {
        normal: '1.7145',
      },
      boxShadow: {
        xl: '0 8px 32px 0 rgba(33, 33, 33, 0.08)',
      },
      colors: {
        teal: {
          50: '#F4F9F9',
          100: '#CCF0F1',
          600: '#179A9C',
        },
        gray: {
          200: '#D7D9DE',
          300: '#BCBEC2',
          400: '#F2F4FA',
          500: '#999B9E',
          600: '#676767',
          700: '#717275',
          900: '#1E1E1F',
        },
        rust: {
          100: '#FDEEE8',
          300: '#DDA692',
          400: '#CD8266',
          600: '#AD3A10',
        },
        red: {
          100: '#FEECEC',
          600: '#F53D3D',
        },
        yellow: {
          600: '#FF9900',
        },
        green: {
          100: '#AEDCDC',
          500: '#1ABC34',
          600: '#53BB6A',
        },
        blue: {
          600: '#3D92F5',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: '#53BB6A',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': 'calc(var(--radius) * 2)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
