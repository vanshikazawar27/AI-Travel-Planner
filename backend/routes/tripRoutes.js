const express = require("express")
const OpenAI = require("openai")

const router = express.Router()

const client = new OpenAI({

  apiKey: process.env.OPENROUTER_API_KEY,

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

    const tripPlan =
      completion.choices[0].message.content

    res.json({
      tripPlan
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: error.message
    })

  }

})

module.exports = router