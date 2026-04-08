/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { AnalysisData } from "./types";
import { Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (repoUrl: string, token?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, token }),
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze repository");
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans selection:bg-insights/30 flex flex-col">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-insights/20 blur-3xl rounded-full animate-pulse" />
              <Loader2 className="w-20 h-20 text-insights animate-spin relative z-10" />
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-display font-bold tracking-tight">Illuminating Code Intelligence...</h2>
              <p className="text-text-secondary text-sm max-w-xs mx-auto">Mapping commit history, identifying patterns, and generating project narrative.</p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-8 px-4"
          >
            <div className="p-10 bg-danger/5 border border-danger/20 rounded-[32px] text-danger max-w-md text-center space-y-4 glow-red">
              <div className="w-16 h-16 bg-danger/10 rounded-2xl flex items-center justify-center mx-auto">
                <RefreshCw className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <p className="font-display font-bold text-2xl tracking-tight">Analysis Failed</p>
                <p className="text-sm opacity-80 leading-relaxed">{error}</p>
              </div>
            </div>
            <button 
              onClick={handleReset}
              className="px-10 py-4 bg-text-primary text-bg rounded-2xl font-bold hover:opacity-90 transition-all active:scale-95"
            >
              Back to Terminal
            </button>
          </motion.div>
        ) : data ? (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col"
          >
            <Dashboard data={data} onReset={handleReset} />
          </motion.div>
        ) : (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <LandingPage onAnalyze={handleAnalyze} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

