import { useState, useEffect } from "react";
import { AnalysisData } from "../types";
import { GoogleGenAI } from "@google/genai";
import { BookOpen, Sparkles, Loader2 } from "lucide-react";
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
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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
    <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-orange-500 font-bold uppercase tracking-widest text-xs">
          <BookOpen className="w-4 h-4" />
          Project Story
        </div>
        <Sparkles className="w-4 h-4 text-orange-500/50" />
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-white/40 py-8">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm italic">AI is drafting the narrative...</span>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed"
        >
          {story.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </motion.div>
      )}
    </div>
  );
}
