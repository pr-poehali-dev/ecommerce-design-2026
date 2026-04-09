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
		container: { center: true, padding: '2rem', screens: { '2xl': '1400px' } },
		extend: {
			fontFamily: {
				sans:    ['Golos Text', 'sans-serif'],
				heading: ['Oswald', 'sans-serif'],
				mono:    ['JetBrains Mono', 'monospace'],
			},
			colors: {
				border:     'hsl(var(--border))',
				input:      'hsl(var(--input))',
				ring:       'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary:    { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
				secondary:  { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
				destructive:{ DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
				muted:      { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
				accent:     { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
				popover:    { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
				card:       { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
				sidebar: {
					DEFAULT:            'hsl(var(--sidebar-background))',
					foreground:         'hsl(var(--sidebar-foreground))',
					primary:            'hsl(var(--sidebar-primary))',
					'primary-foreground':'hsl(var(--sidebar-primary-foreground))',
					accent:             'hsl(var(--sidebar-accent))',
					'accent-foreground':'hsl(var(--sidebar-accent-foreground))',
					border:             'hsl(var(--sidebar-border))',
					ring:               'hsl(var(--sidebar-ring))',
				},
				neon: {
					pink:   '#FF2D9B',
					cyan:   '#00D4FF',
					violet: '#9D4EDD',
					green:  '#00FF94',
					yellow: '#FFE600',
				},
				cyber: {
					dark:  '#050508',
					dark1: '#0A0A0F',
					dark2: '#0F0F18',
					dark3: '#15151F',
					blue:  '#00D4FF',
					purple:'#9D4EDD',
				},
			},
			borderRadius: {
				lg:   'var(--radius)',
				md:   'calc(var(--radius) - 2px)',
				sm:   'calc(var(--radius) - 4px)',
				'2xl':'1.5rem',
				'3xl':'2rem',
				pill: '40px',
			},
			backgroundImage: {
				'grad-main':   'linear-gradient(135deg, #FF2D9B 0%, #9D4EDD 50%, #00D4FF 100%)',
				'grad-pink':   'linear-gradient(135deg, #FF2D9B 0%, #FF6EC7 100%)',
				'grad-cyan':   'linear-gradient(135deg, #00D4FF 0%, #0099FF 100%)',
				'grad-violet': 'linear-gradient(135deg, #9D4EDD 0%, #C084FC 100%)',
				'grad-card':   'linear-gradient(135deg, rgba(255,45,155,0.06) 0%, rgba(157,78,221,0.06) 50%, rgba(0,212,255,0.06) 100%)',
				'grad-holo':   'linear-gradient(135deg, #FF2D9B, #9D4EDD, #00D4FF, #00FF94, #FF2D9B)',
				'grad-dark':   'linear-gradient(135deg, #0A0A0F 0%, #0F0F18 100%)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to:   { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to:   { height: '0' },
				},
				'grad-shift': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%':      { backgroundPosition: '100% 50%' },
				},
				'holo-border': {
					'0%':   { backgroundPosition: '0% 0%' },
					'100%': { backgroundPosition: '300% 300%' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up':   'accordion-up 0.2s ease-out',
				'grad-shift':     'grad-shift 3s ease infinite',
				'holo-border':    'holo-border 4s linear infinite',
			},
			boxShadow: {
				'neon-pink':   '0 0 20px rgba(255,45,155,0.5), 0 0 60px rgba(255,45,155,0.2)',
				'neon-cyan':   '0 0 20px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.2)',
				'neon-violet': '0 0 20px rgba(157,78,221,0.5), 0 0 60px rgba(157,78,221,0.2)',
				'card-hover':  '0 0 0 1px rgba(255,45,155,0.5), 0 0 30px rgba(255,45,155,0.3), 0 0 60px rgba(157,78,221,0.2), 0 24px 60px rgba(0,0,0,0.7)',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
