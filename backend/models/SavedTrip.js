const mongoose = require('mongoose');

const SavedTripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: String, required: true, trim: true },
    budget: { type: Number, required: true },
    days: { type: Number, required: true },
    interest: { type: String, required: true, trim: true },
    formData: { type: Object, required: true },
    tripPlan: { type: Object, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('SavedTrip', SavedTripSchema);
