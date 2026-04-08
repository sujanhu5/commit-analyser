import { useState, FormEvent } from "react";
import { Github, ArrowRight, ShieldCheck, Zap, BarChart3, Search } from "lucide-react";
import { motion } from "motion/react";

interface RepoInputProps {
  onAnalyze: (url: string) => void;
}

export function RepoInput({ onAnalyze }: RepoInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-16 px-6">
      <div className="text-center space-y-6 max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-insights/10 border border-insights/20 text-insights text-[10px] font-mono font-bold tracking-[0.2em] uppercase"
        >
          <Zap className="w-3 h-3" />
          Next-Gen Repository Intelligence
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-8xl font-display font-bold tracking-tighter leading-[0.9] text-text-primary"
        >
          Uncover the <span className="text-insights italic glow-blue">DNA</span> of your code.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Solaris transforms raw GitHub data into actionable engineering insights and cybersecurity intelligence.
        </motion.p>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onSubmit={handleSubmit}
        className="w-full max-w-2xl relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-insights to-success rounded-[32px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative flex items-center bg-card rounded-[28px] p-2.5 border border-border shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ml-2 border border-border">
            <Github className="w-6 h-6 text-text-secondary" />
          </div>
          <input 
            type="text" 
            placeholder="https://github.com/owner/repo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 text-lg text-text-primary placeholder:text-text-secondary/30 outline-none font-medium"
          />
          <button 
            type="submit"
            disabled={!url.trim()}
            className="bg-insights text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-insights/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-insights/20 group/btn"
          >
            <span className="hidden md:inline">Analyze</span>
            <Search className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </motion.form>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-8"
      >
        <div className="flex flex-col items-center text-center gap-4 p-8 rounded-[32px] glass border-border hover:border-insights/30 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-insights/10 border border-insights/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-7 h-7 text-insights" />
          </div>
          <h3 className="font-display font-bold text-text-primary text-lg">Security Audit</h3>
          <p className="text-sm text-text-secondary leading-relaxed">Detect secret leaks and vulnerability patterns in real-time.</p>
        </div>
        <div className="flex flex-col items-center text-center gap-4 p-8 rounded-[32px] glass border-border hover:border-success/30 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <BarChart3 className="w-7 h-7 text-success" />
          </div>
          <h3 className="font-display font-bold text-text-primary text-lg">Engineering Metrics</h3>
          <p className="text-sm text-text-secondary leading-relaxed">Analyze code churn, risk levels, and developer contributions.</p>
        </div>
        <div className="flex flex-col items-center text-center gap-4 p-8 rounded-[32px] glass border-border hover:border-warning/30 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap className="w-7 h-7 text-warning" />
          </div>
          <h3 className="font-display font-bold text-text-primary text-lg">AI Intelligence</h3>
          <p className="text-sm text-text-secondary leading-relaxed">Get automated summaries and standup reports powered by Gemini.</p>
        </div>
      </motion.div>
    </div>
  );
}
