import Link from "next/link"

const primary = [
  { label: "História", href: "/historia" },
  {
    label: "Repositório",
    href: "https://github.com/leonardonasc/propeller",
    external: true,
  },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Contato", href: "/contact" },
  { label: "Blog", href: "/blog" },
]

const secondary = [
  { label: "Política de Privacidade", href: "/privacy" },
  { label: "Termos de Serviço", href: "/terms" },
]

export default function PublicFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-6">
        <div className="mb-1 flex flex-col justify-between gap-x-20 gap-y-12 py-16 md:flex-row md:py-20">
          <div className="max-w-sm">
            <Link
              href="/"
              className="text-4xl font-bold tracking-tight text-primary"
            >
              Propeller
            </Link>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Tire suas ideias do papel. Organize seus projetos e dê
              impulso aos seus objetivos.
            </p>
          </div>

          <div className="flex flex-col gap-x-20 gap-y-10 sm:flex-row">
            <div>
              <h2 className="mb-3 text-sm font-semibold text-foreground">
                Explorar
              </h2>

              <ul className="flex flex-col gap-y-2">
                {primary.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold text-foreground">
                Legal
              </h2>

              <ul className="flex flex-col gap-y-2">
                {secondary.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-border py-5">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Propeller. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}