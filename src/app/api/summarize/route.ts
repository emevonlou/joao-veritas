import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Nenhum texto enviado para resumo." },
        { status: 400 }
      );
    }

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2:3b",
        prompt: `Resuma em português, em até 5 linhas, com clareza:\n\n${text.slice(0, 8000)}`,
        stream: false,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Não foi possível conectar ao Ollama." },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
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

