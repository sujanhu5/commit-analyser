import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { GitBranch } from "lucide-react";
import { AnalysisData } from "../types";

interface CommitInsightsProps {
  data: AnalysisData;
}

export function CommitInsights({ data }: CommitInsightsProps) {
  const { features, bugs, improvements, others } = data.commitClassification;
  
  const chartData = [
    { name: "Features", value: features, color: "#f97316" },
    { name: "Bugs", value: bugs, color: "#ef4444" },
    { name: "Improvements", value: improvements, color: "#3b82f6" },
    { name: "Others", value: others, color: "#6b7280" },
  ].filter(d => d.value > 0);

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-6">
      <div className="flex items-center gap-2 text-orange-500 font-bold uppercase tracking-widest text-xs">
        <GitBranch className="w-4 h-4" />
        Commit Distribution
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#111", 
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "12px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-y-2">
        {chartData.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold">{d.name}</span>
            <span className="text-[10px] text-white/40 ml-auto">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
