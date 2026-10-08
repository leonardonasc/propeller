"use client"

import { useRouter } from "next/navigation"
import LandingNav from "../../components/landing/landing-nav"
import PublicFooter from "../../components/public-footer"
import { authClient } from "../../lib/auth-client"

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const handleStart = () => {
    router.push(session ? "/dashboard" : "/login")
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="h-24">
        <LandingNav
          session={session}
          isPending={isPending}
          router={router}
          onStart={handleStart}
        />
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6">
          {children}
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}