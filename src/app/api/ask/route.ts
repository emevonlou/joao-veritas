import { NextResponse } from "next/server";

const DEFAULT_MODEL = "llama3.2:3b";

export async function POST(request: Request) {
  try {
    const { text, question, model } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Nenhum documento enviado." },
        { status: 400 }
      );
    }

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Nenhuma pergunta enviada." },
        { status: 400 }
      );
    }

    const selectedModel =
      typeof model === "string" && model.trim()
        ? model.trim()
        : DEFAULT_MODEL;

    const prompt = `
Você é o João Veritas, um assistente documental local e privado.

Responda em português, com clareza, usando apenas as informações do documento abaixo.
Se a resposta não estiver no documento, diga: "Não encontrei essa informação no documento."

Documento:
${text.slice(0, 12000)}

Pergunta:
${question}
`;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        prompt,
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
      answer: data.response || "Não foi possível gerar resposta.",
    });
  } catch (error) {
    console.error("Erro ao perguntar ao documento:", error);

    return NextResponse.json(
      { error: "Erro ao perguntar ao documento." },
      { status: 500 }
    );
  }
}
