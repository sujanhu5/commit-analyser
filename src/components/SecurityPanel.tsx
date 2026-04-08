import { ShieldAlert, ShieldCheck, ChevronRight } from "lucide-react";
import { SecurityAlert } from "../types";
import { cn } from "../lib/utils";

interface SecurityPanelProps {
  alerts: SecurityAlert[];
}

export function SecurityPanel({ alerts }: SecurityPanelProps) {
  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-orange-500 font-bold uppercase tracking-widest text-xs">
          <ShieldAlert className="w-4 h-4" />
          Security Intelligence
        </div>
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
          alerts.length > 0 ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
        )}>
          {alerts.length > 0 ? `${alerts.length} Issues` : "Secure"}
        </span>
      </div>

      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert, i) => (
            <div key={i} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
              <div className="relative p-4 rounded-xl bg-[#0a0a0a] border border-white/5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-white/90 leading-tight">{alert.issue}</h4>
                  <span className={cn(
                    "text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
                    alert.severity === "Critical" ? "bg-red-500 text-white" : "bg-orange-500/20 text-orange-500"
                  )}>
                    {alert.severity}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
                    <span className="text-orange-500/50">FILE:</span>
                    <span className="truncate">{alert.file}</span>
                  </div>
                  <div className="p-2 rounded bg-white/[0.03] border border-white/5">
                    <p className="text-[10px] text-white/60 leading-relaxed italic">
                      <span className="text-orange-500 font-bold not-italic mr-1">FIX:</span>
                      {alert.fix}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-white/90">No vulnerabilities found</p>
              <p className="text-xs text-white/40">Repository passed basic security scans.</p>
            </div>
          </div>
        )}
      </div>

      {alerts.length > 0 && (
        <button className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white flex items-center justify-center gap-1 transition-colors">
          View Full Security Report
          <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
