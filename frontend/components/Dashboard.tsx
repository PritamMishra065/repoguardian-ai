"use client";

import { useState } from "react";
import { RepoInput } from "@/components/RepoInput";
import { AnalysisCard } from "@/components/AnalysisCard";
import { DashboardData } from "@/types";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, Zap } from "lucide-react";

export function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAnalyze = async (repo: string) => {
        setLoading(true);
        setError("");
        setData(null);
        try {
            const res = await fetch("https://unmalevolent-saccharic-joaquina.ngrok-free.dev/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ repo }),
            });

            if (!res.ok) throw new Error("Failed to analyze repository");

            const result = await res.json();
            setData(result);
        } catch (err) {
            setError("Something went wrong. Ensure backend is running and repo is public.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            <div className="max-w-7xl mx-auto px-4 py-20">

                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-400 mb-4"
                    >
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        <span>AI-Powered Security & Quality Audit</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500">
                        RepoGuardian
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                        Instantly analyze GitHub repositories for security risks, code quality, and fast-track PR reviews with autonomous agents.
                    </p>
                </div>

                {/* Input */}
                <div className="mb-20">
                    <RepoInput onSubmit={handleAnalyze} isLoading={loading} />
                    {error && (
                        <div className="text-center text-red-500 mt-4 bg-red-500/10 py-2 px-4 rounded-lg inline-block mx-auto">
                            {error}
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                        <p className="text-zinc-500 animate-pulse">Running agents on {data?.repo || "repository"}...</p>
                    </div>
                )}

                {/* Results */}
                {data && (
                    <div className="space-y-12">

                        {/* Summary Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-8 rounded-2xl"
                        >
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-500" />
                                Executive Summary
                            </h2>
                            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                {data.summary}
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <section>
                                <h3 className="text-xl font-medium mb-6 text-zinc-400">Pull Requests ({data.prs?.length || 0})</h3>
                                <div className="space-y-4">
                                    {data.prs?.map((item, i) => (
                                        <AnalysisCard key={i} type="pr" data={item} index={i} />
                                    ))}
                                    {(!data.prs || data.prs.length === 0) && (
                                        <p className="text-zinc-500 italic">No open PRs found.</p>
                                    )}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xl font-medium mb-6 text-zinc-400">Recent Issues ({data.issues?.length || 0})</h3>
                                <div className="space-y-4">
                                    {data.issues?.map((item, i) => (
                                        <AnalysisCard key={i} type="issue" data={item} index={i} />
                                    ))}
                                    {(!data.issues || data.issues.length === 0) && (
                                        <p className="text-zinc-500 italic">No open issues found.</p>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
