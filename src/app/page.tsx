import FileUploader from "@/components/FileUploader";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#08080b] text-zinc-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#3f2f15_0%,transparent_35%),radial-gradient(circle_at_bottom_right,#1e293b_0%,transparent_35%)]" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <div className="max-w-5xl rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-10 text-center shadow-2xl backdrop-blur">
          <div className="mb-6 inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-200">
            Per Intelligentiam ad Veritatem
          </div>

          <h1 className="bg-gradient-to-r from-amber-200 via-zinc-100 to-sky-200 bg-clip-text text-6xl font-black tracking-tight text-transparent md:text-8xl">
            João Veritas
          </h1>

          <p className="mt-6 text-xl text-zinc-300 md:text-2xl">
            Leitor inteligente de documentos com IA
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-zinc-400 md:text-lg">
            Um app para ler, organizar, pesquisar e compreender documentos com
            clareza — onde arquivos deixam de ser silêncio e começam a revelar
            a verdade.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-2xl bg-amber-300 px-7 py-4 font-bold text-zinc-950 shadow-lg shadow-amber-950/30 transition hover:bg-amber-200">
              Enviar documento
            </button>

            <button className="rounded-2xl border border-zinc-700 px-7 py-4 font-bold text-zinc-200 transition hover:border-amber-300/60 hover:bg-zinc-900">
              Abrir biblioteca
            </button>
          </div>

          <div className="mt-10">
            <FileUploader />
          </div>

          <div className="mt-12 grid gap-4 text-left md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
              <h2 className="font-bold text-amber-200">
                PDF, DOCX e ODT
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Leitura de documentos em múltiplos formatos.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
              <h2 className="font-bold text-amber-200">
                Resumo com IA
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Extração de pontos importantes e explicações simples.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
              <h2 className="font-bold text-amber-200">
                Modo jurídico
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Apoio para contratos, peças, cláusulas e análise documental.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
