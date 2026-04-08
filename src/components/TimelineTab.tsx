import { AnalysisData } from "../types";
import { motion } from "motion/react";
import { GitCommit, User } from "lucide-react";

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
        <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Commit Timeline</h3>
        <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{data.totalCommits} commits found</span>
      </div>

      <div className="space-y-16">
        {Object.entries(groupedTimeline).map(([day, commits]: [string, any], dayIndex) => (
          <div key={day} className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
                {day} — {commits.length} commits
              </div>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="relative space-y-6">
              {/* Vertical Line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-white/5" />

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
                    <div className="w-2.5 h-2.5 rounded-full bg-brand border-4 border-[#050505] relative z-10 group-hover:scale-125 transition-transform" />
                    <div className="absolute inset-0 bg-brand/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-3 flex-1">
                        <h4 className="text-lg font-bold tracking-tight leading-snug group-hover:text-brand transition-colors">{commit.message}</h4>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {commit.avatar ? (
                              <img src={commit.avatar} alt={commit.author} className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
                            ) : (
                              <User className="w-4 h-4 text-white/20" />
                            )}
                            <span className="text-xs text-white/40 font-medium">{commit.author}</span>
                          </div>
                          <code className="text-[10px] font-mono text-white/20 bg-white/5 px-2 py-0.5 rounded uppercase tracking-widest">{commit.sha}</code>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest whitespace-nowrap mt-1">
                        {new Date(commit.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
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
