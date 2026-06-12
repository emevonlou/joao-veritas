"use client";

import { useState } from "react";

type DocumentViewerProps = {
  content: string;
};

export default function DocumentViewer({
  content,
}: DocumentViewerProps) {
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  if (!content) return null;

  async function handleSummarize() {
    setSummary("");
    setIsSummarizing(true);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSummary(data.error || "Erro ao gerar resumo.");
        return;
      }

      setSummary(data.summary);
    } catch {
      setSummary("Erro ao conectar com a IA local.");
    } finally {
      setIsSummarizing(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-left">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-amber-200">
          Conteúdo do Documento
        </h2>

        <button
          onClick={handleSummarize}
          disabled={isSummarizing}
          className="
            rounded-xl
            border
            border-amber-500/30
            bg-zinc-900
            px-4
            py-2
            text-sm
            font-semibold
            text-zinc-200
            transition
            hover:border-amber-300/50
            hover:bg-zinc-800
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {isSummarizing ? "Resumindo..." : "Resumir com IA local"}
        </button>
      </div>

      {summary && (
        <div className="mb-6 rounded-2xl border border-amber-500/20 bg-zinc-900/70 p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">
            Resumo
          </h3>

          <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
            {summary}
          </p>
        </div>
      )}

      <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-300">
        {content}
      </pre>
    </div>
  );
}
