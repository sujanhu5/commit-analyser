/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { AnalysisData } from "./types";
import { Loader2, LayoutGrid, Github } from "lucide-react";

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
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-brand/30 flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={handleReset}
          >
            <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-display font-bold tracking-tighter block leading-none">SOLARIS X</span>
              <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Commit Story & Analytics</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Backend: OK</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">AI Key: Ready</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {data ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <Github className="w-4 h-4 text-white/40" />
                <span className="text-xs font-mono text-white/60">{data.name}</span>
              </div>
            ) : (
              <button className="text-xs font-medium text-white/40 hover:text-white transition-colors">Documentation</button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-brand/20 blur-2xl rounded-full animate-pulse" />
              <Loader2 className="w-16 h-16 text-brand animate-spin relative z-10" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-display font-bold tracking-tight">Synthesizing Intelligence...</h2>
              <p className="text-white/40 text-sm max-w-xs mx-auto">Mapping commit history, identifying patterns, and generating project narrative.</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4">
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 max-w-md text-center space-y-2">
              <p className="font-bold text-lg uppercase tracking-tight">Analysis Failed</p>
              <p className="text-sm opacity-80 leading-relaxed">{error}</p>
            </div>
            <button 
              onClick={handleReset}
              className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-white/90 transition-all active:scale-95"
            >
              Back to Terminal
            </button>
          </div>
        ) : data ? (
          <Dashboard data={data} />
        ) : (
          <LandingPage onAnalyze={handleAnalyze} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 bg-black/50 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-[10px] font-mono uppercase tracking-[0.2em]">Powered by Gemini 3 Flash & Solaris X Architecture</p>
          <div className="flex gap-8 text-[10px] font-mono uppercase tracking-widest text-white/40">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">API Status</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

