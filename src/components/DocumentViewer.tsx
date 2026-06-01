type DocumentViewerProps = {
  content: string;
};

export default function DocumentViewer({
  content,
}: DocumentViewerProps) {
  if (!content) return null;

  return (
    <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-left">
      <h2 className="mb-4 text-lg font-semibold text-amber-200">
        Conteúdo do Documento
      </h2>

      <pre className="whitespace-pre-wrap text-sm text-zinc-300">
        {content}
      </pre>
    </div>
  );
}
