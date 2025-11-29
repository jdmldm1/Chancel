import type { Metadata } from "next"
import { ApolloProviderWrapper } from "@/lib/apollo-provider"
import { AuthSessionProvider } from "@/lib/session-provider"
import Navigation from "@/components/navigation"
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
      <body>
        <AuthSessionProvider>
          <ApolloProviderWrapper>
            <Navigation />
            {children}
          </ApolloProviderWrapper>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
