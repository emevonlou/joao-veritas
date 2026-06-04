"use client";

import { useRef, useState } from "react";
import DocumentViewer from "@/components/DocumentViewer";

export default function FileUploader() {
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function openFilePicker() {
    inputRef.current?.click();
  }

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setFileName(file.name);
    setContent("");
    setIsLoading(true);

    try {
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const text = await file.text();
        setContent(text);
        return;
      }

      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/extract", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          setContent(data.error || "Erro ao ler o PDF.");
          return;
        }

        setContent(data.text);
        return;
      }

      setContent(
        "Por enquanto, o João Veritas lê TXT e PDF. DOCX e ODT serão adicionados nas próximas etapas."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
      <div className="text-center">
        <span className="mb-6 block text-sm tracking-wide text-zinc-400">
          Selecione um documento para análise
        </span>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt,.odt"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={openFilePicker}
          className="
            rounded-2xl
            border
            border-amber-500/30
            bg-zinc-900
            px-8
            py-4
            font-semibold
            text-zinc-200
            transition
            hover:border-amber-300/50
            hover:bg-zinc-800
          "
        >
          Selecionar Documento
        </button>

        {!fileName && (
          <p className="mt-4 text-sm text-zinc-500">
            PDF • DOCX • ODT • TXT
          </p>
        )}

        {fileName && (
          <div className="mt-6 rounded-xl border border-amber-500/20 bg-zinc-950 p-4">
            <p className="text-sm text-zinc-400">
              Documento selecionado
            </p>

            <p className="mt-1 font-medium text-amber-200">
              {fileName}
            </p>
          </div>
        )}

        {isLoading && (
          <p className="mt-4 text-sm text-zinc-400">
            Lendo documento...
          </p>
        )}
      </div>

      <DocumentViewer content={content} />
    </div>
  );
}