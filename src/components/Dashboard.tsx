import { useState, useEffect } from "react";
import { AnalysisData } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  History, 
  BarChart3, 
  GitCommit, 
  Users, 
  FileCode, 
  Clock, 
  Shield, 
  LayoutDashboard, 
  Terminal, 
  RefreshCw,
  LogOut,
  ChevronRight,
  Github
} from "lucide-react";
import { NarrativeTab } from "./NarrativeTab";
import { TimelineTab } from "./TimelineTab";
import { AnalyticsTab } from "./AnalyticsTab";
import { SecurityPanel } from "./SecurityPanel";
import { StandupGenerator } from "./StandupGenerator";

interface DashboardProps {
  data: AnalysisData;
  onReset: () => void;
}

type Tab = "dashboard" | "insights" | "security" | "developers" | "reports" | "timeline";

export function Dashboard({ data, onReset }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [lastUpdated, setLastUpdated] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "insights", label: "AI Insights", icon: FileText },
    { id: "security", label: "Security", icon: Shield },
    { id: "developers", label: "Developers", icon: Users },
    { id: "timeline", label: "Timeline", icon: History },
    { id: "reports", label: "Reports", icon: Terminal },
  ];

  const stats = [
    { label: "Total Commits", value: data.totalCommits, icon: GitCommit, color: "text-insights", bg: "bg-insights/10" },
    { label: "Contributors", value: data.contributorsCount, icon: Users, color: "text-success", bg: "bg-success/10" },
    { label: "Files Changed", value: data.filesChangedCount, icon: FileCode, color: "text-warning", bg: "bg-warning/10" },
    { label: "Last Commit", value: new Date(data.lastCommitDate).toLocaleDateString(), icon: Clock, color: "text-danger", bg: "bg-danger/10" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col bg-card/30 backdrop-blur-xl">
        <div className="p-6 flex items-center gap-3">
          <LogoSmall />
          <span className="font-display font-bold tracking-tight text-xl text-text-primary">SOLARIS</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group
                ${activeTab === item.id 
                  ? "bg-insights/10 text-insights border border-insights/20" 
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"}
              `}
            >
              <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-insights" : "text-text-secondary group-hover:text-text-primary"}`} />
              {item.label}
              {activeTab === item.id && <ChevronRight className="w-3 h-3 ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={onReset}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Exit Analysis
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 border-b border-border flex items-center justify-between px-8 bg-card/20 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-white/5 border border-border flex items-center gap-2">
              <Github className="w-3 h-3 text-text-secondary" />
              <span className="text-xs font-mono text-text-secondary">{data.name}</span>
            </div>
            <h2 className="text-lg font-display font-bold tracking-tight text-text-primary capitalize">{activeTab}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/5 border border-success/20">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-mono text-success uppercase tracking-widest">Live Monitoring Active</span>
            </div>
            <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">
              Last updated: {lastUpdated}s ago
            </div>
            <button className="p-2 rounded-xl bg-white/5 border border-border hover:bg-white/10 transition-all text-text-secondary hover:text-text-primary">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto space-y-12">
            {/* Stats Overview (Always visible on Dashboard tab) */}
            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-[32px] p-8 relative overflow-hidden group hover:border-text-secondary/20 transition-all"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} blur-[64px] -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity`} />
                    <div className="relative z-10 flex items-center gap-6">
                      <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                        <p className="text-3xl font-display font-bold tracking-tight text-text-primary">{stat.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "dashboard" && <AnalyticsTab data={data} />}
                {activeTab === "insights" && <NarrativeTab data={data} />}
                {activeTab === "security" && <SecurityPanel data={data} />}
                {activeTab === "developers" && <AnalyticsTab data={data} showOnlyDevs={true} />}
                {activeTab === "timeline" && <TimelineTab data={data} />}
                {activeTab === "reports" && <StandupGenerator data={data} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

function LogoSmall() {
  return (
    <svg viewBox="0 0 100 100" className="w-8 h-8">
      <circle cx="50" cy="50" r="40" fill="url(#logoGradientDashboard)" />
      <defs>
        <linearGradient id="logoGradientDashboard" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
