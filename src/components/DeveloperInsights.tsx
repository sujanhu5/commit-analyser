import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users } from "lucide-react";
import { AnalysisData } from "../types";

interface DeveloperInsightsProps {
  data: AnalysisData;
}

export function DeveloperInsights({ data }: DeveloperInsightsProps) {
  const chartData = Object.entries(data.developerInsights)
    .map(([name, count]) => ({ 
      name, 
      count,
      percentage: Math.round((count / data.totalCommits) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="bg-[#111] border border-white/10 rounded-[32px] p-8 space-y-8">
      <div className="flex items-center gap-3">
         <Users className="w-5 h-5 text-brand" />
         <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Developer Contribution</h3>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 20 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
              width={100}
            />
            <Tooltip 
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              contentStyle={{ 
                backgroundColor: "#111", 
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "12px"
              }}
              itemStyle={{ color: '#fff' }}
              formatter={(value: any) => [`${value} commits`, 'Contribution']}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#3b82f6" fillOpacity={1 - (index * 0.15)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <p className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-mono mb-1">Top Contributor</p>
          <p className="text-sm font-bold truncate text-white">{chartData[0]?.name || "N/A"}</p>
          <p className="text-[10px] text-brand font-mono mt-1">{chartData[0]?.percentage || 0}% of total</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <p className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-mono mb-1">Active Devs</p>
          <p className="text-sm font-bold text-white">{data.contributorsCount}</p>
          <p className="text-[10px] text-white/20 font-mono mt-1">Total Authors</p>
        </div>
      </div>
    </div>
  );
}
