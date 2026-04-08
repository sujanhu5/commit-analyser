import { AnalysisData } from "../types";
import { motion } from "motion/react";
import { Zap, ShieldAlert, TrendingUp, Activity, BarChart3 as BarChartIcon } from "lucide-react";
import { DeveloperInsights } from "./DeveloperInsights";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

interface AnalyticsTabProps {
  data: AnalysisData;
  showOnlyDevs?: boolean;
}

export function AnalyticsTab({ data, showOnlyDevs = false }: AnalyticsTabProps) {
  if (showOnlyDevs) {
    return (
      <div className="space-y-8">
        <DeveloperInsights data={data} />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Top Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Zap className="w-4 h-4 text-insights" />}
          label="Productivity Score"
          value={data.productivityScore}
          subContent={
            <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${data.productivityScore}%` }}
                className="h-full bg-insights"
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          }
        />
        <StatCard 
          icon={<ShieldAlert className="w-4 h-4 text-warning" />}
          label="Risk Assessment"
          value={data.securityAlerts.length > 0 ? "Moderate Risk" : "Low Risk"}
          subContent={
            <p className="text-text-secondary text-xs leading-relaxed mt-2">
              {data.securityAlerts.length > 0 
                ? `Detected ${data.securityAlerts.length} potential issues requiring attention.`
                : "No critical security vulnerabilities or architectural risks detected."}
            </p>
          }
        />
        <StatCard 
          icon={<TrendingUp className="w-4 h-4 text-success" />}
          label="Velocity"
          value={data.velocity}
          subContent={
            <p className="text-text-secondary/40 text-[10px] font-mono uppercase tracking-widest mt-2">Increasing trend detected</p>
          }
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Commit Activity */}
        <div className="glass rounded-[32px] p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Activity className="w-5 h-5 text-insights" />
               <h3 className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.3em]">Commit Activity</h3>
            </div>
            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-[8px] font-mono text-text-secondary/40 uppercase tracking-widest">Peak Activity</p>
                <p className="text-xs font-bold text-success">{data.peakActivity.count} commits</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-mono text-text-secondary/40 uppercase tracking-widest">Lowest Activity</p>
                <p className="text-xs font-bold text-warning">{data.lowestActivity.count} commits</p>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.velocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                  tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '12px' }}
                  itemStyle={{ color: '#E5E7EB', fontSize: '12px' }}
                  labelStyle={{ color: '#9CA3AF', fontSize: '10px', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={3} 
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4, stroke: '#0B0F14' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Work Distribution */}
        <div className="glass rounded-[32px] p-8 space-y-8">
          <div className="flex items-center gap-3">
             <BarChartIcon className="w-5 h-5 text-insights" />
             <h3 className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.3em]">Work Distribution</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.workDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '12px' }}
                  itemStyle={{ color: '#E5E7EB', fontSize: '12px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.workDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#3B82F6" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subContent }: any) {
  return (
    <div className="glass rounded-[32px] p-8 space-y-4 hover:border-text-secondary/20 transition-all">
      <div className="flex items-center gap-2 text-[10px] font-mono text-text-secondary uppercase tracking-widest">
        {icon}
        {label}
      </div>
      <div className="text-4xl font-display font-bold tracking-tighter text-text-primary">{value}</div>
      {subContent}
    </div>
  );
}
