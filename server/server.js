require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo";

// Simple in-memory cache for chat responses
const chatCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// =======================
// RACES ROUTE
// =======================
app.get("/api/races", async (req, res) => {
  const season = req.query.season || "2024";

  try {
    const response = await fetch(
      `https://api.jolpi.ca/ergast/f1/${season}.json`
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching races:", error);
    res.status(500).json({ error: "Failed to fetch races" });
  }
});

// =======================
// DRIVER RESULTS ROUTE
// =======================
app.get("/api/f1/:season/drivers/:driver/results.json", async (req, res) => {
  const { season, driver } = req.params;

  try {
    const response = await fetch(
      `https://api.jolpi.ca/ergast/f1/${season}/drivers/${driver}/results.json`
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching driver results:", error);
    res.status(500).json({ error: "Failed to fetch driver results" });
  }
});

// =======================
// 🔥 TEAM COMPARISON ROUTE
// =======================
app.get("/api/team-comparison", async (req, res) => {
  const { team1, team2, season } = req.query;

  if (!team1 || !team2 || !season) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
      const racesResponse = await fetch(
        `https://api.jolpi.ca/ergast/f1/${season}.json`
      );

      const racesData = await racesResponse.json();
      const raceList = racesData.MRData.RaceTable.Races;

    const races = [];

    let team1Stats = {
      name: team1,
      totalPoints: 0,
      wins: 0,
      podiums: 0,
    };

    let team2Stats = {
      name: team2,
      totalPoints: 0,
      wins: 0,
      podiums: 0,
    };

    let team1Positions = [];
    let team2Positions = [];

    // Helper to get best driver
    const getBestDriver = (drivers) => {
      if (!drivers.length) return null;

      return drivers.reduce((best, current) => {
        return parseInt(current.position) < parseInt(best.position)
          ? current
          : best;
      });
    };

    for (const race of raceList) {
      const round = race.round;

      const resultResponse = await fetch(
        `https://api.jolpi.ca/ergast/f1/${season}/${round}/results.json`
      );

        const resultData = await resultResponse.json();

        const raceData = resultData.MRData.RaceTable.Races;

        // 🛑 SAFETY CHECK
        if (!raceData || raceData.length === 0) {
          console.log("No data for round:", round);
          continue;
        }

const results = raceData[0].Results;

      const team1Drivers = results.filter(
        (r) => r.Constructor.constructorId === team1
      );

      const team2Drivers = results.filter(
        (r) => r.Constructor.constructorId === team2
      );

      const best1 = getBestDriver(team1Drivers);
      const best2 = getBestDriver(team2Drivers);

      const team1BestPos = best1 ? parseInt(best1.position) : "-";
      const team2BestPos = best2 ? parseInt(best2.position) : "-";

      const team1Driver = best1
        ? `${best1.Driver.familyName}`
        : "-";

      const team2Driver = best2
        ? `${best2.Driver.familyName}`
        : "-";

      const team1Points = team1Drivers.reduce(
        (sum, r) => sum + parseFloat(r.points || 0),
        0
      );

      const team2Points = team2Drivers.reduce(
        (sum, r) => sum + parseFloat(r.points || 0),
        0
      );

      // Track positions
      if (team1BestPos !== "-") team1Positions.push(team1BestPos);
      if (team2BestPos !== "-") team2Positions.push(team2BestPos);

      // Stats
      team1Stats.totalPoints += team1Points;
      team2Stats.totalPoints += team2Points;

      if (team1BestPos === 1) team1Stats.wins++;
      if (team2BestPos === 1) team2Stats.wins++;

      if (team1BestPos <= 3) team1Stats.podiums++;
      if (team2BestPos <= 3) team2Stats.podiums++;

      // Push race data
      races.push({
        raceName: race.raceName,

        team1Position: team1BestPos,
        team2Position: team2BestPos,

        team1Driver,
        team2Driver,

        team1Points,
        team2Points,
      });
    }

    // Extra stats
    const avg = (arr) =>
      arr.length
        ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)
        : 0;

    const extraStats = {
      team1: {
        avgFinish: avg(team1Positions),
        top10: team1Positions.filter((p) => p <= 10).length,
      },
      team2: {
        avgFinish: avg(team2Positions),
        top10: team2Positions.filter((p) => p <= 10).length,
      },
    };

    res.json({
      team1Stats,
      team2Stats,
      races,
      extraStats,
    });
  } catch (error) {
    console.error("Error in team comparison:", error);
    res.status(500).json({ error: "Failed to fetch team comparison" });
  }
});

// =======================
// 🤖 AI CHAT ROUTE (OpenRouter)
// =======================
app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  // Check cache first
  const cacheKey = prompt.toLowerCase().trim();
  const cached = chatCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json({ response: cached.response, cached: true });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "F1 Analyzer"
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "system",
            content: "You are an expert F1 analyst. Answer questions briefly and accurately in 2-3 sentences max. Focus only on Formula 1 racing topics."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API error:", errorData);
      return res.status(500).json({ error: "AI service unavailable" });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    // Cache the response
    chatCache.set(cacheKey, {
      response: aiResponse,
      timestamp: Date.now()
    });

    // Limit cache size to 100 entries
    if (chatCache.size > 100) {
      const firstKey = chatCache.keys().next().value;
      chatCache.delete(firstKey);
    }

    res.json({ response: aiResponse });

  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Failed to process chat request" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});