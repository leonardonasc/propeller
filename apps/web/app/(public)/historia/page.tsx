import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nossa história", description: "Conheça a história e a proposta do Propeller para organizar projetos, rotina e progresso." };

export default function HistoryPage() {
  return (
    <div className="py-16 sm:px-10 lg:px-0">
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
                O Propeller
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
            <p className="mb-3 text-sm text-primary">Nossa história</p>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Uma ideia que continua evoluindo.
            </h1>

            <p className="mt-5 text-base leading-7 text-muted-foreground">
              O Propeller é resultado de uma ideia que amadureceu com o
              tempo. O que começou como uma tentativa de simplificar a
              organização se tornou um projeto com novos objetivos, uma
              estrutura renovada e muito espaço para crescer.
            </p>
          </header>

          <div className="space-y-16">
            <section id="inicio" className="scroll-mt-8">
              <p className="mb-3 text-sm text-muted-foreground">01</p>

              <h2 className="text-2xl font-semibold">O início</h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  Tudo começou com o Newtion, uma ideia que surgiu da
                  necessidade de reunir tarefas, ideias e diferentes partes
                  da rotina em um único lugar. A proposta era simples:
                  tornar a organização mais acessível e fácil de acompanhar.
                </p>

                <p>
                  O primeiro projeto serviu como ponto de partida para
                  experimentar possibilidades, entender necessidades e
                  transformar uma ideia em algo concreto.
                </p>
              </div>
            </section>

            <section id="crescimento" className="scroll-mt-8">
              <p className="mb-3 text-sm text-muted-foreground">02</p>

              <h2 className="text-2xl font-semibold">Crescimento</h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  Conforme o Newtion evoluiu, novas ideias surgiram e
                  diferentes caminhos foram explorados. Esse processo trouxe
                  aprendizados sobre produto, desenvolvimento e, principalmente,
                  sobre o que realmente importa em uma ferramenta de organização.
                </p>

                <p>
                  Nem tudo precisava permanecer como estava. Algumas ideias
                  foram revistas, outras ficaram pelo caminho e muitas
                  ajudaram a definir uma direção mais clara para o projeto.
                  Foi desse aprendizado que nasceu a vontade de construir
                  algo melhor.
                </p>
              </div>
            </section>

            <section id="presente" className="scroll-mt-8">
              <p className="mb-3 text-sm text-muted-foreground">03</p>

              <h2 className="text-2xl font-semibold">O Propeller</h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  O Propeller representa uma nova etapa dessa jornada.
                  Mais do que uma nova versão, ele nasce com uma estrutura
                  renovada e um foco mais definido: ajudar a organizar
                  projetos, tarefas e objetivos de maneira simples e
                  consistente.
                </p>

                <p>
                  A proposta é reunir o que precisa ser feito, facilitar
                  o acompanhamento do progresso e trazer mais clareza ao
                  dia a dia, sem transformar a organização em mais uma
                  tarefa complicada.
                </p>
              </div>
            </section>

            <section id="futuro" className="scroll-mt-8">
              <p className="mb-3 text-sm text-muted-foreground">04</p>

              <h2 className="text-2xl font-semibold">O futuro</h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  Ainda existe muito para construir. O Propeller continua
                  em desenvolvimento, aberto a novas ideias, melhorias e
                  possibilidades que façam sentido para sua proposta.
                </p>

                <p>
                  O objetivo não é simplesmente acumular funcionalidades,
                  mas construir uma ferramenta que evolua com propósito.
                  Cada nova etapa é uma oportunidade de tornar a experiência
                  mais útil, clara e fácil de acompanhar.
                </p>

                <p>
                  Afinal, o Propeller não é apenas o resultado do que foi
                  construído até aqui, mas também de tudo o que ainda
                  podemos construir.
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
                <dt className="text-muted-foreground">Categoria</dt>
                <dd className="mt-1 text-foreground">História</dd>
              </div>

              <div>
                <dt className="text-muted-foreground">Atualizado</dt>
                <dd className="mt-1 text-foreground">Outubro de 2026</dd>
              </div>

              <div>
                <dt className="text-muted-foreground">Leitura</dt>
                <dd className="mt-1 text-foreground">3 min</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  )
}
