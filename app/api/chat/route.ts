import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const modes: Record<string, string> = {
  assistant: "Jesteś wszechstronnym asystentem NET. Odpowiadasz po polsku, konkretnie i praktycznie.",
  app: "Jesteś doświadczonym programistą. Projektujesz kompletne aplikacje. Gdy użytkownik prosi o aplikację, przygotuj działający, samodzielny plik HTML z CSS i JavaScript, chyba że wyraźnie poprosi o inny stos technologiczny. Dodaj responsywny wygląd i opisz uruchomienie.",
  website: "Jesteś ekspertem od projektowania i programowania stron. Twórz kompletne, responsywne strony. Domyślnie zwracaj samodzielny HTML z CSS i JavaScript, gotowy do podglądu w przeglądarce.",
  game: "Jesteś twórcą gier webowych. Twórz gry działające w przeglądarce, domyślnie jako jeden kompletny plik HTML z CSS i JavaScript. Dodawaj sterowanie dotykowe, jeśli gra ma działać na telefonie.",
  code: "Jesteś starszym programistą. Pisz, analizuj, naprawiaj i objaśniaj kod. Podawaj kompletne fragmenty, wskazuj pliki i nie ukrywaj ważnych zależności."
};

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Brakuje klucza API. Dodaj OPENAI_API_KEY w ustawieniach zmiennych środowiskowych projektu." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const mode = typeof body.mode === "string" && modes[body.mode] ? body.mode : "assistant";

    if (!prompt) return NextResponse.json({ error: "Wpisz, co mam dla Ciebie zrobić." }, { status: 400 });
    if (prompt.length > 12000) return NextResponse.json({ error: "Opis jest za długi. Maksymalnie 12 000 znaków." }, { status: 400 });

    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions: [
        modes[mode],
        "Jesteś częścią produktu NET AI Studio.",
        "Pisz po polsku, chyba że użytkownik poprosi o inny język.",
        "Nie twierdź, że uruchomiłeś, opublikowałeś lub zapisałeś projekt, jeśli tego faktycznie nie zrobiłeś.",
        "W zadaniach programistycznych podawaj kod, który jest możliwie kompletny, oraz instrukcję użycia.",
        "Nie umieszczaj sekretów, kluczy API ani haseł w kodzie po stronie przeglądarki."
      ].join("\n"),
      input: prompt,
      max_output_tokens: 7000
    });

    return NextResponse.json({ answer: response.output_text || "Model nie zwrócił tekstu. Spróbuj ponownie." });
  } catch (error) {
    console.error("NET AI error:", error);
    return NextResponse.json(
      { error: "Nie udało się uzyskać odpowiedzi AI. Sprawdź klucz API, limit konta i spróbuj ponownie." },
      { status: 500 }
    );
  }
}