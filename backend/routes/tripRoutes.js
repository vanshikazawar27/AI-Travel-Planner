const express = require("express")

const router = express.Router()

const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
)

router.post("/generate-trip", async (req, res) => {

  try {

    const {
      destination,
      budget,
      days,
      interest
    } = req.body

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite"
    })

    const prompt = `
      Generate a ${days}-day travel itinerary for ${destination}
      with a budget of ₹${budget}.

      Trip interest: ${interest}

      Include:
      - day-wise plans
      - places to visit
      - food suggestions
      - hotel suggestions
      - estimated budget
    `

    const result = await model.generateContent(prompt)

    const response = result.response.text()

    res.json({
      tripPlan: response
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: error.message
    })

  }

})

module.exports = router