const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function testDirectItinerary() {
  const prompt = `
Generate a detailed 3-day travel itinerary for Goa.
Budget: ₹20000
Interest: Beach

Include:
- day-wise plans
- places to visit
- food suggestions
- hotel recommendations
- estimated expenses
- travel tips
`;

  console.log("Sending request to openrouter/free...");
  try {
    const completion = await client.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });
    console.log("Success! Response length:", completion.choices[0].message.content.length);
    console.log("Response preview:\n", completion.choices[0].message.content.substring(0, 500));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testDirectItinerary();
