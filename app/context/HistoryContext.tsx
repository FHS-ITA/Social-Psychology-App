"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface HistoryItem {
    id: string;
    date: string; // ISO string
    input: string; // The original input text/summary
    type: "text" | "audio" | "photo";
    results: any; // The full JSON response from API
}

interface HistoryContextType {
    history: HistoryItem[];
    addToHistory: (item: Omit<HistoryItem, "id" | "date">) => void;
    deleteFromHistory: (id: string) => void;
    clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("social-psych-history");
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    // Save to local storage whenever history changes
    useEffect(() => {
        localStorage.setItem("social-psych-history", JSON.stringify(history));
    }, [history]);

    const addToHistory = (item: Omit<HistoryItem, "id" | "date">) => {
        const newItem: HistoryItem = {
            ...item,
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
        };
        setHistory((prev) => [newItem, ...prev]);
    };

    const deleteFromHistory = (id: string) => {
        setHistory((prev) => prev.filter((item) => item.id !== id));
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <HistoryContext.Provider value={{ history, addToHistory, deleteFromHistory, clearHistory }}>
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistory() {
    const context = useContext(HistoryContext);
    if (context === undefined) {
        throw new Error("useHistory must be used within a HistoryProvider");
    }
    return context;
}
