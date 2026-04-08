import { useState, useEffect } from "react";
import { AnalysisData } from "../types";
import { GoogleGenAI } from "@google/genai";
import { BookOpen, Sparkles, Loader2, History } from "lucide-react";
import { motion } from "motion/react";

interface ProjectStoryProps {
  data: AnalysisData;
}

export function ProjectStory({ data }: ProjectStoryProps) {
  const [story, setStory] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateStory = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const prompt = `Analyze this GitHub repository data for "${data.name}":
        - Description: ${data.description}
        - Features added: ${data.commitClassification.features}
        - Bugs fixed: ${data.commitClassification.bugs}
        - Improvements: ${data.commitClassification.improvements}
        - Contributors: ${data.contributorsCount}
        
        Generate a concise "Project Story" that summarizes the project's evolution and current state in a timeline-style narrative. Use professional but engaging tone. Keep it under 200 words.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
        });

        setStory(response.text || "Could not generate story.");
      } catch (error) {
        console.error("AI Error:", error);
        setStory("Failed to generate project story. Please check your Gemini API key.");
      } finally {
        setLoading(false);
      }
    };

    generateStory();
  }, [data]);

  return (
    <div className="glass rounded-[32px] p-10 space-y-8 relative overflow-hidden group">
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-insights/10 border border-insights/20 flex items-center justify-center">
            <History className="w-6 h-6 text-insights" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold tracking-tight text-text-primary">Project Evolution</h3>
            <p className="text-text-secondary text-sm">The narrative journey of this codebase</p>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-insights animate-pulse" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-text-secondary/40 relative z-10">
          <Loader2 className="w-8 h-8 animate-spin text-insights" />
          <span className="text-sm font-mono uppercase tracking-widest">Drafting the story...</span>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="bg-bg/40 border border-border rounded-3xl p-8 text-text-secondary leading-relaxed text-base">
            {story.split('\n').map((line, i) => (
              <p key={i} className="mb-4 last:mb-0">{line}</p>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
