import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
const PORT = process.env.PORT || 10000;

// Kiểm tra trạng thái server
app.get("/", (req, res) => {
  res.send("✅ Threads Downloader proxy is running!");
});

// API proxy chính
app.get("/api", async (req, res) => {
  const target = req.query.url;
  if (!target) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  try {
    // Gọi API thật để lấy dữ liệu video từ Threads
    const apiUrl = `https://savein.io/api?url=${encodeURIComponent(target)}`;
    const response = await fetch(apiUrl, { timeout: 20000 });
    const data = await response.json();

    // Trả lại dữ liệu cho frontend
    res.json(data);
  } catch (error) {
    console.error("❌ Lỗi proxy:", error.message);
    res.status(500).json({
      error: "Failed to fetch data from savein.io",
      detail: error.message,
    });
  }
});

// Lắng nghe cổng mặc định (Render sẽ tự đặt PORT)
app.listen(PORT, () => {
  console.log(`🚀 Server running at port ${PORT}`);
});
