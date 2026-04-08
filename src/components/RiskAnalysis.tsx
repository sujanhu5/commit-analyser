import { AlertTriangle, FileCode } from "lucide-react";
import { cn } from "../lib/utils";

interface RiskAnalysisProps {
  riskyFiles: Record<string, { churn: number; changes: number }>;
}

export function RiskAnalysis({ riskyFiles }: RiskAnalysisProps) {
  const sortedFiles = Object.entries(riskyFiles)
    .sort((a, b) => b[1].churn - a[1].churn)
    .slice(0, 5);

  const getRiskLevel = (churn: number) => {
    if (churn > 500) return { label: "High", color: "text-red-500", bg: "bg-red-500/10" };
    if (churn > 100) return { label: "Medium", color: "text-yellow-500", bg: "bg-yellow-500/10" };
    return { label: "Low", color: "text-green-500", bg: "bg-green-500/10" };
  };

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-6">
      <div className="flex items-center gap-2 text-orange-500 font-bold uppercase tracking-widest text-xs">
        <AlertTriangle className="w-4 h-4" />
        Risk Analysis
      </div>

      <div className="space-y-4">
        {sortedFiles.length > 0 ? (
          sortedFiles.map(([filename, stats]) => {
            const risk = getRiskLevel(stats.churn);
            return (
              <div key={filename} className="flex flex-col gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileCode className="w-4 h-4 text-white/20 flex-shrink-0" />
                    <span className="text-sm font-medium truncate text-white/80">{filename}</span>
                  </div>
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter", risk.bg, risk.color)}>
                    {risk.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-white/30 font-mono uppercase tracking-widest">
                  <span>Churn: {stats.churn}</span>
                  <span>Changes: {stats.changes}</span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-white/40 text-center py-4 italic">No significant churn detected.</p>
        )}
      </div>
    </div>
  );
}
