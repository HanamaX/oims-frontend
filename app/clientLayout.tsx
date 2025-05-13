"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style jsx global>{`
          body {
            margin: 0;
            padding: 0;
            font-family: var(--font-inter);
            background-color: var(--background);
            color: var(--foreground);
            transition: background-color 0.3s ease, color 0.3s ease;
          }
          
          :root {
            --background: #ffffff;
            --foreground: #000000;
            --primary: #0070f3;
            --primary-foreground: #ffffff;
            --secondary: #f5f5f5;
            --secondary-foreground: #000000;
            --accent: #f0f0f0;
            --accent-foreground: #000000;
            --muted: #f5f5f5;
            --muted-foreground: #6b7280;
            --card: #ffffff;
            --card-foreground: #000000;
            --border: #e5e7eb;
            --input: #e5e7eb;
            --ring: #0070f3;
          }
          
          [data-theme="dark"] {
            --background: #1a1a1a;
            --foreground: #ffffff;
            --primary: #0070f3;
            --primary-foreground: #ffffff;
            --secondary: #2d2d2d;
            --secondary-foreground: #ffffff;
            --accent: #333333;
            --accent-foreground: #ffffff;
            --muted: #2d2d2d;
            --muted-foreground: #a1a1aa;
            --card: #1a1a1a;
            --card-foreground: #ffffff;
            --border: #333333;
            --input: #333333;
            --ring: #0070f3;
          }
          
          * {
            box-sizing: border-box;
          }
        `}</style>
      </head>
      <body style={{ fontFamily: inter.style.fontFamily }}>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
