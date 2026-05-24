const express = require('express');
const cors = require('cors');
require('dotenv').config();

const tripRoutes = require('./routes/tripRoutes');

const { connectDB } = require('./db/connect');

const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Health
app.get('/', (req, res) => {
  res.send('AI Travel Planner Backend Running');
});

// Trip generation (existing)
app.use('/api/trip', tripRoutes);

// Auth + app
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/groups', expenseRoutes); // expenses nested under groups
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[backend] Failed to start:', err.message);
    process.exit(1);
  });

