import { AnalysisData } from "../types";
import { BookOpen, Copy, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";

interface NarrativeTabProps {
  data: AnalysisData;
}

export function NarrativeTab({ data }: NarrativeTabProps) {
  const [narrative, setNarrative] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNarrative = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        
        const prompt = `Analyze this GitHub repository data and write a compelling "Project Narrative" in 3-4 sentences. 
        Focus on the evolution, key technical shifts, and the developer's journey.
        
        Include a "Smart Insights" section that detects:
        - High Activity Spikes (e.g., many commits in a short time)
        - Inactivity periods
        - Velocity trends
        
        Then, list 2-3 "Feature Chapters" with a title, a brief description, and an impact level (High/Medium/Low).
        
        Repo Data:
        Name: ${data.name}
        Commits: ${data.totalCommits}
        Contributors: ${data.contributorsCount}
        Peak Activity: ${data.peakActivity.count} commits on ${data.peakActivity.day}
        Lowest Activity: ${data.lowestActivity.count} commits on ${data.lowestActivity.day}
        Commit Types: ${JSON.stringify(data.commitClassification)}
        Velocity Data: ${JSON.stringify(data.velocityData)}
        
        Format the output as Markdown. Use bold for emphasis.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
        });
        setNarrative(response.text || "");
      } catch (error) {
        console.error("Narrative Error:", error);
        setNarrative("Failed to generate narrative. Please check your AI configuration.");
      } finally {
        setLoading(false);
      }
    };

    fetchNarrative();
  }, [data]);

  return (
    <div className="space-y-12">
      {/* Main Narrative Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand/5 border border-brand/20 rounded-[32px] p-10 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-8 flex gap-3">
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors">
            <Copy className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-brand animate-pulse">
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center gap-3 text-brand">
            <BookOpen className="w-6 h-6" />
            <h2 className="text-2xl font-display font-bold tracking-tight">Project Narrative</h2>
          </div>

          <div className="prose prose-invert max-w-none">
            {loading ? (
              <div className="space-y-3">
                <div className="h-4 bg-white/5 rounded-full w-full animate-pulse" />
                <div className="h-4 bg-white/5 rounded-full w-[90%] animate-pulse" />
                <div className="h-4 bg-white/5 rounded-full w-[95%] animate-pulse" />
              </div>
            ) : (
              <Markdown>{narrative}</Markdown>
            )}
          </div>
        </div>
      </motion.div>

      {/* Feature Chapters */}
      <div className="space-y-6">
        <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] ml-2">Feature Chapters</h3>
        <div className="space-y-4">
          {/* Mocking some chapters if narrative is still loading or as a fallback */}
          <ChapterCard 
            title="Project Foundation and Architecture"
            description="Established the core framework of the project, including React 19, Tailwind CSS, and Google Gemini API integration."
            type="FEATURE"
            commits={2}
            impact="High"
          />
          <ChapterCard 
            title="Deployment Pipeline Configuration"
            description="Configured automated CI/CD via GitHub Actions for seamless delivery."
            type="CHORE"
            commits={1}
            impact="Medium"
          />
        </div>
      </div>
    </div>
  );
}

function ChapterCard({ title, description, type, commits, impact }: any) {
  return (
    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <h4 className="text-xl font-display font-bold tracking-tight">{title}</h4>
        </div>
        <span className="text-[10px] font-mono text-white/20 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">{type}</span>
      </div>
      <p className="text-white/40 leading-relaxed mb-6">{description}</p>
      <div className="flex items-center gap-6 text-[10px] font-mono text-white/20 uppercase tracking-widest">
        <span className="flex items-center gap-2">
           <Copy className="w-3 h-3" />
           {commits} commits
        </span>
        <span className="flex items-center gap-2 italic">
           Impact: {impact}
        </span>
      </div>
    </div>
  );
}
