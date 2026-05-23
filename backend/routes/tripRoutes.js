const express = require("express")
const OpenAI = require("openai")

const router = express.Router()

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
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
- day-wise plans
- places to visit
- food suggestions
- hotel recommendations
- estimated expenses
- travel tips
`

    const completion = await client.chat.completions.create({
      model: "openrouter/free",
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