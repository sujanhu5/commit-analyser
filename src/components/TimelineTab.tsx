import { AnalysisData } from "../types";
import { motion } from "motion/react";
import { GitCommit, User, Clock, History } from "lucide-react";

interface TimelineTabProps {
  data: AnalysisData;
}

export function TimelineTab({ data }: TimelineTabProps) {
  // Group commits by day
  const groupedTimeline = data.timeline.reduce((acc: any, commit) => {
    const day = new Date(commit.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    if (!acc[day]) acc[day] = [];
    acc[day].push(commit);
    return acc;
  }, {});

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end px-2">
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-insights" />
          <h3 className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.3em]">Commit Timeline</h3>
        </div>
        <span className="text-[10px] font-mono text-text-secondary/40 uppercase tracking-widest">{data.totalCommits} commits found</span>
      </div>

      <div className="space-y-16">
        {Object.entries(groupedTimeline).map(([day, commits]: [string, any], dayIndex) => (
          <div key={day} className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <div className="px-5 py-2 rounded-full glass border-border text-[10px] font-mono text-text-secondary uppercase tracking-[0.2em]">
                {day} — {commits.length} commits
              </div>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="relative space-y-6">
              {/* Vertical Line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-border/50" />

              {commits.map((commit: any, index: number) => (
                <motion.div 
                  key={commit.sha}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (dayIndex * 0.1) + (index * 0.05) }}
                  className="relative pl-12 group"
                >
                  {/* Dot */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-insights border-4 border-bg relative z-10 group-hover:scale-125 transition-transform glow-blue" />
                    <div className="absolute inset-0 bg-insights/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="glass rounded-2xl p-6 hover:border-insights/30 transition-all">
                    <div className="flex justify-between items-start gap-6">
                      <div className="space-y-4 flex-1">
                        <h4 className="text-lg font-display font-bold tracking-tight leading-snug text-text-primary group-hover:text-insights transition-colors">{commit.message}</h4>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            {commit.avatar ? (
                              <img src={commit.avatar} alt={commit.author} className="w-6 h-6 rounded-full border border-border" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-white/5 border border-border flex items-center justify-center">
                                <User className="w-3 h-3 text-text-secondary" />
                              </div>
                            )}
                            <span className="text-xs text-text-secondary font-medium">{commit.author}</span>
                          </div>
                          <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-border">
                            <GitCommit className="w-3 h-3 text-text-secondary/40" />
                            <code className="text-[10px] font-mono text-text-secondary/60 uppercase tracking-widest">{commit.sha.substring(0, 7)}</code>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-text-secondary/40 uppercase tracking-widest whitespace-nowrap mt-1">
                        <Clock className="w-3 h-3" />
                        {new Date(commit.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
