import { useState, useEffect } from "react";
import { AnalysisData } from "../types";
import { GoogleGenAI } from "@google/genai";
import { Terminal, Sparkles, Loader2, Copy, Check, FileText } from "lucide-react";
import { motion } from "motion/react";

interface StandupGeneratorProps {
  data: AnalysisData;
}

export function StandupGenerator({ data }: StandupGeneratorProps) {
  const [standup, setStandup] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generateStandup = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        
        const prompt = `Analyze this GitHub repository data for "${data.name}":
        - Features added: ${data.commitClassification.features}
        - Bugs fixed: ${data.commitClassification.bugs}
        - Improvements: ${data.commitClassification.improvements}
        - Security alerts: ${data.securityAlerts.length}
        - Risky files: ${Object.keys(data.riskyFiles).length}
        
        Generate a professional "Engineering Standup Report" with three clear sections:
        1. Accomplishments (based on features/bugs/improvements)
        2. Risks & Blockers (based on security alerts and risky files)
        3. Strategic Next Steps (logical progression based on current state)
        
        Keep it concise, bulleted, and professional.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
        });

        setStandup(response.text || "Could not generate standup.");
      } catch (error) {
        console.error("AI Error:", error);
        setStandup("Failed to generate standup report. Please check your Gemini API key.");
      } finally {
        setLoading(false);
      }
    };

    generateStandup();
  }, [data]);

  const handleCopy = () => {
    navigator.clipboard.writeText(standup);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass rounded-[32px] p-10 space-y-10 relative overflow-hidden group border-insights/20">
      <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
        <Terminal className="w-48 h-48 text-insights" />
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-insights/10 border border-insights/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-insights" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold tracking-tight text-text-primary">Engineering Standup</h3>
            <p className="text-text-secondary text-sm">AI-generated daily progress report</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-insights/5 border border-insights/10">
            <Sparkles className="w-3 h-3 text-insights animate-pulse" />
            <span className="text-[10px] font-mono text-insights uppercase tracking-widest">AI Optimized</span>
          </div>
          {!loading && (
            <button 
              onClick={handleCopy}
              className="p-3 rounded-xl bg-white/5 border border-border hover:bg-white/10 transition-all text-text-secondary hover:text-text-primary"
            >
              {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-text-secondary/40 relative z-10">
          <Loader2 className="w-10 h-10 animate-spin text-insights" />
          <span className="text-sm font-mono uppercase tracking-widest">Drafting engineering report...</span>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="bg-bg/40 border border-border rounded-3xl p-8 font-mono text-sm leading-relaxed text-text-secondary">
            {standup.split('\n').map((line, i) => (
              <p key={i} className={`mb-2 ${line.startsWith('#') || line.includes(':') ? "text-insights font-bold mt-4 first:mt-0" : ""}`}>
                {line}
              </p>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
