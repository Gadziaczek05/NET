# NET AI Studio

NET AI Studio to responsywna aplikacja webowa do tworzenia pomysłów, aplikacji, stron internetowych, gier i kodu z pomocą AI.

## Funkcje
- Asystent AI
- Tryb tworzenia aplikacji
- Tryb tworzenia stron WWW
- Tryb tworzenia gier webowych
- Tryb programistyczny do pisania i poprawiania kodu
- Podgląd wygenerowanego HTML
- Kopiowanie wyników
- Interfejs dostosowany do telefonu

## Wymagania
- Node.js 20 lub nowszy
- Klucz API OpenAI z dostępem do API

## Uruchomienie
1. Zainstaluj zależności: `npm install`
2. Skopiuj `.env.example` do `.env.local`
3. Wpisz klucz w `OPENAI_API_KEY` w `.env.local`
4. Uruchom: `npm run dev`
5. Otwórz `http://localhost:3000`

## Publikacja przez Vercel
1. Zaimportuj repozytorium GitHub `Gadziaczek05/NET` w Vercel.
2. Dodaj zmienną środowiskową `OPENAI_API_KEY`.
3. Opcjonalnie ustaw `OPENAI_MODEL`; domyślnie `gpt-5.5`.
4. Wybierz Deploy.

## Bezpieczeństwo
Klucz API jest używany wyłącznie po stronie serwera. Nie wpisuj go do kodu przeglądarki ani publicznego repozytorium. Korzystanie z API może generować opłaty zgodnie z cennikiem OpenAI.

## Ograniczenia wersji 1
NET generuje kod i pokazuje podgląd samodzielnych projektów HTML. Nie uruchamia automatycznie dowolnych projektów backendowych, nie instaluje aplikacji na telefonie i nie publikuje ich samodzielnie. To kolejne etapy rozwoju.