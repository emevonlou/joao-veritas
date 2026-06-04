import { NextResponse } from "next/server";
import { extractPdfText } from "@/lib/extractPdf";

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

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      const text = await extractPdfText(buffer);

      return NextResponse.json({
        text: text || "Não foi possível extrair texto deste PDF.",
      });
    }

    return NextResponse.json(
      { error: "Formato ainda não suportado nesta rota." },
      { status: 400 }
    );
    } catch (error) {
      console.error("Erro ao processar PDF:", error);

      return NextResponse.json(
        { error: "Erro ao processar o documento. Veja o terminal." },
        { status: 500 }
      );
    }

}
