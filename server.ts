import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PAIEMENTPRO_INIT_URL =
  process.env.PAIEMENTPRO_INIT_URL ||
  "https://www.paiementpro.net/webservice/onlinepayment/init/curl-init.php";

app.post("/api/payment/init", async (req, res) => {
  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const response = await fetch(PAIEMENTPRO_INIT_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError: any) {
      const text = await response.text();
      data = { success: false, error: "Invalid response from Paiement Pro", details: text || parseError?.message };
    }

    res.status(response.ok ? 200 : 502).json(data);
  } catch (err: any) {
    console.error("PaiementPro proxy error:", err);
    res.status(502).json({ success: false, error: err?.message || "Proxy error" });
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
