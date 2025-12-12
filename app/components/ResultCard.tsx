import { Copy, Check, Instagram, Facebook, Youtube, Video } from "lucide-react";
import { useState } from "react";

interface ResultCardProps {
    platform: "instagram" | "tiktok" | "youtube" | "facebook";
    data: any;
}

export default function ResultCard({ platform, data }: ResultCardProps) {
    const [copied, setCopied] = useState(false);

    // Helper to get platform specific visual details
    const getPlatformDetails = () => {
        switch (platform) {
            case "instagram":
                return { icon: Instagram, color: "text-pink-600", bg: "bg-pink-100 dark:bg-pink-900/30", name: "Instagram" };
            case "tiktok":
                return { icon: Video, color: "text-black dark:text-white", bg: "bg-cyan-100 dark:bg-cyan-900/30", name: "TikTok" };
            case "youtube":
                return { icon: Youtube, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30", name: "YouTube" };
            case "facebook":
                return { icon: Facebook, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30", name: "Facebook" };
        }
    };

    const { icon: Icon, color, bg, name } = getPlatformDetails();

    const handleCopy = () => {
        if (!data) return;

        // Determine content to copy based on platform structure
        let contentToCopy = "";
        if (platform === "instagram") {
            contentToCopy = `${data.slides?.join("\n\n---\n\n") || ""}\n\nCAPTION:\n${data.caption}\n\nIMAGE PROMPT: ${data.imagePrompt}`;
        } else if (platform === "tiktok") {
            contentToCopy = `SCRIPT:\n${data.script}\n\nVISUALS: ${data.visualCues}\n\nCAPTION: ${data.caption}`;
        } else if (platform === "youtube") {
            contentToCopy = `TITLE: ${data.title}\n\nDESCRIPTION:\n${data.description}\n\nTAGS: ${data.tags?.join(", ") || ""}`;
        } else if (platform === "facebook") {
            contentToCopy = `${data.post}\n\nQUESTION: ${data.question}`;
        }

        navigator.clipboard.writeText(contentToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Render content preview based on platform
    const renderContent = () => {
        if (!data) {
            return <div className="p-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">Dati non disponibili per questa piattaforma.</div>;
        }

        if (platform === "instagram") {
            // safely handle slides if undefined
            const slides = data.slides || [];
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-neutral-500 uppercase">Slides</h4>
                        <div className="bg-white dark:bg-neutral-900/50 rounded-lg p-3 text-sm space-y-2">
                            {slides.map((slide: string, i: number) => (
                                <div key={i} className="p-2 bg-neutral-50 dark:bg-neutral-800 rounded border border-neutral-100 dark:border-neutral-700">
                                    <span className="text-xs font-bold text-neutral-400 mr-2">{i + 1}</span>
                                    {slide}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-neutral-500 uppercase">Caption</h4>
                        <p className="text-sm bg-white dark:bg-neutral-900/50 p-3 rounded-lg whitespace-pre-wrap">{data.caption}</p>
                    </div>
                    <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs flex gap-2 items-start">
                        <span className="font-bold shrink-0">🖼️ Prompt:</span>
                        <span className="italic opacity-80">{data.imagePrompt}</span>
                    </div>
                </div>
            );
        }

        if (platform === "tiktok") {
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-neutral-500 uppercase">Script & Visuals</h4>
                        <div className="bg-white dark:bg-neutral-900/50 p-3 rounded-lg space-y-3">
                            <p className="text-sm font-mono whitespace-pre-wrap leading-relaxed">{data.script}</p>
                            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs rounded border border-yellow-100 dark:border-yellow-900/50">
                                🎥 {data.visualCues}
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-neutral-500 italic">Caption: {data.caption}</p>
                </div>
            );
        }

        if (platform === "youtube") {
            const tags = data.tags || [];
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold leading-tight">{data.title}</h3>
                    <div className="bg-white dark:bg-neutral-900/50 p-3 rounded-lg">
                        <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Description</h4>
                        <p className="text-sm whitespace-pre-wrap">{data.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag: string, i: number) => (
                            <span key={i} className="text-xs bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded-full text-neutral-600 dark:text-neutral-400">#{tag}</span>
                        ))}
                    </div>
                </div>
            );
        }

        if (platform === "facebook") {
            return (
                <div className="space-y-4">
                    <div className="bg-white dark:bg-neutral-900/50 p-4 rounded-lg text-sm whitespace-pre-wrap leading-relaxed">
                        {data.post}
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm rounded-lg font-medium">
                        💬 {data.question}
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${bg}`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <h3 className="font-bold text-neutral-800 dark:text-white">{name}</h3>
                </div>
                <button
                    onClick={handleCopy}
                    disabled={!data}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Copia contenuto"
                >
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
            </div>

            <div className="text-neutral-700 dark:text-neutral-300">
                {renderContent()}
            </div>
        </div>
    );
}
