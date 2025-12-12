"use client";

import { useState } from "react";
import { ArrowRight, Type } from "lucide-react";

interface TextInputProps {
    onBack: () => void;
    onAnalyze: (text: string) => void;
}

export default function TextInput({ onBack, onAnalyze }: TextInputProps) {
    const [text, setText] = useState("");

    const handleSubmit = () => {
        if (text.trim()) {
            onAnalyze(text);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Type className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">Scrivi Nota</h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                    Incolla appunti o scrivi le tue riflessioni.
                </p>
            </div>

            <div className="w-full relative">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Oggi in seduta è emerso che..."
                    className="w-full h-48 p-4 rounded-2xl bg-white dark:bg-neutral-900 border-2 border-neutral-100 dark:border-neutral-800 focus:border-primary focus:ring-0 resize-none transition-all text-neutral-800 dark:text-neutral-200"
                />
                <div className="absolute bottom-4 right-4 text-xs text-neutral-400 font-medium">
                    {text.length} car
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={!text.trim()}
                className="w-full mt-6 bg-primary disabled:bg-neutral-300 dark:disabled:bg-neutral-800 text-white disabled:text-neutral-500 py-4 rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:shadow-none transition-all flex items-center justify-center gap-2 group"
            >
                <span>Genera Contenuti</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
                onClick={onBack}
                className="mt-6 text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
                Annulla
            </button>
        </div>
    );
}
