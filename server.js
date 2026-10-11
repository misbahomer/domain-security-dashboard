
const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/api/dns/all", async (req, res) => {
  const { domain } = req.query;

  if (!domain || !/^[a-zA-Z0-9.-]+$/.test(domain)) {
    return res.status(400).json({ error: "Invalid domain" });
  }

  try {
    const response = await fetch(
      `https://domscan.net/v1/dns/all?domain=${encodeURIComponent(domain)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.DOMSCAN_API_KEY}`,
        },
      }
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(502).json({ error: "DNS lookup failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
