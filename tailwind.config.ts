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
				sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
				display: ['"Fraunces"', 'Georgia', 'serif'],
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
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				gold: {
					DEFAULT: 'hsl(var(--gold))',
					foreground: 'hsl(var(--gold-foreground))'
				},
				streak: {
					DEFAULT: 'hsl(var(--streak))',
					foreground: 'hsl(var(--streak-foreground))'
				},
				'pillar-sales': 'hsl(var(--pillar-sales))',
				'pillar-automation': 'hsl(var(--pillar-automation))',
				'pillar-strategy': 'hsl(var(--pillar-strategy))',
				'pillar-frog': 'hsl(var(--pillar-frog))',
				'pillar-life': 'hsl(var(--pillar-life))',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				'float-up': {
					'0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
					'100%': { opacity: '0', transform: 'translateY(-60px) scale(1.3)' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 8px hsl(var(--gold) / 0.4)' },
					'50%': { boxShadow: '0 0 20px hsl(var(--gold) / 0.7)' }
				},
				'flame-flicker': {
					'0%, 100%': { transform: 'scaleY(1) scaleX(1)' },
					'25%': { transform: 'scaleY(1.15) scaleX(0.9)' },
					'50%': { transform: 'scaleY(0.95) scaleX(1.05)' },
					'75%': { transform: 'scaleY(1.1) scaleX(0.95)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.7)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'slide-up': {
					'0%': { opacity: '0', transform: 'translateY(12px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'points-pop': {
					'0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
					'50%': { transform: 'translateY(-20px) scale(1.4)' },
					'100%': { opacity: '0', transform: 'translateY(-40px) scale(1)' }
				},
				'check-pop': {
					'0%': { transform: 'scale(1)' },
					'40%': { transform: 'scale(1.3)' },
					'100%': { transform: 'scale(1)' }
				},
				'frog-bounce': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-4px)' }
				},
				'frog-eat': {
					'0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
					'30%': { transform: 'scale(1.3) rotate(-5deg)' },
					'100%': { transform: 'scale(0) rotate(0deg)', opacity: '0' }
				},
				'habit-pop': {
					'0%': { transform: 'scale(1)' },
					'30%': { transform: 'scale(1.25)' },
					'100%': { transform: 'scale(1)' }
				},
				'sheet-up': {
					from: { transform: 'translateY(100%)' },
					to: { transform: 'translateY(0)' }
				},
				'streak-flame': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.15) rotate(3deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float-up': 'float-up 1s ease-out forwards',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'flame': 'flame-flicker 0.6s ease-in-out infinite',
				'scale-in': 'scale-in 0.3s ease-out',
				'slide-up': 'slide-up 0.3s ease-out',
				'points-pop': 'points-pop 0.8s ease-out forwards',
				'check-pop': 'check-pop 0.3s ease',
				'frog-bounce': 'frog-bounce 2s ease infinite',
				'frog-eat': 'frog-eat 0.6s ease forwards',
				'habit-pop': 'habit-pop 0.3s ease',
				'sheet-up': 'sheet-up 0.3s ease',
				'streak-flame': 'streak-flame 1s ease infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
