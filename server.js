import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

/**
 * Route kiểm tra trạng thái server
 * Mở https://yourapp.repl.co/ để xem server có đang chạy không
 */
app.get("/", (req, res) => {
  res.send("✅ Threads Downloader proxy is running successfully on Replit!");
});

/**
 * Route API chính
 * Ví dụ: /api?url=https://www.threads.net/@meta/post/C9tRSK5ygWq
 */
app.get("/api", async (req, res) => {
  const target = req.query.url;
  if (!target) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  try {
    // Gọi API trung gian ổn định để lấy dữ liệu Threads
    const apiUrl = `https://api.threadsdownloader.io/threads?url=${encodeURIComponent(target)}`;
    console.log("➡️ Fetching:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*"
      },
    });

    // Chuyển kết quả về JSON nếu hợp lệ
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      console.log("✅ API response:", data);
      res.json(data);
    } catch {
      // Trường hợp API trả HTML hoặc text, báo lỗi rõ ràng
      console.error("❌ API returned non-JSON response");
      res.status(500).json({
        error: "API returned non-JSON response",
        detail: text.slice(0, 200)
      });
    }
  } catch (error) {
    console.error("❌ Proxy error:", error.message);
    res.status(500).json({
      error: "Failed to fetch data from Threads API",
      detail: error.message
    });
  }
});

// Khởi động server
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
