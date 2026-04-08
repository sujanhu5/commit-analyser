import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// GitHub API Helper
const github = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github.v3+json",
    ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
  },
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

    // Use provided token or fallback to env
    const authHeader = token ? { Authorization: `token ${token}` } : 
                       (process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {});

    // 1. Fetch Repo Info
    const { data: repoInfo } = await github.get(`/repos/${owner}/${repo}`, {
      headers: authHeader
    });

    // 2. Fetch Commits (limit to 100 for better analysis)
    const { data: commits } = await github.get(`/repos/${owner}/${repo}/commits`, {
      params: { per_page: 100 },
      headers: authHeader
    });

    const analysis = {
      name: repoInfo.full_name,
      description: repoInfo.description,
      totalCommits: commits.length,
      contributorsCount: 0,
      lastUpdated: repoInfo.updated_at,
      filesChangedCount: 0,
      lastCommitDate: commits[0]?.commit.author.date || "",
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
      const author = c.commit.author.name;
      const date = new Date(c.commit.author.date).toLocaleDateString();
      
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

    // 4. Process Detailed Commits (limit to 20 for file analysis)
    const detailedCommitsPromises = commits.slice(0, 20).map((c: any) => 
      github.get(`/repos/${owner}/${repo}/commits/${c.sha}`, {
        headers: authHeader
      })
    );

    const detailedCommitsResults = await Promise.all(detailedCommitsPromises);

    detailedCommitsResults.forEach((result: any, index: number) => {
      const c = result.data;
      const message = c.commit.message;
      const author = c.commit.author.name;
      const date = c.commit.author.date;
      const sha = c.sha;

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
      c.files.forEach((file: any) => {
        uniqueFiles.add(file.filename);
        const churn = file.additions + file.deletions;
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
    });

    analysis.contributorsCount = uniqueAuthors.size;
    analysis.filesChangedCount = uniqueFiles.size;

    res.json(analysis);
  } catch (error: any) {
    console.error("Analysis Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to analyze repository. Check URL or rate limits." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
