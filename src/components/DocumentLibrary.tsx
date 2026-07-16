"use client";

import { SavedDocument } from "@/types/document";

type DocumentLibraryProps = {
  documents: SavedDocument[];
  onOpen: (document: SavedDocument) => void;
};

export default function DocumentLibrary({
  documents,
  onOpen,
}: DocumentLibraryProps) {
  if (documents.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="mb-3 text-lg font-semibold text-amber-200">
          Biblioteca
        </h2>

        <p className="text-sm text-zinc-500">
          Nenhum documento salvo ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h2 className="mb-6 text-lg font-semibold text-amber-200">
        Biblioteca
      </h2>

      <div className="space-y-4">
        {documents.map((document) => (
          <div
            key={document.id}
            className="rounded-xl border border-zinc-700 bg-zinc-950 p-4"
          >
            <p className="break-all font-medium text-amber-200">
              {document.name}
            </p>

            <p className="mt-2 text-xs text-zinc-500">
              Última abertura:{" "}
              {new Date(document.lastOpened).toLocaleString()}
            </p>

            <button
              type="button"
              onClick={() => onOpen(document)}
              className="
                mt-4
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
              "
            >
              Abrir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}