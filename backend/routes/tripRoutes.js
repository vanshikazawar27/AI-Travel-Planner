const express = require("express")
const OpenAI = require("openai")

const router = express.Router()

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

if (!process.env.OPENROUTER_API_KEY) {
  console.warn(
    "[backend] Missing OPENROUTER_API_KEY. Trip generation will fail.",
  )
}

router.post("/generate-trip", async (req, res) => {

  try {

    const {
      destination,
      budget,
      days,
      interest
    } = req.body

    const prompt = `
You are an expert travel planner. Generate a detailed ${days}-day travel itinerary for ${destination}, India.

Budget: ₹${budget}
Travel Style: ${interest}

Format each day EXACTLY like this:
Day 1: [Theme for the day]
Morning: [Activity + details]
Afternoon: [Activity + details]
Evening: [Activity + details]
Food: [Restaurant/dish recommendations]
Hotel: [Recommended stay + approx cost]
Estimated Spend: ₹[amount]

Day 2: ...

At the end, add:
TRAVEL TIPS:
- [tip 1]
- [tip 2]
- [tip 3]

Be specific with real place names, real restaurants, real hotels, and accurate cost estimates in Indian Rupees.
`

    // Use a model that is commonly available on OpenRouter.
    // If your account has a different allowed model, change it here.
    const completion = await client.chat.completions.create({
      model: "google/gemma-2-9b-it",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2000,
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
