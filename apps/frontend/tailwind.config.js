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
        border: "#E7E3DC",
        input: "#E5E1DA", // Input border
        ring: "#D6D1C7", // Focus border
        background: "#F7F5F2",
        foreground: "#2C2C2E",
        primary: {
          DEFAULT: "#2C2C2E",
          foreground: "#F7F5F2",
        },
        secondary: {
          DEFAULT: "#E7E3DC",
          foreground: "#2C2C2E",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#F2EFEA", // Hover background
          foreground: "#6E6E73", // Secondary text
        },
        accent: {
          DEFAULT: "#F2EFEA",
          foreground: "#2C2C2E",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#2C2C2E",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#2C2C2E",
        },
        // Custom Webelong Palette
        webelong: {
          background: "#F7F5F2",
          card: "#FFFFFF",
          border: "#E7E3DC",
          text: "#2C2C2E",
          muted: "#6E6E73",
          focus: "#D6D1C7",
          hover: "#F2EFEA",
          input: "#FFFFFF",
          inputBorder: "#E5E1DA",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
