import mongoose from 'mongoose';

const streakSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    current: { type: Number, default: 0 },
    best: { type: Number, default: 0 },
    lastDate: { type: String, default: null },
  },
  { timestamps: true }
);

export const Streak = mongoose.models.Streak || mongoose.model('Streak', streakSchema);
export default Streak;
