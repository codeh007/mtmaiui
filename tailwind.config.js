// import type { Config } from "tailwindcss";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    // "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "../../packages/mtxuilib/src/**/*.{js,jsx,ts,tsx,mdx}",
    // "../../packages/mtmeditor/src/**/*.{js,jsx,ts,tsx,mdx}",
    // "../../packages/mtmscreentocode/src/**/*.{js,jsx,ts,tsx,mdx}",
    // "../../packages/mtmaibot/src/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  darkMode: ["class"],
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
        chat: "var(--chat-max-width)",
      },
      colors: {
        bolt: {
          elements: {
            borderColor: "var(--bolt-elements-borderColor)",
            borderColorActive: "var(--bolt-elements-borderColorActive)",
            background: {
              depth: {
                1: "var(--bolt-elements-bg-depth-1)",
                2: "var(--bolt-elements-bg-depth-2)",
                3: "var(--bolt-elements-bg-depth-3)",
                4: "var(--bolt-elements-bg-depth-4)",
              },
            },
            textPrimary: "var(--bolt-elements-textPrimary)",
            textSecondary: "var(--bolt-elements-textSecondary)",
            textTertiary: "var(--bolt-elements-textTertiary)",
            code: {
              background: "var(--bolt-elements-code-background)",
              text: "var(--bolt-elements-code-text)",
            },
            button: {
              primary: {
                background: "var(--bolt-elements-button-primary-background)",
                backgroundHover:
                  "var(--bolt-elements-button-primary-backgroundHover)",
                text: "var(--bolt-elements-button-primary-text)",
              },
              secondary: {
                background: "var(--bolt-elements-button-secondary-background)",
                backgroundHover:
                  "var(--bolt-elements-button-secondary-backgroundHover)",
                text: "var(--bolt-elements-button-secondary-text)",
              },
              danger: {
                background: "var(--bolt-elements-button-danger-background)",
                backgroundHover:
                  "var(--bolt-elements-button-danger-backgroundHover)",
                text: "var(--bolt-elements-button-danger-text)",
              },
            },
            item: {
              contentDefault: "var(--bolt-elements-item-contentDefault)",
              contentActive: "var(--bolt-elements-item-contentActive)",
              contentAccent: "var(--bolt-elements-item-contentAccent)",
              contentDanger: "var(--bolt-elements-item-contentDanger)",
              backgroundDefault: "var(--bolt-elements-item-backgroundDefault)",
              backgroundActive: "var(--bolt-elements-item-backgroundActive)",
              backgroundAccent: "var(--bolt-elements-item-backgroundAccent)",
              backgroundDanger: "var(--bolt-elements-item-backgroundDanger)",
            },
            actions: {
              background: "var(--bolt-elements-actions-background)",
              code: {
                background: "var(--bolt-elements-actions-code-background)",
              },
            },
            artifacts: {
              background: "var(--bolt-elements-artifacts-background)",
              backgroundHover: "var(--bolt-elements-artifacts-backgroundHover)",
              borderColor: "var(--bolt-elements-artifacts-borderColor)",
              inlineCode: {
                background:
                  "var(--bolt-elements-artifacts-inlineCode-background)",
                text: "var(--bolt-elements-artifacts-inlineCode-text)",
              },
            },
            messages: {
              background: "var(--bolt-elements-messages-background)",
              linkColor: "var(--bolt-elements-messages-linkColor)",
              code: {
                background: "var(--bolt-elements-messages-code-background)",
              },
              inlineCode: {
                background:
                  "var(--bolt-elements-messages-inlineCode-background)",
                text: "var(--bolt-elements-messages-inlineCode-text)",
              },
            },
            icon: {
              success: "var(--bolt-elements-icon-success)",
              error: "var(--bolt-elements-icon-error)",
              primary: "var(--bolt-elements-icon-primary)",
              secondary: "var(--bolt-elements-icon-secondary)",
              tertiary: "var(--bolt-elements-icon-tertiary)",
            },
            preview: {
              addressBar: {
                background:
                  "var(--bolt-elements-preview-addressBar-background)",
                backgroundHover:
                  "var(--bolt-elements-preview-addressBar-backgroundHover)",
                backgroundActive:
                  "var(--bolt-elements-preview-addressBar-backgroundActive)",
                text: "var(--bolt-elements-preview-addressBar-text)",
                textActive:
                  "var(--bolt-elements-preview-addressBar-textActive)",
              },
            },
            terminals: {
              background: "var(--bolt-elements-terminals-background)",
              buttonBackground:
                "var(--bolt-elements-terminals-buttonBackground)",
            },
            dividerColor: "var(--bolt-elements-dividerColor)",
            loader: {
              background: "var(--bolt-elements-loader-background)",
              progress: "var(--bolt-elements-loader-progress)",
            },
            prompt: {
              background: "var(--bolt-elements-prompt-background)",
            },
            sidebar: {
              dropdownShadow: "var(--bolt-elements-sidebar-dropdownShadow)",
              buttonBackgroundDefault:
                "var(--bolt-elements-sidebar-buttonBackgroundDefault)",
              buttonBackgroundHover:
                "var(--bolt-elements-sidebar-buttonBackgroundHover)",
              buttonText: "var(--bolt-elements-sidebar-buttonText)",
            },
            cta: {
              background: "var(--bolt-elements-cta-background)",
              text: "var(--bolt-elements-cta-text)",
            },
          },
        },

        alpha: {
          gray: {
            2: "rgba(0, 0, 0, 0.02)",
            5: "rgba(0, 0, 0, 0.05)",
            10: "rgba(0, 0, 0, 0.1)",
            30: "rgba(0, 0, 0, 0.3)",
            50: "rgba(0, 0, 0, 0.5)",
            80: "rgba(0, 0, 0, 0.8)",
          },
          white: {
            5: "rgba(255, 255, 255, 0.05)",
            10: "rgba(255, 255, 255, 0.1)",
            20: "rgba(255, 255, 255, 0.2)",
            50: "rgba(255, 255, 255, 0.5)",
            80: "rgba(255, 255, 255, 0.8)",
          },
          accent: {
            5: "rgba(0, 0, 0, 0.05)",
            10: "rgba(0, 0, 0, 0.1)",
            20: "rgba(0, 0, 0, 0.2)",
            30: "rgba(0, 0, 0, 0.3)",
            500: "rgba(0, 0, 0, 0.5)",
          },
          red: {
            10: "rgba(0, 0, 0, 0.1)",
            20: "rgba(0, 0, 0, 0.2)",
          },
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          500: "rgba(0, 0, 0, 0.5)",
          600: "rgba(0, 0, 0, 0.6)",
          700: "rgba(0, 0, 0, 0.7)",
        },
        slate: {
          elevation1: "hsl(var(--slate-elevation-1))",
          elevation2: "hsl(var(--slate-elevation-2))",
          elevation3: "hsl(var(--slate-elevation-3))",
          elevation4: "hsl(var(--slate-elevation-4))",
          elevation5: "hsl(var(--slate-elevation-5))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    /**
		 * Error: Cannot find module '../../generated/base-components.css.json'
Require stack:
- /vercel/path0/node_modules/@assistant-ui/react/dist/tailwindcss/index.js
		 *
		 */
    // require("@assistant-ui/react/tailwindcss")({
    // 	components: ["thread"],
    // }),
  ],
};

export default config;
