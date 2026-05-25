const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const connectDB = require('./config/db.js');
const tripRoutes = require('./routes/tripRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const groupRoutes = require('./routes/groupRoutes.js');
const expenseRoutes = require('./routes/expenseRoutes.js');
const dashboardRoutes = require('./routes/dashboardRoutes.js');

// Log env variable for debugging
console.log('MONGODB_URI from server:', process.env.MONGODB_URI);

const app = express();

app.use(cors());
app.use(express.json());

// Health Route
app.get("/", (req, res) => {
  res.send("AI Travel Planner Backend Running");
});

// Routes
app.use("/api/trip", tripRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/groups", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start:", err.message);
    process.exit(1);
  }
};

startServer();