import { NextResponse } from "next/server";

const DEFAULT_MODEL = "llama3.2:3b";

export async function POST(request: Request) {
  try {
    const { text, model } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Nenhum texto enviado para resumo." },
        { status: 400 }
      );
    }

    const selectedModel =
      typeof model === "string" && model.trim()
        ? model.trim()
        : DEFAULT_MODEL;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        prompt: `Resuma em português, em até 5 linhas, com clareza:\n\n${text.slice(0, 8000)}`,
        stream: false,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Não foi possível conectar ao modelo ${selectedModel}.` },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      model: selectedModel,
      summary: data.response || "Não foi possível gerar resumo.",
    });
  } catch (error) {
    console.error("Erro ao resumir documento:", error);

    return NextResponse.json(
      { error: "Erro ao gerar resumo com IA local." },
      { status: 500 }
    );
  }
}
