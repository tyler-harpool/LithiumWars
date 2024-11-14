import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        slate: {
          800: '#1e293b',
          900: '#0f172a',
        },
        blue: {
          500: '#3b82f6',
        },
        red: {
          400: '#f87171',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'card-hover': 'card-hover 0.3s ease-out forwards',
        'card-enter': 'card-enter 0.5s ease-out forwards',
        'card-flip': 'card-flip 0.6s ease-in-out forwards',
        'card-shine': 'card-shine 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': {
            boxShadow: '0 0 5px hsl(var(--primary))',
            borderColor: 'hsl(var(--primary))'
          },
          '100%': {
            boxShadow: '0 0 20px hsl(var(--primary))',
            borderColor: 'hsl(var(--primary))'
          }
        },
        'card-hover': {
          '0%': {
            transform: 'translateY(0) scale(1)',
            boxShadow: '0 0 0 rgba(0, 0, 0, 0)'
          },
          '100%': {
            transform: 'translateY(-5px) scale(1.05)',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
          }
        },
        'card-enter': {
          '0%': {
            transform: 'translateY(20px) scale(0.8)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0) scale(1)',
            opacity: '1'
          }
        },
        'card-flip': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' }
        },
        'card-shine': {
          '0%': {
            backgroundPosition: '200% 0'
          },
          '100%': {
            backgroundPosition: '-200% 0'
          }
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
