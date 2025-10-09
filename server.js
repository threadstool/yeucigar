import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
const PORT = process.env.PORT || 10000;

// Kiểm tra server
app.get("/", (req, res) => {
  res.send("✅ Threads Downloader proxy is live on Render!");
});

// API chính
app.get("/api", async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).json({ error: "Missing URL parameter" });

  try {
    // Gọi API trung gian chuyên dụng ThreadsDownloader.io
    const apiUrl = `https://api.threadsdownloader.io/threads?url=${encodeURIComponent(target)}`;
    console.log("➡️ Fetching:", apiUrl);

    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ Proxy error:", error.message);
    res.status(500).json({
      error: "Failed to fetch Threads data",
      detail: error.message,
    });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running at port ${PORT}`));
