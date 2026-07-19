"use client";

import { SavedDocument } from "@/types/document";

type DocumentLibraryProps = {
  documents: SavedDocument[];
  currentDocument?: string;
  onOpen: (document: SavedDocument) => void;
  onDelete: (id: string) => void;
};

export default function DocumentLibrary({
  documents,
  currentDocument,
  onOpen,
  onDelete,
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
            className={`rounded-xl border p-4 transition ${
              currentDocument === document.id
                ? "border-amber-500 bg-amber-950/20"
                : "border-zinc-700 bg-zinc-950"
            }`}
          >
            <p className="break-all font-medium text-amber-200">
              {document.name}
            </p>

            <p className="mt-2 text-xs text-zinc-500">
              Última abertura:{" "}
              {new Date(document.lastOpened).toLocaleString()}
            </p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => onOpen(document)}
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
                 "
              >
                 Abrir
              </button>

              <button
                type="button"
                onClick={() => onDelete(document.id)}
                className="
                  rounded-xl
                  border
                  border-red-500/30
                  bg-red-950/40
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-red-200
                  transition
                  hover:border-red-400/50
                  hover:bg-red-900/50
                "
              >
                Excluir
              </button>
           </div>
          </div>
        ))}
      </div>
    </div>
  );
}
