import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PAIEMENTPRO_INIT_URL =
  "https://www.paiementpro.net/webservice/onlinepayment/js/initialize/initialize.php";

app.post("/api/payment/init", async (req, res) => {
  try {
    const response = await fetch(PAIEMENTPRO_INIT_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("PaiementPro proxy error:", err);
    res.status(502).json({ success: false, error: "Proxy error" });
  }
});

const distPath = path.resolve(process.cwd(), "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const PORT = process.env.API_PORT || process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (fs.existsSync(distPath)) {
    console.log(`Serving frontend from ${distPath}`);
  }
});
