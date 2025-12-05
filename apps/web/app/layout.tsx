import type { Metadata } from "next"
import { AuthSessionProvider } from "@/lib/session-provider"
import { ToastProvider } from "@/components/ui/toast"
import EnhancedNavigation from "@/components/EnhancedNavigation"
import MainLayout from "@/components/MainLayout"
import "./globals.css"

export const metadata: Metadata = {
  title: "Chancel - Sacred Space. Shared Study.",
  description: "Online Bible study platform for collaborative group sessions",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <AuthSessionProvider>
          <ToastProvider>
            <EnhancedNavigation />
            <MainLayout>
              {children}
            </MainLayout>
          </ToastProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
