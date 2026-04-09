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
				sans:    ['Inter', 'Golos Text', 'system-ui', 'sans-serif'],
				heading: ['Inter', 'system-ui', 'sans-serif'],
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
					DEFAULT:             'hsl(var(--sidebar-background))',
					foreground:          'hsl(var(--sidebar-foreground))',
					primary:             'hsl(var(--sidebar-primary))',
					'primary-foreground':'hsl(var(--sidebar-primary-foreground))',
					accent:              'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border:              'hsl(var(--sidebar-border))',
					ring:                'hsl(var(--sidebar-ring))',
				},
				ink: {
					DEFAULT: '#1A1A1A',
					'2':     '#3A3A3A',
					'3':     '#6E6E73',
					'4':     '#AEAEB2',
					'5':     '#D1D1D6',
				},
				bg: {
					DEFAULT: '#F5F5F7',
					white:   '#FFFFFF',
					subtle:  '#F0F0F2',
				},
				// kept for backward compat
				cyber: {
					blue:   '#1A1A1A',
					purple: '#6E6E73',
					dark:   '#1A1A1A',
					dark2:  '#F5F5F7',
				},
				neon: {
					pink:   '#1A1A1A',
					cyan:   '#3A3A3A',
					violet: '#6E6E73',
					green:  '#AEAEB2',
				},
			},
			borderRadius: {
				sm:   '8px',
				md:   '12px',
				lg:   'var(--radius)',
				xl:   '16px',
				'2xl':'20px',
				'3xl':'24px',
				pill: '40px',
			},
			boxShadow: {
				xs:    '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
				sm:    '0 4px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)',
				md:    '0 8px 24px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)',
				lg:    '0 16px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
				hover: '0 20px 40px -8px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
				neu:   '4px 4px 12px rgba(0,0,0,0.06), -4px -4px 12px rgba(255,255,255,0.9)',
				dropdown: '0 16px 48px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up':   'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
