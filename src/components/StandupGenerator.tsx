import { useState, useEffect } from "react";
import { AnalysisData } from "../types";
import { GoogleGenAI } from "@google/genai";
import { Terminal, Sparkles, Loader2, Copy, Check } from "lucide-react";
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
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `Analyze this GitHub repository data for "${data.name}":
        - Features added: ${data.commitClassification.features}
        - Bugs fixed: ${data.commitClassification.bugs}
        - Improvements: ${data.commitClassification.improvements}
        - Security alerts: ${data.securityAlerts.length}
        - Risky files: ${Object.keys(data.riskyFiles).length}
        
        Generate a professional "Standup Report" with three clear sections:
        1. What was done (based on features/bugs/improvements)
        2. Risks (based on security alerts and risky files)
        3. Next steps (logical progression based on current state)
        
        Keep it concise and bulleted.`;

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
    <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Terminal className="w-32 h-32 text-orange-500" />
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 text-orange-500 font-bold uppercase tracking-widest text-xs">
          <Terminal className="w-4 h-4" />
          Standup Generator
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-500/50" />
          {!loading && (
            <button 
              onClick={handleCopy}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-white/40" />}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-white/40 py-8 relative z-10">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm italic">AI is drafting your standup report...</span>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 space-y-4"
        >
          <div className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed font-mono text-[11px] uppercase tracking-wider">
            {standup.split('\n').map((line, i) => (
              <p key={i} className={line.startsWith('#') || line.includes(':') ? "text-orange-500 font-bold" : ""}>
                {line}
              </p>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
