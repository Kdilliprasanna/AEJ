import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    round: { type: String, default: 'General' },
    category: { type: String, default: 'Technical' },
    question: { type: String, required: true },
    options: [{ type: String }],
    answer: { type: String, required: true },
    explanation: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Question || mongoose.model('Question', questionSchema);
