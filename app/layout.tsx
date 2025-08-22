import type React from "react"
import type { Metadata } from "next"
import { Open_Sans, Anton, Geist } from "next/font/google"
import { AuthProvider } from "@/contexts/AuthContext"
import { QueryProvider } from "@/lib/providers/QueryProvider"
import { GoogleAuthProvider } from "@/components/auth/GoogleAuthProvider"
import { MobileNavigation } from "@/components/MobileNavigation"
import { Toaster } from "sonner"
import "./globals.css"

const openSans = Open_Sans({ 
  subsets: ["latin"],
  display: 'swap',
})
const anton = Anton({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: 'swap',
})
const geist = Geist({ 
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-geist",
  display: 'swap',
})

export const metadata: Metadata = {
  title: "MOTIV - Tonight is for the Ravers",
  description: "Unfiltered Lagos nightlife. Curated raves, no tickets lost, just vibes.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${openSans.className} ${anton.variable} ${geist.variable}`} suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <GoogleAuthProvider>
              {children}
              <MobileNavigation />
              <Toaster 
                position="top-right" 
                theme="dark"
                richColors
              />
            </GoogleAuthProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
