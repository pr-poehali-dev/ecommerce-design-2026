import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Golos Text', 'sans-serif'],
				heading: ['Oswald', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				cyber: {
					blue: '#2A6DF4',
					purple: '#8A2BE2',
					dark: '#0F172A',
					'dark-2': '#1E293B',
					'dark-3': '#334155',
				},
				surface: {
					DEFAULT: '#FFFFFF',
					'2': '#F4F7FF',
					'3': '#EEF2FF',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '1.5rem',
				'pill': '40px',
			},
			backgroundImage: {
				'grad-main': 'linear-gradient(135deg, #2A6DF4 0%, #8A2BE2 100%)',
				'grad-card': 'linear-gradient(180deg, rgba(42,109,244,0.06) 0%, rgba(138,43,226,0.03) 100%)',
				'grad-text': 'linear-gradient(135deg, #2A6DF4 0%, #8A2BE2 100%)',
				'grad-soft': 'linear-gradient(135deg, rgba(42,109,244,0.08) 0%, rgba(138,43,226,0.05) 100%)',
				'grad-light': 'linear-gradient(135deg, #EEF4FF 0%, #F3EEFF 100%)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(10px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					from: { opacity: '0', transform: 'scale(0.92)' },
					to: { opacity: '1', transform: 'scale(1)' }
				},
				'slide-in-right': {
					from: { transform: 'translateX(100%)' },
					to: { transform: 'translateX(0)' }
				},
				'badge-bounce': {
					'0%, 100%': { transform: 'scale(1)' },
					'30%': { transform: 'scale(1.5)' },
					'60%': { transform: 'scale(0.88)' },
					'80%': { transform: 'scale(1.12)' },
				},
				shimmer: {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
				'pop-in': {
					'0%': { opacity: '0', transform: 'scale(0.8) translateY(12px)' },
					'70%': { transform: 'scale(1.04) translateY(-2px)' },
					'100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'spin-slow': {
					from: { transform: 'rotate(0deg)' },
					to: { transform: 'rotate(360deg)' },
				},
				'pulse-ring': {
					'0%': { transform: 'scale(1)', opacity: '0.6' },
					'100%': { transform: 'scale(1.6)', opacity: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s cubic-bezier(0.34,1.2,0.64,1) forwards',
				'scale-in': 'scale-in 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
				'slide-in-right': 'slide-in-right 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
				'badge-bounce': 'badge-bounce 0.45s cubic-bezier(0.36,0.07,0.19,0.97)',
				'shimmer': 'shimmer 1.6s infinite',
				'pop-in': 'pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
				'float': 'float 4s ease-in-out infinite',
				'spin-slow': 'spin-slow 12s linear infinite',
				'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;