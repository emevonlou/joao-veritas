import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("http://localhost:11434/api/tags");

    if (!response.ok) {
      return NextResponse.json(
        { error: "Não foi possível acessar o Ollama." },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      models: data.models ?? [],
    });
  } catch (error) {
    console.error("Erro ao buscar modelos:", error);

    return NextResponse.json(
      { error: "Erro ao buscar modelos." },
      { status: 500 }
    );
  }
}
