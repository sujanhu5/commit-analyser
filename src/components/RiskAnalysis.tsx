import { AlertTriangle, FileCode, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface RiskAnalysisProps {
  riskyFiles: Record<string, { churn: number; changes: number }>;
}

export function RiskAnalysis({ riskyFiles }: RiskAnalysisProps) {
  const sortedFiles = Object.entries(riskyFiles)
    .sort((a, b) => b[1].churn - a[1].churn)
    .slice(0, 5);

  const getRiskLevel = (churn: number) => {
    if (churn > 500) return { label: "Critical", color: "text-danger", bg: "bg-danger/10", border: "border-danger/20" };
    if (churn > 100) return { label: "High", color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" };
    return { label: "Moderate", color: "text-success", bg: "bg-success/10", border: "border-success/20" };
  };

  return (
    <div className="glass rounded-[32px] p-10 space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-warning" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold tracking-tight text-text-primary">Architectural Risk</h3>
            <p className="text-text-secondary text-sm">High-churn files and potential bottlenecks</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sortedFiles.length > 0 ? (
          sortedFiles.map(([filename, stats], i) => {
            const risk = getRiskLevel(stats.churn);
            return (
              <motion.div 
                key={filename}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="relative flex flex-col gap-4 p-6 rounded-3xl bg-bg/40 border border-border hover:border-warning/30 transition-all">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-border flex items-center justify-center">
                        <FileCode className="w-5 h-5 text-text-secondary" />
                      </div>
                      <span className="text-base font-medium truncate text-text-primary">{filename}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border ${risk.bg} ${risk.color} ${risk.border}`}>
                      {risk.label}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div className="space-y-1">
                      <p className="text-[8px] font-mono text-text-secondary/40 uppercase tracking-widest">Code Churn</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`w-3 h-3 ${risk.color}`} />
                        <span className="text-sm font-bold text-text-primary">{stats.churn} lines</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-mono text-text-secondary/40 uppercase tracking-widest">Total Changes</p>
                      <p className="text-sm font-bold text-text-primary">{stats.changes} commits</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${risk.color.replace('text-', 'bg-')}`} 
                      style={{ width: `${Math.min((stats.churn / 1000) * 100, 100)}%` }} 
                    />
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-4 text-center glass rounded-3xl">
            <p className="text-sm text-text-secondary italic">No significant architectural churn detected.</p>
          </div>
        )}
      </div>
    </div>
  );
}
