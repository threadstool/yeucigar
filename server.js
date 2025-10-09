import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("✅ Threads Downloader proxy is live on Render!");
});

app.get("/api", async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).json({ error: "Missing URL parameter" });

  try {
    // API thay thế đang hoạt động ổn định
    const apiUrl = `https://snapsave.app/api/threads?url=${encodeURIComponent(target)}`;
    console.log("➡️ Fetching:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
      },
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      res.json(data);
    } catch {
      res.status(500).json({
        error: "API returned non-JSON response",
        detail: text.slice(0, 200),
      });
    }
  } catch (error) {
    console.error("❌ Proxy error:", error.message);
    res.status(500).json({
      error: "Failed to fetch Threads data",
      detail: error.message,
    });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running at port ${PORT}`));
