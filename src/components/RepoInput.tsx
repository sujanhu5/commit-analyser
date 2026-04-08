import { useState, FormEvent } from "react";
import { Github, ArrowRight, ShieldCheck, Zap, BarChart3 } from "lucide-react";
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
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-12">
      <div className="text-center space-y-4 max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold tracking-widest uppercase"
        >
          <Zap className="w-3 h-3" />
          Next-Gen Repository Intelligence
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-bold tracking-tighter leading-tight"
        >
          Uncover the <span className="text-orange-500 italic">DNA</span> of your code.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/40 text-lg md:text-xl max-w-xl mx-auto"
        >
          Solaris transforms raw GitHub data into actionable engineering insights and cybersecurity intelligence.
        </motion.p>
      </div>

      <motion.form 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        onSubmit={handleSubmit}
        className="w-full max-w-xl relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-[#111] rounded-2xl p-2 border border-white/10">
          <Github className="w-6 h-6 ml-4 text-white/40" />
          <input 
            type="text" 
            placeholder="https://github.com/owner/repo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-lg placeholder:text-white/20 outline-none"
          />
          <button 
            type="submit"
            disabled={!url.trim()}
            className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Analyze
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.form>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mt-8"
      >
        <div className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
          <ShieldCheck className="w-8 h-8 text-orange-500" />
          <h3 className="font-bold">Security Audit</h3>
          <p className="text-sm text-white/40">Detect secret leaks and vulnerability patterns in real-time.</p>
        </div>
        <div className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
          <BarChart3 className="w-8 h-8 text-orange-500" />
          <h3 className="font-bold">Engineering Metrics</h3>
          <p className="text-sm text-white/40">Analyze code churn, risk levels, and developer contributions.</p>
        </div>
        <div className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
          <Zap className="w-8 h-8 text-orange-500" />
          <h3 className="font-bold">AI Intelligence</h3>
          <p className="text-sm text-white/40">Get automated summaries and standup reports powered by Gemini.</p>
        </div>
      </motion.div>
    </div>
  );
}
