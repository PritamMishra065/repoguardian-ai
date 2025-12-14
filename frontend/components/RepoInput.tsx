"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RepoInputProps {
    onSubmit: (repo: string) => void;
    isLoading: boolean;
}

export function RepoInput({ onSubmit, isLoading }: RepoInputProps) {
    const [repo, setRepo] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (repo.trim()) {
            onSubmit(repo.trim());
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="relative w-full max-w-xl mx-auto"
        >
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-2 shadow-2xl">
                    <Search className="w-5 h-5 text-zinc-400 ml-3" />
                    <input
                        type="text"
                        value={repo}
                        onChange={(e) => setRepo(e.target.value)}
                        placeholder="Enter repository (e.g. facebook/react)"
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-500 px-4 py-2"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !repo.trim()}
                        className={cn(
                            "bg-white text-black font-medium px-6 py-2 rounded-lg transition-all",
                            isLoading || !repo.trim()
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98]"
                        )}
                    >
                        {isLoading ? "Analyzing..." : "Analyze"}
                    </button>
                </div>
            </div>
        </motion.form>
    );
}
