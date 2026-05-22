const express = require("express")
const cors = require("cors")
require("dotenv").config()

const tripRoutes = require("./routes/tripRoutes")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/trip", tripRoutes)

app.get("/", (req, res) => {
  res.send("AI Travel Planner Backend Running")
})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})