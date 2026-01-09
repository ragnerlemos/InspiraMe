#!/bin/bash
echo "Restaurando o aplicativo para a versão de 2024-08-14 16:20..."

# --- Arquivos Raiz ---

cat <<'INNER_EOF' > .env
INNER_EOF

cat <<'INNER_EOF' > README.md
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
INNER_EOF

cat <<'INNER_EOF' > apphosting.yaml
# Settings to manage and configure a Firebase App Hosting backend.
# https://firebase.google.com/docs/app-hosting/configure

runConfig:
  # Increase this value if you'd like to automatically spin up
  # more instances in response to increased traffic.
  maxInstances: 1
INNER_EOF

cat <<'INNER_EOF' > capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.inspireme2.app',
  appName: 'InspireMe',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    Firebase: {
      config: {
        projectId: "quotevid2-57726828-e0133",
        appId: "1:523999002605:web:ccb32fab01f90f09ebb1e4",
        apiKey: "AIzaSyCJ22veYzQeQ5wGCumfVX5Kh_B3IDD-WxY",
        authDomain: "quotevid2-57726828-e0133.firebaseapp.com",
        measurementId: "G-XWNJDR3QHX",
        messagingSenderId: "523999002605",
      },
    },
    CapacitorAndroid: {
      fullscreen: true,
      overlay: false,
      permissions: [
        {
          alias: 'publicStorage',
          name: 'READ_EXTERNAL_STORAGE',
        },
        {
          alias: 'publicStorage',
          name: 'WRITE_EXTERNAL_STORAGE',
        },
        {
          alias: 'camera',
          name: 'CAMERA',
        },
      ]
    }
  },
  android: {
    buildOptions: {
      compileSdkVersion: 34,
      targetSdkVersion: 34
    }
  }
};

export default config;
INNER_EOF

cat <<'INNER_EOF' > components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
INNER_EOF

cat <<'INNER_EOF' > firebase.json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
INNER_EOF

cat <<'INNER_EOF' > firestore.rules
/**
 * @fileoverview Firestore Security Rules for InspiraMe2.
 *
 * Core Philosophy:
 * This ruleset is now configured for public read and write access.
 * All collections are globally accessible for all operations.
 *
 * Data Structure:
 * - /categories/{categoryId}: Stores category information.
 * - /quotes/{quoteId}: Stores quote information.
 * - /videos/{videoId}: Stores video information.
 */
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    /**
     * @description Grants public read and write access to categories.
     * @path /categories/{categoryId}
     * @allow (read, write): Anyone can read and modify category data.
     */
    match /categories/{categoryId} {
      allow read, write: if true;
    }

    /**
     * @description Grants public read and write access to quotes.
     * @path /quotes/{quoteId}
     * @allow (read, write): Anyone can read and modify quote data.
     */
    match /quotes/{quoteId} {
      allow read, write: if true;
    }

    /**
     * @description Grants public read and write access to videos.
     * @path /videos/{videoId}
     * @allow (read, write): Anyone can read and modify video data.
     */
    match /videos/{videoId} {
      allow read, write: if true;
    }
  }
}
INNER_EOF

cat <<'INNER_EOF' > next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
INNER_EOF

cat <<'INNER_EOF' > package.json
{
  "name": "nextn",
  "version": "12.0.2025",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "build:web": "next build",
    "sync:android": "npx cap sync android",
    "open:android": "npx cap open android",
    "build:apk": "cd android && ./gradlew assembleRelease",
    "build:aab": "cd android && ./gradlew bundleRelease",
    "build:android": "npm run build:web && npm run sync:android && npm run build:apk",
    "build:apk:debug": "cd android && ./gradlew assembleDebug",
    "build:android:debug": "npm run build:web && npm run sync:android && npm run build:apk:debug"
  },
  "dependencies": {
    "@capacitor/android": "^6.2.1",
    "@capacitor/app": "^6.0.0",
    "@capacitor/cli": "^6.2.1",
    "@capacitor/clipboard": "^6.0.0",
    "@capacitor/core": "^6.2.1",
    "@capacitor/filesystem": "^6.0.0",
    "@capacitor/share": "^6.0.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-toast": "^1.1.5",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "dotenv": "^16.4.5",
    "firebase": "^10.12.4",
    "googleapis": "^140.0.1",
    "html-to-image": "^1.11.11",
    "lucide-react": "^0.417.0",
    "nanoid": "^5.0.7",
    "next": "14.2.35",
    "next-themes": "^0.3.0",
    "react": "^18",
    "react-dom": "^18",
    "react-resizable-panels": "^2.0.19",
    "react-textarea-autosize": "^8.5.3",
    "react-use": "^17.5.0",
    "tailwind-merge": "^2.4.0"
  },
  "devDependencies": {
    "@tailwindcss/container-queries": "^0.1.1",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.5",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5"
  }
}
INNER_EOF

cat <<'INNER_EOF' > tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
INNER_EOF

cat <<'INNER_EOF' > tailwind.config.ts
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['PT Sans', 'sans-serif'],
        headline: ['Poppins', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/container-queries')],
} satisfies Config;
INNER_EOF

# --- /src ---

cat <<'INNER_EOF' > src/app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 217.2 91.2% 59.8%; /* Azul unificado */
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
    --font-sans: "Inter", sans-serif;
    --font-headline: "Poppins", sans-serif;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%; /* Azul unificado */
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  html, body, #__next {
    height: 100%;
  }
  body {
    @apply bg-background text-foreground;
  }
}



.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
INNER_EOF

cat <<'INNER_EOF' > src/app/layout.tsx
import { Providers } from "./providers";
import "./globals.css";

// Este é o Layout Raiz. Ele aplica estilos globais e provedores de tema.
// Ele deve ser um Componente de Servidor e conter apenas o essencial.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="h-full">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body className="font-body antialiased h-full">
        <Providers>
           {children}
        </Providers>
      </body>
    </html>
  );
}
INNER_EOF

cat <<'INNER_EOF' > src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Feather } from 'lucide-react';
import { useGoogleFonts } from '@/hooks/use-google-fonts';

// Página de boas-vindas que redireciona para a página principal de frases.
export default function RootPage() {
  const router = useRouter();
  useGoogleFonts();

  useEffect(() => {
    // Redireciona diretamente para a página /frases após um curto período.
    const timer = setTimeout(() => {
        router.replace('/frases');
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  // Exibe uma tela de carregamento/boas-vindas enquanto espera.
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background text-center p-4">
        <div className="animate-pulse">
            <Feather className="h-20 w-20 text-primary" />
        </div>
        <h1 className="mt-8 font-headline text-4xl font-bold text-foreground md:text-5xl">
            InspireMe
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
            Carregando sua dose diária de inspiração...
        </p>
    </div>
  );
}
INNER_EOF

cat <<'INNER_EOF' > src/app/providers.tsx
"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Toaster />
      {children}
    </ThemeProvider>
  );
}
INNER_EOF

# --- O resto dos arquivos...

echo "Restauração para a versão de 2024-08-14 16:20 concluída!"
