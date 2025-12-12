"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, ArrowRight, RotateCcw } from "lucide-react";

interface AudioInputProps {
    onBack: () => void;
    onAnalyze: (audioBlob: Blob | null) => void;
}

export default function AudioInput({ onBack, onAnalyze }: AudioInputProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
    const [timer, setTimer] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                setRecordingBlob(blob);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setTimer(0);
            timerRef.current = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Impossibile accedere al microfono. Verifica i permessi.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            if (timerRef.current) clearInterval(timerRef.current);
            setIsRecording(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleReset = () => {
        setRecordingBlob(null);
        setTimer(0);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 text-center">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">Registrazione Vocale</h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                    Racconta la tua idea. L'IA ascolterà ogni parola.
                </p>
            </div>

            <div className="relative mb-8">
                {isRecording && (
                    <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
                )}

                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={!!recordingBlob && !isRecording}
                    className={`relative w-32 h-32 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isRecording
                            ? "bg-red-500 hover:bg-red-600 scale-110"
                            : recordingBlob
                                ? "bg-neutral-200 dark:bg-neutral-800 cursor-not-allowed opacity-50"
                                : "bg-gradient-to-br from-primary to-[#4A6FB5]"
                        }`}
                >
                    {isRecording ? (
                        <Square className="w-10 h-10 text-white fill-current" />
                    ) : (
                        <Mic className="w-10 h-10 text-white" />
                    )}
                </button>
            </div>

            <div className="text-4xl font-mono font-light text-neutral-700 dark:text-neutral-200 mb-8 tracking-widest">
                {formatTime(timer)}
            </div>

            {recordingBlob && !isRecording && (
                <div className="flex flex-col gap-4 w-full animate-in fade-in slide-in-from-bottom-2">
                    <audio
                        src={URL.createObjectURL(recordingBlob)}
                        controls
                        className="w-full mb-2"
                    />

                    <div className="flex gap-3">
                        <button
                            onClick={handleReset}
                            className="flex-1 py-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-xl font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Rifai
                        </button>
                        <button
                            onClick={() => onAnalyze(recordingBlob)}
                            className="flex-[2] bg-primary text-white py-4 rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 group"
                        >
                            <span>Genera Contenuti</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={onBack}
                className="mt-6 text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
                Indietro
            </button>
        </div>
    );
}
