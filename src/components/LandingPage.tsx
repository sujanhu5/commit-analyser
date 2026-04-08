import { useState, FormEvent } from "react";
import { Github, ArrowRight, Search, Key, BookOpen, ShieldAlert, Lock } from "lucide-react";
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
    <div className="flex-1 flex flex-col items-center p-6 pt-20 gap-24">
      {/* Hero Section */}
      <div className="text-center space-y-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-12"
        >
          <LogoLarge />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[0.9] text-text-primary"
        >
          Transform Git History into <br />
          <span className="text-insights">Engineering Intelligence</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto font-medium"
        >
          AI-powered insights, risk detection, and security analysis for your repositories.
        </motion.p>
      </div>

      {/* Input Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-2xl"
      >
        <div className="glass rounded-[32px] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
             <button className="text-[10px] font-mono text-insights uppercase tracking-widest hover:text-text-primary transition-colors">Try Sample Repo</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center">
                <Github className="w-5 h-5 text-success" />
              </div>
              <h2 className="text-xl font-display font-bold tracking-tight text-text-primary">Connect Repository</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-secondary uppercase tracking-widest ml-1">Repository URL</label>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary/40 group-focus-within:text-insights transition-colors" />
                  <input 
                    type="text" 
                    placeholder="https://github.com/owner/repo"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-bg/40 border border-border rounded-2xl pl-12 pr-4 py-4 text-lg placeholder:text-white/10 outline-none focus:border-insights/50 focus:ring-4 focus:ring-insights/10 transition-all text-text-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-secondary uppercase tracking-widest ml-1">Personal Access Token (Optional)</label>
                <div className="relative group">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary/40 group-focus-within:text-insights transition-colors" />
                  <input 
                    type="password" 
                    placeholder="ghp_..."
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full bg-bg/40 border border-border rounded-2xl pl-12 pr-4 py-4 text-lg placeholder:text-white/10 outline-none focus:border-insights/50 focus:ring-4 focus:ring-insights/10 transition-all text-text-primary"
                  />
                </div>
                <p className="text-[10px] text-text-secondary/40 font-mono ml-1 uppercase tracking-wider">Required for private repos or higher rate limits.</p>
              </div>
            </div>

            <button 
              type="submit"
              disabled={!url.trim()}
              className="w-full bg-gradient-to-r from-success to-insights hover:opacity-90 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-insights/20"
            >
              Analyze Repository
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl pb-24">
        <FeatureCard 
          icon={<BookOpen className="w-6 h-6 text-insights" />}
          title="Smart Story Generation"
          description="AI-generated narratives that summarize your project's evolution and key technical shifts."
          color="blue"
        />
        <FeatureCard 
          icon={<ShieldAlert className="w-6 h-6 text-warning" />}
          title="Risk Detection"
          description="Identify high-churn files and potential architectural bottlenecks before they become issues."
          color="yellow"
        />
        <FeatureCard 
          icon={<Lock className="w-6 h-6 text-danger" />}
          title="Security Intelligence"
          description="Automated detection of hardcoded secrets, unsafe code patterns, and vulnerability alerts."
          color="red"
        />
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-border py-12 flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <LogoSmall />
          <span className="font-display font-bold tracking-tight text-text-primary">SOLARIS</span>
        </div>
        <p className="text-text-secondary text-sm">© 2026 Solaris Engineering Intelligence. Built for high-performance teams.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: any) {
  const glowClass = color === 'blue' ? 'glow-blue' : color === 'yellow' ? 'glow-yellow' : 'glow-red';
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`glass rounded-3xl p-8 space-y-4 hover:border-text-secondary/20 transition-all ${glowClass}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-display font-bold tracking-tight text-text-primary">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

function LogoLarge() {
  return (
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 bg-gradient-to-br from-success to-insights rounded-full blur-2xl opacity-40 animate-pulse" />
      <svg viewBox="0 0 100 100" className="relative w-full h-full">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
        <g className="text-insights">
          <circle cx="50" cy="50" r="20" fill="url(#logoGradient)" />
          <path d="M50 10 L50 30 M50 70 L50 90 M10 50 L30 50 M70 50 L90 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M22 22 L35 35 M65 65 L78 78 M22 78 L35 65 M65 35 L78 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </g>
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function LogoSmall() {
  return (
    <svg viewBox="0 0 100 100" className="w-6 h-6">
      <circle cx="50" cy="50" r="40" fill="url(#logoGradientSmall)" />
      <defs>
        <linearGradient id="logoGradientSmall" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
