import { useState, FormEvent } from "react";
import { Github, ArrowRight, Search, Key } from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onAnalyze: (url: string, token?: string) => void;
}

export function LandingPage({ onAnalyze }: LandingPageProps) {
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim(), token.trim() || undefined);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-16">
      <div className="text-center space-y-6 max-w-3xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[0.9]"
        >
          Transform Git History into <br />
          <span className="text-white/20">Intelligence</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto font-medium"
        >
          Enter a GitHub repository URL to generate a structured narrative, productivity analytics, and bug predictions.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-[#111] rounded-[32px] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
             <button className="text-[10px] font-mono text-brand uppercase tracking-widest hover:text-white transition-colors">Try Sample Repo</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                <Github className="w-5 h-5 text-brand" />
              </div>
              <h2 className="text-xl font-display font-bold tracking-tight">Connect Repository</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Repository URL</label>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand transition-colors" />
                  <input 
                    type="text" 
                    placeholder="https://github.com/owner/repo"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-lg placeholder:text-white/10 outline-none focus:border-brand/50 focus:ring-4 focus:ring-brand/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Personal Access Token (Optional)</label>
                <div className="relative group">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand transition-colors" />
                  <input 
                    type="password" 
                    placeholder="ghp_..."
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-lg placeholder:text-white/10 outline-none focus:border-brand/50 focus:ring-4 focus:ring-brand/10 transition-all"
                  />
                </div>
                <p className="text-[10px] text-white/20 font-mono ml-1 uppercase tracking-wider">Required for private repos or higher rate limits.</p>
              </div>
            </div>

            <button 
              type="submit"
              disabled={!url.trim()}
              className="w-full bg-brand hover:bg-brand-hover text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand/20"
            >
              Analyze History
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
