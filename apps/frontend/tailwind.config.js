module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      maxWidth: {
        "app-content": "680px",
      },
      colors: {
        // Enforced Emotional Safety Theme
        paper: {
          bg: 'rgb(var(--paper-bg) / <alpha-value>)',
          surface: 'rgb(var(--paper-surface) / <alpha-value>)',
          surfaceSoft: 'rgb(var(--paper-surface-soft) / <alpha-value>)',
          nav: 'rgb(var(--paper-nav) / <alpha-value>)',
          text: 'rgb(var(--paper-text) / <alpha-value>)',
          textSoft: 'rgb(var(--paper-text-soft) / <alpha-value>)',
          border: 'rgb(var(--paper-border))',
        },
        border: "rgb(var(--paper-border))",
        input: "rgb(var(--paper-border))", // Input border
        ring: "rgb(var(--paper-accent) / <alpha-value>)", // Focus border
        background: "rgb(var(--paper-bg) / <alpha-value>)",
        foreground: "rgb(var(--paper-text) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--paper-accent) / <alpha-value>)",
          foreground: "rgb(var(--paper-accent-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--paper-surface) / <alpha-value>)",
          foreground: "rgb(var(--paper-text) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive, 0 84.2% 60.2%))", // Fallback if missing
          foreground: "hsl(var(--destructive-foreground, 210 40% 98%))",
        },
        muted: {
          DEFAULT: "rgb(var(--paper-surface) / <alpha-value>)", // Hover background
          foreground: "rgb(var(--paper-text-soft) / <alpha-value>)", // Secondary text
        },
        accent: {
          DEFAULT: "rgb(var(--paper-surface) / <alpha-value>)",
          foreground: "rgb(var(--paper-text) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--paper-surface) / <alpha-value>)",
          foreground: "rgb(var(--paper-text) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--paper-surface) / <alpha-value>)",
          foreground: "rgb(var(--paper-text) / <alpha-value>)",
        },
        // Custom Webelong Palette mapped to semantics
        webelong: {
          background: "rgb(var(--paper-bg) / <alpha-value>)",
          card: "rgb(var(--paper-surface) / <alpha-value>)",
          border: "rgb(var(--paper-border))",
          text: "rgb(var(--paper-text) / <alpha-value>)",
          muted: "rgb(var(--paper-text-soft) / <alpha-value>)",
          focus: "rgb(var(--paper-accent) / <alpha-value>)",
          hover: "rgb(var(--paper-surface) / <alpha-value>)",
          input: "rgb(var(--paper-surface) / <alpha-value>)",
          inputBorder: "rgb(var(--paper-border))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        heading: ["var(--font-serif)", "serif"],
        body: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
