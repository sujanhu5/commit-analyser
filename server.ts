import express from "express";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// GitHub API Helper with timeout
const github = axios.create({
  baseURL: "https://api.github.com",
  timeout: 8000, // 8 seconds timeout
  headers: {
    Accept: "application/vnd.github.v3+json",
  },
});

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Solaris API is operational",
    timestamp: new Date().toISOString()
  });
});

app.post("/api/analyze", async (req, res) => {
  const { repoUrl, token } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ error: "Repository URL is required" });
  }

  try {
    // Parse GitHub URL
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/.]+)/);
    if (!match) {
      return res.status(400).json({ error: "Invalid GitHub URL" });
    }

    const [_, owner, repo] = match;

    // Use provided token or fallback to env (only if not empty)
    const effectiveToken = token || process.env.GITHUB_TOKEN;
    const authHeader = (effectiveToken && effectiveToken.trim() !== "") 
      ? { Authorization: `token ${effectiveToken.trim()}` } 
      : {};

    // 1. Fetch Repo Info
    const { data: repoInfo } = await github.get(`/repos/${owner}/${repo}`, {
      headers: authHeader
    });

    if (!repoInfo) {
      throw new Error("Repository information not found");
    }

    // 2. Fetch Commits (limit to 100 for better analysis)
    const { data: commits } = await github.get(`/repos/${owner}/${repo}/commits`, {
      params: { per_page: 100 },
      headers: authHeader
    });

    if (!commits || !Array.isArray(commits)) {
      throw new Error("Could not fetch commits or repository is empty");
    }

    const analysis = {
      name: repoInfo.full_name || `${owner}/${repo}`,
      description: repoInfo.description || "No description provided",
      totalCommits: commits.length,
      contributorsCount: 0,
      lastUpdated: repoInfo.updated_at || new Date().toISOString(),
      filesChangedCount: 0,
      lastCommitDate: commits[0]?.commit?.author?.date || "",
      peakActivity: { day: "", count: 0 },
      lowestActivity: { day: "", count: 0 },
      commits: [] as any[],
      developerInsights: {} as Record<string, number>,
      commitClassification: {
        features: 0,
        bugs: 0,
        improvements: 0,
        others: 0,
      },
      riskyFiles: {} as Record<string, { churn: number; changes: number }>,
      securityAlerts: [] as any[],
      velocity: "High",
      productivityScore: 88,
      velocityData: [] as Array<{ day: string; value: number }>,
      workDistribution: [
        { name: "Feature", value: 0 },
        { name: "Bugfix", value: 0 },
        { name: "Refactor", value: 0 },
        { name: "Chore", value: 0 },
      ],
      timeline: [] as any[],
    };

    const uniqueAuthors = new Set();
    const uniqueFiles = new Set<string>();
    const commitsByDay: Record<string, number> = {};

    // 3. Process All Commits (for stats)
    commits.forEach((c: any) => {
      const author = c.commit?.author?.name || "Unknown";
      const dateStr = c.commit?.author?.date;
      const date = dateStr ? new Date(dateStr).toLocaleDateString() : "Unknown";
      
      uniqueAuthors.add(author);
      analysis.developerInsights[author] = (analysis.developerInsights[author] || 0) + 1;
      commitsByDay[date] = (commitsByDay[date] || 0) + 1;
    });

    // Calculate velocity data from commitsByDay
    analysis.velocityData = Object.entries(commitsByDay)
      .map(([day, value]) => ({ day, value }))
      .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime())
      .slice(-14); // Last 14 days of activity

    if (analysis.velocityData.length > 0) {
      const sortedByCount = [...analysis.velocityData].sort((a, b) => b.value - a.value);
      analysis.peakActivity = { day: sortedByCount[0].day, count: sortedByCount[0].value };
      analysis.lowestActivity = { day: sortedByCount[sortedByCount.length - 1].day, count: sortedByCount[sortedByCount.length - 1].value };
    }

    // 4. Process Detailed Commits (limit to 3 for Vercel stability)
    const detailedCommitsPromises = commits.slice(0, 3).map((c: any) => 
      github.get(`/repos/${owner}/${repo}/commits/${c.sha}`, {
        headers: authHeader
      }).catch(err => {
        console.error(`Failed to fetch commit ${c.sha}:`, err.message);
        return null;
      })
    );

    const detailedCommitsResults = await Promise.all(detailedCommitsPromises);

    detailedCommitsResults.forEach((result: any) => {
      if (!result || !result.data) return;
      
      const c = result.data;
      if (!c.commit) return;

      const message = c.commit.message || "";
      const author = c.commit.author?.name || "Unknown";
      const date = c.commit.author?.date || "";
      const sha = c.sha || "";

      uniqueAuthors.add(author);
      analysis.developerInsights[author] = (analysis.developerInsights[author] || 0) + 1;

      // Timeline data
      analysis.timeline.push({
        message,
        author,
        date,
        sha: sha.substring(0, 7),
        avatar: c.author?.avatar_url
      });

      // Classification
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes("add") || lowerMsg.includes("feat")) {
        analysis.commitClassification.features++;
        analysis.workDistribution[0].value++;
      } else if (lowerMsg.includes("fix") || lowerMsg.includes("bug")) {
        analysis.commitClassification.bugs++;
        analysis.workDistribution[1].value++;
      } else if (lowerMsg.includes("update") || lowerMsg.includes("refactor") || lowerMsg.includes("improve")) {
        analysis.commitClassification.improvements++;
        analysis.workDistribution[2].value++;
      } else {
        analysis.commitClassification.others++;
        analysis.workDistribution[3].value++;
      }

      // File Analysis (Churn & Security)
      if (c.files && Array.isArray(c.files)) {
        c.files.forEach((file: any) => {
          if (!file.filename) return;
          uniqueFiles.add(file.filename);
          const churn = (file.additions || 0) + (file.deletions || 0);
          if (!analysis.riskyFiles[file.filename]) {
            analysis.riskyFiles[file.filename] = { churn: 0, changes: 0 };
          }
          analysis.riskyFiles[file.filename].churn += churn;
          analysis.riskyFiles[file.filename].changes += 1;

          // Simple Security Checks on patch/content
          const patch = file.patch || "";
          
          // Patterns
          if (patch.includes("eval(")) {
            analysis.securityAlerts.push({
              issue: "Potentially dangerous 'eval()' usage",
              severity: "High",
              file: file.filename,
              fix: "Use safer alternatives like JSON.parse() or direct property access.",
            });
          }

          const secretPattern = /(API_KEY|SECRET|PASSWORD|TOKEN|ACCESS_KEY)\s*[:=]\s*['"][a-zA-Z0-9\-_]{16,}['"]/i;
          if (secretPattern.test(patch)) {
            analysis.securityAlerts.push({
              issue: "Possible hardcoded secret/token detected",
              severity: "Critical",
              file: file.filename,
              fix: "Move secrets to environment variables and rotate the leaked credential immediately.",
            });
          }
        });
      }
    });

    analysis.contributorsCount = uniqueAuthors.size;
    analysis.filesChangedCount = uniqueFiles.size;

    res.json(analysis);
  } catch (error: any) {
    console.error("Analysis Error:", error.response?.data || error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || "Failed to analyze repository";
    res.status(status).json({ error: message });
  }
});

// Global Error Middleware (MUST be after routes)
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Express Error:", err);
  res.status(500).json({ 
    error: "Internal Server Error", 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;

// Only start the server if we are NOT on Vercel
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  
  const startServer = async () => {
    if (process.env.NODE_ENV !== "production") {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  };

  startServer();
}
