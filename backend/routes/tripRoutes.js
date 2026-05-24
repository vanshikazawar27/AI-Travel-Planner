const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Lazy client init so auth/group/expense features can run even if trip keys are missing.
let client = null;
function getClient() {
  if (client) return client;
  const apiKey = process.env.GOOGLE_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  client = new GoogleGenerativeAI(apiKey);
  return client;
}

router.post('/generate-trip', async (req, res) => {
  try {
    const genAI = getClient();
    if (!genAI) {
      return res.status(500).json({
        error:
          'Missing API credentials. Set GOOGLE_API_KEY in backend/.env',
      });
    }

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

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const tripPlan = result.response.text();

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
