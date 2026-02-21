import express from "express";

const router = express.Router();

router.get("/reverse", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res
      .status(400)
      .json({ message: "Latitude and Longitude are required" });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
      {
        headers: {
          "User-Agent": "DualKeyVictoriaApp/1.0",
        },
      },
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Geocoding proxy error:", error);
    res.status(500).json({ message: "Failed to fetch geocoding data" });
  }
});

router.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ message: "Query is required" });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(q)}`,
      {
        headers: {
          "User-Agent": "DualKeyVictoriaApp/1.0",
        },
      },
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Geocoding search proxy error:", error);
    res.status(500).json({ message: "Failed to fetch geocoding data" });
  }
});

export default router;
