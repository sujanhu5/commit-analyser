import { AnalysisData } from "../types";
import { BookOpen, Copy, Sparkles, BrainCircuit } from "lucide-react";
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
        className="glass rounded-[32px] p-10 relative overflow-hidden group glow-blue border-insights/20"
      >
        <div className="absolute top-0 right-0 p-8 flex gap-3">
          <button className="p-2 rounded-xl bg-white/5 border border-border text-text-secondary hover:text-text-primary transition-colors">
            <Copy className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl bg-insights/10 border border-insights/20 text-insights animate-pulse">
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-8 max-w-4xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-insights/10 border border-insights/20 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-insights" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold tracking-tight text-text-primary">AI Narrative Analysis</h2>
              <p className="text-text-secondary text-sm">Synthesized project evolution and key insights</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none bg-bg/40 p-8 rounded-3xl border border-border">
            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-white/5 rounded-full w-full animate-pulse" />
                <div className="h-4 bg-white/5 rounded-full w-[90%] animate-pulse" />
                <div className="h-4 bg-white/5 rounded-full w-[95%] animate-pulse" />
                <div className="h-4 bg-white/5 rounded-full w-[80%] animate-pulse" />
              </div>
            ) : (
              <Markdown>{narrative}</Markdown>
            )}
          </div>
        </div>
      </motion.div>

      {/* Feature Chapters */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 ml-2">
          <BookOpen className="w-5 h-5 text-insights" />
          <h3 className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.3em]">Feature Chapters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChapterCard 
            title="Project Foundation"
            description="Established the core framework of the project, including React 19, Tailwind CSS, and Google Gemini API integration."
            type="CORE"
            commits={12}
            impact="High"
          />
          <ChapterCard 
            title="Deployment Pipeline"
            description="Configured automated CI/CD via GitHub Actions for seamless delivery and monitoring."
            type="OPS"
            commits={5}
            impact="Medium"
          />
        </div>
      </div>
    </div>
  );
}

function ChapterCard({ title, description, type, commits, impact }: any) {
  return (
    <div className="glass rounded-[32px] p-8 hover:border-insights/30 transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-success glow-green" />
          <h4 className="text-xl font-display font-bold tracking-tight text-text-primary">{title}</h4>
        </div>
        <span className="text-[10px] font-mono text-insights bg-insights/10 border border-insights/20 px-3 py-1 rounded-full uppercase tracking-widest">{type}</span>
      </div>
      <p className="text-text-secondary text-sm leading-relaxed mb-8">{description}</p>
      <div className="flex items-center gap-6 text-[10px] font-mono text-text-secondary/40 uppercase tracking-widest pt-6 border-t border-border">
        <span className="flex items-center gap-2">
           <Copy className="w-3 h-3" />
           {commits} commits
        </span>
        <span className="flex items-center gap-2">
           <Sparkles className="w-3 h-3 text-insights" />
           Impact: <span className="text-insights font-bold">{impact}</span>
        </span>
      </div>
    </div>
  );
}
