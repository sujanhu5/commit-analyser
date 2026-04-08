import { ShieldAlert, ShieldCheck, ChevronRight, Lock, AlertCircle, ExternalLink } from "lucide-react";
import { AnalysisData } from "../types";
import { motion } from "motion/react";
import { RiskAnalysis } from "./RiskAnalysis";

interface SecurityPanelProps {
  data: AnalysisData;
}

export function SecurityPanel({ data }: SecurityPanelProps) {
  const alerts = data.securityAlerts;

  return (
    <div className="space-y-12">
      {/* Risk Analysis Section */}
      <RiskAnalysis riskyFiles={data.riskyFiles} />

      <div className="glass rounded-[32px] p-10 space-y-10 border-danger/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-danger" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold tracking-tight text-text-primary">Security Intelligence</h3>
              <p className="text-text-secondary text-sm">Automated vulnerability and risk detection</p>
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
            alerts.length > 0 ? "bg-danger/10 text-danger border-danger/20 animate-pulse" : "bg-success/10 text-success border-success/20"
          }`}>
            {alerts.length > 0 ? `${alerts.length} Issues Detected` : "System Secure"}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {alerts.length > 0 ? (
            alerts.map((alert, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="relative flex flex-col md:flex-row gap-6 p-8 rounded-[32px] bg-bg/40 border border-border hover:border-danger/30 transition-all">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center">
                      <AlertCircle className="w-7 h-7 text-danger" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-display font-bold text-text-primary group-hover:text-danger transition-colors">{alert.issue}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-text-secondary/40 uppercase tracking-widest">File:</span>
                          <code className="text-[10px] font-mono text-text-secondary bg-white/5 px-2 py-0.5 rounded border border-border">{alert.file}</code>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-widest border ${
                        alert.severity === "Critical" ? "bg-danger/10 text-danger border-danger/20" : "bg-warning/10 text-warning border-warning/20"
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    
                    <div className="p-6 rounded-2xl bg-danger/5 border border-danger/10">
                      <p className="text-sm text-text-secondary leading-relaxed">
                        <span className="text-danger font-bold mr-2 uppercase tracking-widest text-[10px]">Fix Recommendation:</span>
                        {alert.fix}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Lock className="w-3 h-3 text-text-secondary/40" />
                        <span className="text-[10px] font-mono text-text-secondary/60 uppercase tracking-widest">Vulnerability ID: SEC-{Math.floor(Math.random() * 9000) + 1000}</span>
                      </div>
                      <button className="flex items-center gap-2 text-[10px] font-mono text-insights hover:text-insights/80 uppercase tracking-widest transition-colors">
                        View Advisory <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-6 text-center glass rounded-[40px]">
              <div className="w-24 h-24 rounded-full bg-success/10 border border-success/20 flex items-center justify-center relative">
                <ShieldCheck className="w-12 h-12 text-success" />
                <div className="absolute inset-0 bg-success/20 blur-2xl rounded-full animate-pulse" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-display font-bold text-text-primary">System Secure</h4>
                <p className="text-text-secondary text-sm max-w-xs mx-auto">No known vulnerabilities or security risks detected in the analyzed codebase.</p>
              </div>
            </div>
          )}
        </div>

        {alerts.length > 0 && (
          <button className="w-full py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary hover:text-text-primary flex items-center justify-center gap-3 transition-all border border-border rounded-3xl hover:bg-white/5 hover:border-insights/30">
            Generate Full Security Audit Report
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
