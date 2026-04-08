import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users, Trophy, Activity } from "lucide-react";
import { AnalysisData } from "../types";
import { motion } from "motion/react";

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
    <div className="glass rounded-[32px] p-10 space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center">
            <Users className="w-6 h-6 text-success" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold tracking-tight text-text-primary">Developer Contribution</h3>
            <p className="text-text-secondary text-sm">Analysis of top contributors and engagement</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-insights/10 border border-insights/20">
          <Activity className="w-3 h-3 text-insights" />
          <span className="text-[10px] font-mono text-insights uppercase tracking-widest">{data.contributorsCount} Active Developers</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 h-[400px] w-full bg-bg/40 p-8 rounded-[32px] border border-border">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 40 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#9CA3AF", fontSize: 10 }}
                width={100}
              />
              <Tooltip 
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                contentStyle={{ 
                  backgroundColor: "#111827", 
                  border: "1px solid #1F2937",
                  borderRadius: "16px",
                  fontSize: "12px"
                }}
                itemStyle={{ color: '#E5E7EB' }}
                formatter={(value: any) => [`${value} commits`, 'Contribution']}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={32}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#3B82F6" fillOpacity={1 - (index * 0.15)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-[32px] bg-insights/5 border border-insights/10 space-y-4"
          >
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-warning" />
              <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-mono">Top Contributor</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold truncate text-text-primary">{chartData[0]?.name || "N/A"}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-insights" style={{ width: `${chartData[0]?.percentage || 0}%` }} />
                </div>
                <p className="text-[10px] text-insights font-mono font-bold">{chartData[0]?.percentage || 0}%</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4">
            {chartData.slice(1, 4).map((dev, i) => (
              <div key={dev.name} className="p-4 rounded-2xl bg-white/5 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-bg border border-border flex items-center justify-center text-[10px] font-bold text-text-secondary">
                    {i + 2}
                  </div>
                  <span className="text-sm font-medium text-text-primary truncate max-w-[120px]">{dev.name}</span>
                </div>
                <span className="text-[10px] font-mono text-text-secondary">{dev.count} commits</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
