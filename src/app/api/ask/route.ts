import { NextResponse } from "next/server";

const DEFAULT_MODEL = "llama3.2:3b";
const MAX_DOCUMENT_LENGTH = 12000;

type OllamaResponse = {
  response?: string;
};

function extractSection(
  output: string,
  section: "RESPOSTA" | "TRECHO"
): string {
  const pattern =
    section === "RESPOSTA"
      ? /RESPOSTA:\s*([\s\S]*?)(?=\n\s*TRECHO:|$)/i
      : /TRECHO:\s*([\s\S]*)$/i;

  return output.match(pattern)?.[1]?.trim() ?? "";
}

function normalizeText(value: string): string {
  return value
    .replace(/^["“”']|["“”']$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, question, model } = body;

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

    const documentText = text.slice(0, MAX_DOCUMENT_LENGTH);

    const prompt = `
Você é o João Veritas, um assistente documental local e privado.

Responda em português usando somente informações presentes no documento.

Depois da resposta, copie literalmente um trecho curto do documento que fundamenta a resposta.

Não invente informações.
Não altere o trecho citado.
Se a informação não estiver no documento, diga isso na resposta e deixe o trecho vazio.

Use obrigatoriamente este formato:

RESPOSTA:
Sua resposta objetiva.

TRECHO:
Trecho literal copiado do documento.

DOCUMENTO:
${documentText}

PERGUNTA:
${question}
`;

    const ollamaResponse = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          prompt,
          stream: false,
        }),
      }
    );

    if (!ollamaResponse.ok) {
      return NextResponse.json(
        {
          error: `Não foi possível conectar ao modelo ${selectedModel}.`,
        },
        { status: 500 }
      );
    }

    const data = (await ollamaResponse.json()) as OllamaResponse;
    const output = data.response?.trim() ?? "";

    const answer =
      extractSection(output, "RESPOSTA") ||
      output ||
      "Não foi possível gerar resposta.";

    const extractedExcerpt = normalizeText(
      extractSection(output, "TRECHO")
    );

    const normalizedDocument = normalizeText(documentText);

    const excerpt =
      extractedExcerpt &&
      normalizedDocument.includes(extractedExcerpt)
        ? extractedExcerpt
        : "";

    return NextResponse.json({
      model: selectedModel,
      answer,
      excerpt,
    });
  } catch (error) {
    console.error("Erro ao perguntar ao documento:", error);

    return NextResponse.json(
      { error: "Erro ao perguntar ao documento." },
      { status: 500 }
    );
  }
}
