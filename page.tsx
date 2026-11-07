 "use client";

import { useMemo, useState } from "react";

type Mode = "assistant" | "app" | "website" | "game" | "code";
type Message = { role: "user" | "ai"; text: string };

const modes: { id: Mode; label: string; icon: string; hint: string }[] = [
  { id: "assistant", label: "Asystent", icon: "✦", hint: "Zapytaj o cokolwiek..." },
  { id: "app", label: "Aplikacja", icon: "▣", hint: "Opisz aplikację, którą mam stworzyć..." },
  { id: "website", label: "Strona WWW", icon: "◎", hint: "Opisz wygląd i funkcje strony..." },
  { id: "game", label: "Gra", icon: "△", hint: "Opisz grę, którą chcesz zbudować..." },
  { id: "code", label: "Kod", icon: "{ }", hint: "Wklej kod lub opisz problem..." }
];

function cleanHtml(text: string) {
  return text.replace(/^```(?:html)?\s*/i, "").replace(/\s*```$/, "").trim();
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("assistant");
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"result" | "preview">("result");
  const [history, setHistory] = useState<Message[]>([]);

  const htmlPreview = useMemo(() => {
    const value = cleanHtml(answer);
    return /<html[\s>]|<!doctype html|<body[\s>]/i.test(value) ? value : "";
  }, [answer]);

  async function submit() {
    if (!prompt.trim() || busy) return;
    const current = prompt.trim();
    setPrompt("");
    setError("");
    setAnswer("");
    setTab("result");
    setHistory((items) => [...items, { role: "user", text: current }]);
    setBusy(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: current, mode })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Wystąpił błąd.");
      setAnswer(data.answer);
      setHistory((items) => [...items, { role: "ai", text: data.answer }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nie udało się połączyć z AI.");
    } finally {
      setBusy(false);
    }
  }

  async function copyAnswer() {
    if (!answer) return;
    try {
      await navigator.clipboard.writeText(answer);
    } catch {
      setError("Nie udało się skopiować. Zaznacz tekst i skopiuj ręcznie.");
    }
  }

  const selected = modes.find((item) => item.id === mode)!;

  return (
    <main className="shell">
      <aside className="sidebar">
        <a className="brand" href="#"><span className="brand-mark">N</span><span>NET<span className="brand-blue">.AI</span></span></a>
        <div className="side-label">WORKSPACE</div>
        <button className="side-link active"><span>✦</span> Studio AI</button>
        <div className="side-label second">NARZĘDZIA</div>
        {modes.slice(1).map((item) => (
          <button key={item.id} className={mode === item.id ? "side-link chosen" : "side-link"} onClick={() => setMode(item.id)}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
        <div className="sidebar-bottom"><span className="status-dot" /> NET AI Studio <small>Wersja 1.0</small></div>
      </aside>

      <section className="main">
        <header className="topbar">
          <div className="breadcrumb">NET <span>/</span> Studio AI</div>
          <div className="online"><span className="status-dot" /> PANEL AI</div>
        </header>

        <div className="content">
          <div className="hero">
            <div className="eyebrow"><span className="spark">✦</span> TWOJE CENTRUM KREATYWNE</div>
            <h1>Co dziś <span>tworzymy?</span></h1>
            <p>Od pomysłu do kodu. Twórz aplikacje, strony internetowe, gry i wiele więcej z pomocą AI.</p>
          </div>

          <div className="mode-grid">
            {modes.map((item) => (
              <button key={item.id} onClick={() => setMode(item.id)} className={mode === item.id ? "mode-card selected" : "mode-card"}>
                <span className="mode-icon">{item.icon}</span>
                <span className="mode-name">{item.label}</span>
                <span className="mode-arrow">↗</span>
              </button>
            ))}
          </div>

          <section className="composer">
            <div className="composer-head"><span className="composer-icon">{selected.icon}</span><div><strong>{selected.label}</strong><small>{selected.hint}</small></div><span className="model-tag">NET ENGINE</span></div>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void submit(); } }} placeholder={selected.hint} />
            <div className="composer-foot"><span>Enter aby wysłać · Shift + Enter nowa linia</span><button className="send-button" onClick={() => void submit()} disabled={busy || !prompt.trim()}>{busy ? "Pracuję..." : "Generuj"} <span>↑</span></button></div>
          </section>

          {busy && <div className="loading"><span className="loader" /> NET AI przygotowuje odpowiedź...</div>}
          {error && <div className="error-box">{error}</div>}

          {answer && <section className="output">
            <div className="output-head"><div><span className="output-dot" /> WYNIK GENEROWANIA</div><button onClick={() => void copyAnswer()}>Kopiuj kod / tekst</button></div>
            {htmlPreview && <div className="tabs"><button className={tab === "result" ? "tab active-tab" : "tab"} onClick={() => setTab("result")}>Kod</button><button className={tab === "preview" ? "tab active-tab" : "tab"} onClick={() => setTab("preview")}>Podgląd</button></div>}
            {tab === "preview" && htmlPreview ? <iframe className="preview" title="Podgląd projektu" sandbox="allow-scripts" srcDoc={htmlPreview} /> : <pre className="answer">{answer}</pre>}
          </section>}

          {!answer && !busy && history.length === 0 && <div className="suggestions"><span className="suggest-title">MOŻESZ ZACZĄĆ OD</span><div className="suggest-list">
            <button onClick={() => { setMode("app"); setPrompt("Stwórz nowoczesną aplikację do zarządzania zadaniami z możliwością dodawania, edycji i oznaczania zadań."); }}>Zbuduj aplikację do zadań <span>↗</span></button>
            <button onClick={() => { setMode("website"); setPrompt("Stwórz nowoczesną stronę portfolio z animacjami i responsywnym układem."); }}>Zaprojektuj stronę WWW <span>↗</span></button>
            <button onClick={() => { setMode("game"); setPrompt("Stwórz prostą grę zręcznościową działającą na telefonie."); }}>Stwórz grę na telefon <span>↗</span></button>
          </div></div>}
          <footer>NET AI STUDIO <span>•</span> ZBUDUJ COŚ WŁASNEGO</footer>
        </div>
      </section>
    </main>
  );
}