import LandingNav from "../../components/landing/landing-nav";
import PublicFooter from "../../components/public-footer";
import { LandingSessionProvider } from "../../components/landing/landing-session";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <LandingSessionProvider><div className="flex min-h-dvh flex-col bg-background text-foreground"><header className="h-24"><LandingNav /></header><main className="flex-1"><div className="mx-auto w-full max-w-7xl sm:px-10 lg:px-0">{children}</div></main><PublicFooter /></div></LandingSessionProvider>;
}
