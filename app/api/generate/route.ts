import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `
Agisci come un social media manager esperto in psicologia clinica e transpersonale.
Il tuo obiettivo è trasformare riflessioni cliniche in contenuti social coinvolgenti per 4 piattaforme: Instagram, TikTok, YouTube e Facebook.

LINEE GUIDA BRAND:
- Tono: Empatico, professionale ma accessibile, scientifico-spirituale.
- Evita: Banalità new-age, linguaggio troppo accademico, giudizio.
- Focus: Consapevolezza, resa, integrazione dell'ombre, transpersonale.

DEVI GENERARE UN JSON CON QUESTA STRUTTURA:
{
  "instagram": {
    "type": "carousel",
    "slides": ["Testo Slide 1", "Testo Slide 2", "Testo Slide 3", "Testo Slide 4"],
    "caption": "Testo completo per la caption con hashtag",
    "imagePrompt": "Descrizione visiva per generare l'immagine con IA"
  },
  "tiktok": {
    "script": "Testo dello script parlato",
    "visualCues": "Descrizione di cosa mostrare a video mentre si parla",
    "caption": "Breve caption per il video"
  },
  "youtube": {
    "title": "Titolo SEO accattivante",
    "description": "Descrizione completa del video con capitoli sugeriti",
    "tags": ["tag1", "tag2", "tag3"]
  },
  "facebook": {
    "post": "Testo lungo e discorsivo che invita alla riflessione",
    "question": "Domanda finale per stimolare i commenti"
  }
}

Input dell'utente:
`;

export async function POST(req: Request) {
  try {
    console.log("API Route Hit");
    console.log("API Key Present:", !!process.env.GOOGLE_GEMINI_API_KEY);

    const body = await req.json();
    const { text, audio, image, mimeType } = body;

    const parts: any[] = [];

    if (audio) {
      parts.push({
        inlineData: {
          mimeType: "audio/webm",
          data: audio
        }
      });
      parts.push({ text: "Analizza questo audio e crea i contenuti social richiesti. Ignora rumori di fondo." });
    } else if (image) {
      parts.push({
        inlineData: {
          mimeType: mimeType || "image/jpeg",
          data: image
        }
      });
      parts.push({ text: "Analizza questa immagine (leggi il testo se presente o descrivi il concetto visivo) e crea contenuti social basati su di essa." });
    } else if (text) {
      parts.push({ text: text });
    } else {
      return NextResponse.json({ error: "Nessun input fornito" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const finalPrompt = [SYSTEM_PROMPT, ...parts];

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const textResponse = response.text();

    console.log("Raw Gemini Response:", textResponse);

    // Extract JSON using regex to be safe against extra text
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Nessun JSON valido trovato nella risposta");
    }

    const jsonResponse = JSON.parse(jsonMatch[0]);

    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error("FULL API ERROR:", error);
    const status = error.status || 500;
    const message = error.status === 429 ? "Troppe richieste (Rate Limit). Attendi qualche minuto." : "Errore nella generazione del contenuto.";

    return NextResponse.json(
      { error: message, details: error.message },
      { status: status }
    );
  }
}
