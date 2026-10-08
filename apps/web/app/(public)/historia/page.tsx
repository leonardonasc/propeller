export default function HistoryPage() {
  return (
    <div className="px-6 py-16 sm:px-10 lg:px-0">
      <div className="grid gap-12 lg:grid-cols-[180px_minmax(0,680px)_220px] lg:justify-center">
        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Nesta página
            </p>

            <nav className="space-y-3 text-sm">
              <a
                href="#inicio"
                className="block text-foreground transition-colors hover:text-primary"
              >
                O início
              </a>

              <a
                href="#crescimento"
                className="block text-muted-foreground transition-colors hover:text-foreground"
              >
                Crescimento
              </a>

              <a
                href="#presente"
                className="block text-muted-foreground transition-colors hover:text-foreground"
              >
                O presente
              </a>

              <a
                href="#futuro"
                className="block text-muted-foreground transition-colors hover:text-foreground"
              >
                O futuro
              </a>
            </nav>
          </div>
        </aside>

        <article>
          <header className="mb-14">
            <p className="mb-3 text-sm text-primary">
              Nossa história
            </p>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Uma ideia que foi tomando forma.
            </h1>

            <p className="mt-5 text-base leading-7 text-muted-foreground">
              Toda história começa com uma primeira decisão. A nossa começou
              com a vontade de construir algo simples, útil e que pudesse
              continuar evoluindo com o tempo.
            </p>
          </header>

          <div className="space-y-16">
            <section id="inicio" className="scroll-mt-8">
              <p className="mb-3 text-sm text-muted-foreground">
                01
              </p>

              <h2 className="text-2xl font-semibold">
                O início
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  O projeto nasceu de uma necessidade simples: organizar
                  melhor ideias, tarefas e objetivos em um único lugar.
                  O primeiro passo não tinha grandes pretensões.
                </p>

                <p>
                  Era apenas uma tentativa de transformar uma ideia em algo
                  concreto. Com o tempo, pequenas decisões começaram a formar
                  uma estrutura maior.
                </p>
              </div>
            </section>

            <section id="crescimento" className="scroll-mt-8">
              <p className="mb-3 text-sm text-muted-foreground">
                02
              </p>

              <h2 className="text-2xl font-semibold">
                Crescimento
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  Conforme o projeto cresceu, novas necessidades apareceram.
                  O que antes era apenas uma ferramenta simples passou a
                  reunir diferentes partes da rotina.
                </p>

                <p>
                  Cada nova funcionalidade trouxe também novos desafios.
                  Algumas ideias foram mantidas, outras foram abandonadas e
                  muitas acabaram sendo transformadas no caminho.
                </p>
              </div>
            </section>

            <section id="presente" className="scroll-mt-8">
              <p className="mb-3 text-sm text-muted-foreground">
                03
              </p>

              <h2 className="text-2xl font-semibold">
                O presente
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  Hoje, o projeto representa o resultado de todas essas
                  pequenas decisões. Uma experiência mais madura, mas que
                  ainda preserva a simplicidade que existia no começo.
                </p>

                <p>
                  O objetivo continua sendo o mesmo: tornar as coisas mais
                  claras, organizadas e fáceis de acompanhar.
                </p>
              </div>
            </section>

            <section id="futuro" className="scroll-mt-8">
              <p className="mb-3 text-sm text-muted-foreground">
                04
              </p>

              <h2 className="text-2xl font-semibold">
                O futuro
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  Ainda existe muito para construir. O projeto continua
                  aberto a novas ideias, mudanças e possibilidades.
                </p>

                <p>
                  Afinal, uma história não termina quando uma versão é
                  lançada. Ela continua cada vez que alguém encontra uma
                  nova maneira de usar aquilo que foi construído.
                </p>
              </div>
            </section>
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-8 border-l border-border pl-5">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Sobre
            </p>

            <dl className="space-y-5 text-sm">
              <div>
                <dt className="text-muted-foreground">
                  Categoria
                </dt>
                <dd className="mt-1 text-foreground">
                  História
                </dd>
              </div>

              <div>
                <dt className="text-muted-foreground">
                  Atualizado
                </dt>
                <dd className="mt-1 text-foreground">
                  Outubro de 2026
                </dd>
              </div>

              <div>
                <dt className="text-muted-foreground">
                  Leitura
                </dt>
                <dd className="mt-1 text-foreground">
                  3 min
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  )
}