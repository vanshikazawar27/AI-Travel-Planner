const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function testTinyModel() {
  const prompt = "Hello, reply in exactly one word.";
  console.log("Testing meta-llama/llama-3.2-3b-instruct:free...");
  try {
    const completion = await client.chat.completions.create({
      model: "meta-llama/llama-3.2-3b-instruct:free",
      messages: [{ role: "user", content: prompt }]
    });
    console.log("Success! Response:", completion.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testTinyModel();
