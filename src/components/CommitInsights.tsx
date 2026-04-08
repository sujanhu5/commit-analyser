import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { GitBranch, PieChart as PieIcon } from "lucide-react";
import { AnalysisData } from "../types";

interface CommitInsightsProps {
  data: AnalysisData;
}

export function CommitInsights({ data }: CommitInsightsProps) {
  const { features, bugs, improvements, others } = data.commitClassification;
  
  const chartData = [
    { name: "Features", value: features, color: "#22C55E", glow: "glow-green" },
    { name: "Bugs", value: bugs, color: "#EF4444", glow: "glow-red" },
    { name: "Improvements", value: improvements, color: "#3B82F6", glow: "glow-blue" },
    { name: "Others", value: others, color: "#9CA3AF", glow: "" },
  ].filter(d => d.value > 0);

  return (
    <div className="glass rounded-[32px] p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-insights/10 border border-insights/20 flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-insights" />
          </div>
          <h3 className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.3em]">Commit Distribution</h3>
        </div>
      </div>

      <div className="h-[220px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#111827", 
                border: "1px solid #1F2937",
                borderRadius: "16px",
                fontSize: "12px"
              }}
              itemStyle={{ color: '#E5E7EB' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <PieIcon className="w-6 h-6 text-text-secondary/20" />
          <span className="text-[10px] font-mono text-text-secondary/40 uppercase tracking-widest mt-1">Types</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {chartData.map((d) => (
          <div key={d.name} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-border group hover:border-border/60 transition-all">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${d.glow}`} style={{ backgroundColor: d.color }} />
              <span className="text-[10px] text-text-secondary uppercase tracking-widest font-bold group-hover:text-text-primary transition-colors">{d.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full" style={{ backgroundColor: d.color, width: `${(d.value / data.totalCommits) * 100}%` }} />
              </div>
              <span className="text-[10px] font-mono text-text-secondary/60">{d.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
