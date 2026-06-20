"use client";

import { useState } from "react";

type DocumentViewerProps = {
  content: string;
};

type ChatMessage = {
  question: string;
  answer: string;
  model: string;
};

export default function DocumentViewer({
  content,
}: DocumentViewerProps) {
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [model, setModel] = useState("llama3.2:3b");

  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isAsking, setIsAsking] = useState(false);

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
          model,
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

  async function handleAsk() {
    const currentQuestion = question.trim();

    if (!currentQuestion) return;

    setIsAsking(true);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: content,
          question: currentQuestion,
          model,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setChatHistory((currentHistory) => [
          ...currentHistory,
          {
            question: currentQuestion,
            answer: data.error || "Erro ao perguntar ao documento.",
            model,
          },
        ]);

        return;
      }

      setChatHistory((currentHistory) => [
        ...currentHistory,
        {
          question: currentQuestion,
          answer: data.answer,
          model,
        },
      ]);

      setQuestion("");
    } catch {
      setChatHistory((currentHistory) => [
        ...currentHistory,
        {
          question: currentQuestion,
          answer: "Erro ao conectar com a IA local.",
          model,
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-left">
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            {isSummarizing
              ? "Resumindo..."
              : "Resumir com IA local"}
          </button>
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-500">
            Modelo Local
          </label>

          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-zinc-700
              bg-zinc-900
              px-4
              py-3
              text-zinc-200
            "
          >
            <option value="llama3.2:3b">
              Llama 3.2 (3B)
            </option>

            <option value="qwen3:4b">
              Qwen 3 (4B)
            </option>
          </select>
        </div>
      </div>

      {summary && (
        <div className="mb-6 rounded-2xl border border-amber-500/20 bg-zinc-900/70 p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">
            Resumo ({model})
          </h3>

          <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
            {summary}
          </p>
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">
          Pergunte ao documento
        </h3>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ex.: Qual é o valor do aluguel?"
          className="
            min-h-24
            w-full
            rounded-xl
            border
            border-zinc-700
            bg-zinc-950
            p-4
            text-sm
            text-zinc-200
            outline-none
            placeholder:text-zinc-600
            focus:border-amber-500/50
          "
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleAsk}
            disabled={isAsking || !question.trim()}
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
            {isAsking ? "Perguntando..." : "Perguntar"}
          </button>

          {chatHistory.length > 0 && (
            <button
              onClick={() => setChatHistory([])}
              className="
                rounded-xl
                border
                border-zinc-700
                bg-zinc-950
                px-4
                py-2
                text-sm
                font-semibold
                text-zinc-400
                transition
                hover:border-zinc-500
                hover:text-zinc-200
              "
            >
              Limpar conversa
            </button>
          )}
        </div>

        {chatHistory.length > 0 && (
          <div className="mt-6 space-y-4">
            {chatHistory.map((message, index) => (
              <div
                key={`${message.question}-${index}`}
                className="rounded-xl border border-amber-500/20 bg-zinc-950 p-4"
              >
                <p className="mb-3 text-sm font-semibold text-amber-200">
                  Você perguntou:
                </p>

                <p className="mb-4 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                  {message.question}
                </p>

                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Resposta ({message.model})
                </p>

                <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                  {message.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-300">
        {content}
      </pre>
    </div>
  );
}
