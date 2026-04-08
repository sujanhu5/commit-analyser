import { useState } from "react";
import { AnalysisData } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { FileText, History, BarChart3, GitCommit, Users, FileCode, Clock } from "lucide-react";
import { NarrativeTab } from "./NarrativeTab";
import { TimelineTab } from "./TimelineTab";
import { AnalyticsTab } from "./AnalyticsTab";

interface DashboardProps {
  data: AnalysisData;
}

type Tab = "narrative" | "timeline" | "analytics";

export function Dashboard({ data }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("analytics");

  const tabs = [
    { id: "narrative", label: "Narrative", icon: FileText },
    { id: "timeline", label: "Timeline", icon: History },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const stats = [
    { label: "Total Commits", value: data.totalCommits, icon: GitCommit, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Contributors", value: data.contributorsCount, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Files Changed", value: data.filesChangedCount, icon: FileCode, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Last Commit", value: new Date(data.lastCommitDate).toLocaleDateString(), icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-12 flex-1 flex flex-col w-full">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#111] border border-white/10 rounded-[32px] p-8 relative overflow-hidden group hover:border-white/20 transition-all"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} blur-[64px] -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10 flex items-center gap-6">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-3xl font-display font-bold tracking-tight text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative
              ${activeTab === tab.id ? "text-white" : "text-white/40 hover:text-white/60"}
            `}
          >
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <tab.icon className={`w-4 h-4 relative z-10 ${activeTab === tab.id ? "text-white" : "text-white/40"}`} />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {activeTab === "narrative" && <NarrativeTab data={data} />}
            {activeTab === "timeline" && <TimelineTab data={data} />}
            {activeTab === "analytics" && <AnalyticsTab data={data} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
