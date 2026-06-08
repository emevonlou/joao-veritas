import { NextResponse } from "next/server";
import { extractPdfText } from "@/lib/extractPdf";
import { extractDocxText } from "@/lib/extractDocx";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name.toLowerCase();

    if (file.type === "application/pdf" || fileName.endsWith(".pdf")) {
      const text = await extractPdfText(buffer);

      return NextResponse.json({
        text: text || "Não foi possível extrair texto deste PDF.",
      });
    }

    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx")
    ) {
      const text = await extractDocxText(buffer);

      return NextResponse.json({
        text: text || "Não foi possível extrair texto deste DOCX.",
      });
    }

    return NextResponse.json(
      { error: "Formato ainda não suportado nesta rota." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Erro ao processar documento:", error);

    return NextResponse.json(
      { error: "Erro ao processar o documento. Veja o terminal." },
      { status: 500 }
    );
  }
}
