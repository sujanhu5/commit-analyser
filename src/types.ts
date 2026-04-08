export interface AnalysisData {
  name: string;
  description: string;
  totalCommits: number;
  contributorsCount: number;
  lastUpdated: string;
  filesChangedCount: number;
  lastCommitDate: string;
  peakActivity: { day: string; count: number };
  lowestActivity: { day: string; count: number };
  commitClassification: {
    features: number;
    bugs: number;
    improvements: number;
    others: number;
  };
  developerInsights: Record<string, number>;
  riskyFiles: Record<string, { churn: number; changes: number }>;
  securityAlerts: SecurityAlert[];
  velocity: string;
  productivityScore: number;
  velocityData: Array<{ day: string; value: number }>;
  workDistribution: Array<{ name: string; value: number }>;
  timeline: Array<{
    message: string;
    author: string;
    date: string;
    sha: string;
    avatar?: string;
  }>;
}

export interface SecurityAlert {
  issue: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  file: string;
  fix: string;
}
