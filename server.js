import express from "express";
import axios from "axios";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/api", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ ok: false, error: "Thiếu URL Threads" });

    const api = `https://savein.io/api?url=${encodeURIComponent(url)}`;
    const response = await axios.get(api, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 15000,
    });

    return res.json(response.data);
  } catch (e) {
    console.error("Error:", e.message);
    return res.status(500).json({ ok: false, error: "Lỗi proxy hoặc API không phản hồi" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Threads Downloader chạy tại http://localhost:${PORT}`));
