import type { Metadata } from "next"
import { ApolloProviderWrapper } from "@/lib/apollo-provider"
import { AuthSessionProvider } from "@/lib/session-provider"
import Navigation from "@/components/navigation"
import "./globals.css"

export const metadata: Metadata = {
  title: "BibleProject - Group Bible Study",
  description: "Collaborative platform for group Bible study sessions",
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
