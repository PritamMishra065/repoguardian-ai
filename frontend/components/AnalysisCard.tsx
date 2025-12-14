"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, FileText, GitPullRequest, Info } from "lucide-react";
import { AnalysisItem } from "@/types";

interface AnalysisCardProps {
    type: "issue" | "pr";
    data: AnalysisItem;
    index: number;
}

export function AnalysisCard({ type, data, index }: AnalysisCardProps) {
    const isPR = type === "pr";

    // Parse response logic from backend

    const content = isPR ? (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${(data.risk_level?.includes("HIGH") || JSON.stringify(data).includes("HIGH")) ? "bg-red-500/20 text-red-400" :
                    (data.risk_level?.includes("MEDIUM") || JSON.stringify(data).includes("MEDIUM")) ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-green-500/20 text-green-400"
                    }`}>
                    {(data.risk_level || (JSON.stringify(data).match(/Risk Level:?\s*(HIGH|MEDIUM|LOW)/i)?.[1])) || "ANALYSIS"}
                </span>
            </div>
            <div className="prose prose-invert prose-sm max-w-none text-zinc-300">
                <div className="whitespace-pre-wrap font-mono text-xs">{
                    data.problems || JSON.stringify(data)
                }</div>
            </div>
        </div>
    ) : (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-medium">
                    {data.type || "ISSUE"}
                </span>
            </div>
            <p className="text-zinc-300 text-sm">
                {data.short_summary || data.summary || JSON.stringify(data)}
            </p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors"
        >
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${isPR ? "bg-purple-500/10 text-purple-400" : "bg-blue-500/10 text-blue-400"}`}>
                    {isPR ? <GitPullRequest className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate mb-2">
                        {isPR ? "PR Analysis" : "Issue Analysis"}
                    </h3>
                    {content}
                </div>
            </div>
        </motion.div>
    );
}
