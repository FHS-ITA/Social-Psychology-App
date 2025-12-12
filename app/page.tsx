"use client";

import { useState, useEffect } from "react";
import { Mic, Type, Camera, Info, Sparkles, ArrowLeft, RefreshCw, BookOpen, Clock, Trash2 } from "lucide-react";
import AudioInput from "./components/AudioInput";
import TextInput from "./components/TextInput";
import PhotoInput from "./components/PhotoInput";
import ResultCard from "./components/ResultCard";
import { useHistory } from "./context/HistoryContext";

type InputMode = "home" | "audio" | "text" | "photo" | "results" | "history";

export default function Home() {
  const [mode, setMode] = useState<InputMode>("home");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { addToHistory, history, deleteFromHistory } = useHistory();

  const handleAnalyze = async (data: any) => {
    setLoading(true);
    try {
      // Logic adaptation for different inputs
      let payload: any = {};
      let type: "text" | "audio" | "photo" = "text";
      let historyInput = "";

      if (typeof data === "string") {
        payload = { text: data };
        type = "text";
        historyInput = data;
      } else if (data instanceof Blob) {
        const isImage = data.type.startsWith("image/");

        const reader = new FileReader();
        reader.readAsDataURL(data);
        await new Promise((resolve) => (reader.onload = resolve));
        const base64Data = (reader.result as string).split(",")[1];

        if (isImage) {
          payload = {
            image: base64Data,
            mimeType: data.type
          };
          type = "photo";
          historyInput = "Foto Caricata (" + new Date().toLocaleTimeString() + ")";
        } else {
          payload = { audio: base64Data };
          type = "audio";
          historyInput = "Nota Vocale (" + new Date().toLocaleTimeString() + ")";
        }
      } else {
        payload = { text: "Input non riconosciuto" };
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (response.ok) {
        setResults(json);
        setMode("results");
        // Save to history automatically
        addToHistory({
          input: historyInput.substring(0, 100) + (historyInput.length > 100 ? "..." : ""),
          type: type,
          results: json
        });
      } else {
        alert(json.error || "Errore sconosciuto");
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Errore nella generazione. Controlla la console.");
    } finally {
      setLoading(false);
    }
  };

  if (mode === "history") {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 font-sans">
        <header className="max-w-md mx-auto flex items-center justify-between mb-8 pt-4">
          <button
            onClick={() => setMode("home")}
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Home</span>
          </button>
          <h1 className="text-xl font-bold text-primary dark:text-blue-400">Archivio</h1>
          <div className="w-20" />
        </header>

        <main className="max-w-md mx-auto space-y-4 pb-20">
          {history.length === 0 ? (
            <div className="text-center py-20 text-neutral-400">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Nessun contenuto salvato.</p>
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    {item.type === 'text' && <Type className="w-3 h-3" />}
                    {item.type === 'audio' && <Mic className="w-3 h-3" />}
                    {item.type === 'photo' && <Camera className="w-3 h-3" />}
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <button onClick={() => deleteFromHistory(item.id)} className="text-red-300 hover:text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-neutral-800 dark:text-neutral-200 line-clamp-2 font-medium mb-3 border-l-2 border-primary/20 pl-3">
                  {item.input}
                </p>
                <button
                  onClick={() => {
                    setResults(item.results);
                    setMode("results");
                  }}
                  className="w-full py-2 bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-medium rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3 h-3" />
                  Vedi Contenuti
                </button>
              </div>
            ))
          )}
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            <Sparkles className="w-16 h-16 text-primary animate-spin-slow" />
          </div>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-white mt-4">Generazione Magica in corso...</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm animate-pulse">L'IA sta creando i tuoi post social ✨</p>
        </div>
      </div>
    );
  }

  if (mode === "results" && results) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 font-sans">
        <header className="max-w-4xl mx-auto flex items-center justify-between mb-8 pt-4">
          <button
            onClick={() => setMode("home")}
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Home</span>
          </button>
          <h1 className="text-xl font-bold text-primary dark:text-blue-400">Contenuti Generati</h1>
          <div className="w-20" /> {/* Spacer */}
        </header>

        <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          <ResultCard platform="instagram" data={results.instagram} />
          <ResultCard platform="tiktok" data={results.tiktok} />
          <ResultCard platform="youtube" data={results.youtube} />
          <ResultCard platform="facebook" data={results.facebook} />
        </main>

        <div className="max-w-4xl mx-auto flex justify-center pb-8">
          <button
            onClick={() => setMode("home")}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full shadow-sm hover:shadow-md transition-all text-neutral-600 dark:text-neutral-300 font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Nuova Generazione</span>
          </button>
        </div>
      </div>
    );
  }

  if (mode === "audio") {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <AudioInput onBack={() => setMode("home")} onAnalyze={handleAnalyze} />
      </div>
    );
  }

  if (mode === "text") {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <TextInput onBack={() => setMode("home")} onAnalyze={handleAnalyze} />
      </div>
    );
  }

  if (mode === "photo") {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <PhotoInput onBack={() => setMode("home")} onAnalyze={handleAnalyze} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center p-6 relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

      <header className="w-full max-w-md pt-12 pb-8 z-10 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-blue-400">SocialPsych AI</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Trasforma le tue intuizioni in contenuti.</p>
        </div>
        <button
          onClick={() => setMode("history")}
          className="p-3 bg-white/50 dark:bg-neutral-800/50 rounded-full hover:bg-white dark:hover:bg-neutral-800 transition-all border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
          title="Archivio"
        >
          <Clock className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        </button>
      </header>

      <main className="w-full max-w-md flex flex-col gap-8 z-10">
        {/* Main Action: Audio */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setMode("audio")}
            className="group relative w-32 h-32 bg-gradient-to-br from-primary to-[#4A6FB5] rounded-full flex items-center justify-center shadow-xl shadow-primary/30 hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse" />
            <Mic className="w-10 h-10 text-white" />
          </button>
          <span className="text-primary font-medium dark:text-blue-300">Registra Nota Vocale</span>
        </div>

        <div className="flex items-center gap-4 w-full px-8">
          <div className="h-px bg-neutral-200 dark:bg-neutral-800 flex-1" />
          <span className="text-xs text-neutral-400 uppercase tracking-wider">oppure</span>
          <div className="h-px bg-neutral-200 dark:bg-neutral-800 flex-1" />
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMode("text")}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group"
          >
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Type className="w-6 h-6 text-neutral-600 dark:text-neutral-300 group-hover:text-primary" />
            </div>
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Scrivi Testo</span>
          </button>

          <button
            onClick={() => setMode("photo")}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group"
          >
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Camera className="w-6 h-6 text-neutral-600 dark:text-neutral-300 group-hover:text-primary" />
            </div>
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Scansiona Foto</span>
          </button>
        </div>

        <div className="mt-4 p-4 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-2xl border border-neutral-100 dark:border-neutral-800 flex items-start gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Scegli una modalità per iniziare. L'IA genererà 4 varianti di contenuto ottimizzate per tutti i tuoi social.
          </p>
        </div>
      </main>
    </div>
  );
}
