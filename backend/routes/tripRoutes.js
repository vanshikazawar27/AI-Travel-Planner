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

Return only plain text in the following format:
Day 1: <short day summary and food + hotel recommendations>
Day 2: <short day summary and food + hotel recommendations>
Day 3: <short day summary and food + hotel recommendations>

- Do not include any repeated summaries or rewritten versions.
- Do not include additional explanation after the final day.
- Keep each day concise and avoid long multi-paragraph prose.
- Use simple sentences and bullet-style items if needed.
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
    const normalizedPlan = rawPlan
      .replace(/\*\*/g, "")
      .replace(/^\s*\*\s*/gm, "* ")
      .replace(/\n{2,}/g, "\n")
      .trim();

    const tripPlan = normalizedPlan
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line, index, arr) => line.length > 0 || (index > 0 && line !== arr[index - 1]))
      .join("\n")

    const isMetadataHeading = (line) => {
      return /^(?:[\*\-•]\s*)?\s*(?:hotels?|hotel suggestions?|accommodation|stay|lodging|food recommendations?|food recommendation|dining|restaurant|meal|travel tips?|tips|estimated expenses?|estimated expense|budget breakdown|total estimated expenses?|costs?|expenses?|budget):?/i.test(line)
    }

    const extractContentAndMetadata = (text) => {
      const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      const contentLines = []
      const metadataLines = []
      let collectingMetadata = false

      for (const line of lines) {
        if (!collectingMetadata && isMetadataHeading(line)) {
          collectingMetadata = true
        }

        if (collectingMetadata) {
          metadataLines.push(line)
        } else {
          contentLines.push(line)
        }
      }

      return {
        content: contentLines.join("\n").trim(),
        metadata: metadataLines.join("\n").trim(),
      }
    }

    const daySections = [];
    const dayBlockRegex = /(?:^|\n)[\s\*\-]*Day\s+(\d+):([\s\S]*?)(?=(?:\n[\s\*\-]*Day\s+\d+:)|$)/gi;
    let match;

    while ((match = dayBlockRegex.exec(tripPlan)) !== null) {
      const dayNumber = Number(match[1]);
      const rawContent = match[2].trim().replace(/^[\s\*\-:]*/g, "");
      const { content, metadata } = extractContentAndMetadata(rawContent)
      daySections.push({ day: dayNumber, content, metadata });
    }

    if (daySections.length === 0) {
      daySections.push({ day: 1, content: tripPlan.trim(), metadata: "" });
    }

    const uniqueSections = Array.from(
      daySections.reduce((map, section) => {
        if (!map.has(section.day)) {
          map.set(section.day, section);
        }
        return map;
      }, new Map()).values()
    ).sort((a, b) => a.day - b.day);

    const introSignals = [
      /given your interest/i,
      /land of/i,
      /travel itinerary/i,
      /curated a/i,
      /get ready/i,
      /best culinary/i,
      /welcome to/i,
      /within a budget/i
    ];

    const isIntro = (text) => {
      const normalized = text.toLowerCase();
      const introCount = introSignals.reduce(
        (count, regex) => count + (regex.test(normalized) ? 1 : 0),
        0
      );
      return introCount > 0 && text.split(/\n/).length < 5;
    };

    let destinationIntro = null;
    let finalSections = uniqueSections;

    if (uniqueSections.length > 1 && isIntro(uniqueSections[0].content)) {
      destinationIntro = uniqueSections[0].content;
      finalSections = uniqueSections.slice(1).map((section, index) => ({
        ...section,
        day: index + 1,
      }));
    }

    const metadata = finalSections
      .map((section) => section.metadata || "")
      .filter(Boolean)
      .join("\n")
      .trim();

    res.json({
      tripPlan,
      raw: tripPlan,
      itinerary: finalSections,
      destinationIntro,
      metadata,
    });

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: error.message
    })

  }

})

module.exports = router