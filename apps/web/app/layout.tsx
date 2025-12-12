import type { Metadata } from "next"
import { AuthSessionProvider } from "@/lib/session-provider"
import { ToastProvider } from "@/components/ui/toast"
import EnhancedNavigation from "@/components/EnhancedNavigation"
import MainLayout from "@/components/MainLayout"
import { AchievementNotificationToast } from "@/components/achievements/AchievementNotificationToast"
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
      <body className="bg-white">
        <AuthSessionProvider>
          <ToastProvider>
            <EnhancedNavigation />
            <MainLayout>
              {children}
            </MainLayout>
            <AchievementNotificationToast />
          </ToastProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
