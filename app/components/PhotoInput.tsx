"use client";

import { useState } from "react";
import { ArrowRight, Camera, Upload, Image as ImageIcon } from "lucide-react";

interface PhotoInputProps {
    onBack: () => void;
    onAnalyze: (file: any) => void;
}

export default function PhotoInput({ onBack, onAnalyze }: PhotoInputProps) {
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Create fake object URL for preview
            const url = URL.createObjectURL(selectedFile);
            setImage(url);
            setFile(selectedFile);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">Scansiona</h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                    Carica una foto di un libro, appunti o testo.
                </p>
            </div>

            <div className="w-full aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary/50 transition-colors">
                {image ? (
                    <>
                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            onClick={() => setImage(null)}
                            className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                        >
                            Start Over
                        </button>
                    </>
                ) : (
                    <>
                        <Upload className="w-10 h-10 text-neutral-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-neutral-500">Tocca per caricare</span>
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                        />
                    </>
                )}
            </div>

            <button
                onClick={() => onAnalyze(file)}
                disabled={!image}
                className="w-full mt-6 bg-primary disabled:bg-neutral-300 dark:disabled:bg-neutral-800 text-white disabled:text-neutral-500 py-4 rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:shadow-none transition-all flex items-center justify-center gap-2 group"
            >
                <span>Analizza Immagine</span>
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
