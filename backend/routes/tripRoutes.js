const express = require("express")
const { OpenAI } = require("openai");

const router = express.Router()

const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('Missing OPENAI_API_KEY or OPENROUTER_API_KEY');
}
console.log('TripRoutes API key loaded, length:', apiKey.length);
const client = new OpenAI({
  apiKey,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "AI Travel Planner"
  }
})

router.post("/generate-trip", async (req, res) => {

  try {

    const {
      destination,
      budget,
      days,
      interest
    } = req.body

    const prompt = `
Generate a detailed ${days}-day travel itinerary for ${destination}.

Budget: ₹${budget}

Interest: ${interest}

Include:
- day-wise itinerary
- places to visit
- hotel suggestions
- food recommendations
- travel tips
- estimated expenses
`

    const completion =
      await client.chat.completions.create({

        model: "meta-llama/llama-3-8b-instruct",

        messages: [
          {
            role: "user",
            content: prompt
          }
        ]

      })

    const rawPlan = completion.choices[0].message.content;
    // Simple deduplication: remove identical consecutive lines
    const lines = rawPlan.split(/\r?\n/);
    const uniqueLines = [];
    const seen = new Set();
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !seen.has(trimmed)) {
        uniqueLines.push(line);
        seen.add(trimmed);
      }
    }
    const tripPlan = uniqueLines.join('\n');

    // Split the cleaned plan into day sections ("Day X:")
    const daySections = [];
    const dayRegex = /Day\s+(\d+):/gi;
    let match;
    const raw = `\n${tripPlan}\n`;
    const parts = raw.split(/Day\s+\d+:/i).filter(p => p.trim().length > 0);
    // If we detect explicit day headings, capture them; otherwise fallback to single block
    if (parts.length > 0) {
      // Re-add the headings by scanning again
      let index = 0;
      raw.replace(dayRegex, (_, d) => {
        const content = parts[index] ? parts[index].trim() : '';
        daySections.push({ day: Number(d), details: content });
        index++;
        return '';
      });
    } else {
      daySections.push({ day: 1, details: tripPlan.trim() });
    }

    res.json({
      tripPlan,
      itinerary: daySections
    });

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: error.message
    })

  }

})

module.exports = router