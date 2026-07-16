"use client";

import { useEffect, useState } from "react";

import DocumentViewer from "@/components/DocumentViewer";
import DocumentLibrary from "@/components/DocumentLibrary";

import { SavedDocument } from "@/types/document";

import {
  getDocuments,
  saveDocument,
} from "@/lib/documentStorage";

export default function FileUploader() {
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("");

  const [documents, setDocuments] = useState<
    ReturnType<typeof getDocuments>
  >([]);

  useEffect(() => {
    setDocuments(getDocuments());
  }, []);

  function storeDocument(file: File, extractedText: string) {
    const now = Date.now();

    saveDocument({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      content: extractedText,
      createdAt: now,
      lastOpened: now,
    });

    setDocuments(getDocuments());
  }

  async function processFile(file: File) {
    setFileName(file.name);
    setContent("");
    setIsLoading(true);
    setStatus(`Arquivo recebido: ${file.name}`);

    try {
      const lowerFileName = file.name.toLowerCase();

      if (lowerFileName.endsWith(".txt")) {
        const text = await file.text();

        setContent(text);
        storeDocument(file, text);
        setStatus(`TXT lido e salvo com sucesso: ${file.name}`);
        return;
      }

      if (
        lowerFileName.endsWith(".pdf") ||
        lowerFileName.endsWith(".docx") ||
        lowerFileName.endsWith(".odt")
      ) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/extract", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          setContent(data.error || "Erro ao ler o documento.");
          setStatus("Erro ao processar documento.");
          return;
        }

        const extractedText =
          typeof data.text === "string" ? data.text : "";

        if (!extractedText.trim()) {
          setContent("Nenhum texto foi encontrado neste documento.");
          setStatus("O documento não possui texto extraível.");
          return;
        }

        setContent(extractedText);
        storeDocument(file, extractedText);
        setStatus(`Documento lido e salvo com sucesso: ${file.name}`);
        return;
      }

      setContent(
        "Formato não suportado. O João Veritas lê TXT, PDF, DOCX e ODT."
      );
      setStatus("Formato ainda não suportado.");
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);

      setContent("Não foi possível processar este arquivo.");
      setStatus("Erro ao processar arquivo.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setStatus("Tentando receber arquivo...");

    const file = event.currentTarget.files?.[0];

    if (!file) {
      setStatus("Nenhum arquivo chegou ao app.");
      return;
    }

    await processFile(file);
  }

  function openSavedDocument(document: SavedDocument) {
    setFileName(document.name);
    setContent(document.content);
    setStatus(`Documento aberto da biblioteca: ${document.name}`);
  }

  return (
    <div
      className={`rounded-2xl border p-8 transition ${
        isDragging
          ? "border-amber-400 bg-zinc-800/80"
          : "border-zinc-800 bg-zinc-900/60"
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => {
        setIsDragging(false);
      }}
      onDrop={async (event) => {
        event.preventDefault();
        setIsDragging(false);

        const file = event.dataTransfer.files?.[0];

        if (!file) {
          setStatus("Nenhum arquivo recebido por arrastar e soltar.");
          return;
        }

        await processFile(file);
      }}
    >
      <div className="text-center">
        <span className="mb-6 block text-sm tracking-wide text-zinc-400">
          Selecione ou arraste um documento para análise
        </span>

        <input
          type="file"
          name="document"
          accept=".txt,.pdf,.docx,.odt"
          onChange={handleFileChange}
          className="
            mx-auto
            block
            w-full
            max-w-sm
            rounded-xl
            border
            border-amber-500/30
            bg-zinc-950
            p-3
            text-sm
            text-zinc-300
          "
        />

        {status && (
          <p className="mt-4 break-words text-sm text-amber-200">
            {status}
          </p>
        )}

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

            <p className="mt-1 break-all text-sm font-medium text-amber-200">
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

      <DocumentLibrary
        documents={documents}
        onOpen={openSavedDocument}
      />
    </div>
  );
}
