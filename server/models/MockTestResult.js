import mongoose from 'mongoose';

const mockTestResultSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    category: { type: String, required: true },
    type: { type: String, default: 'Mixed' }, // 'MCQ' or 'Written'
    score: { type: Number, required: true },
    answers: { type: mongoose.Schema.Types.Mixed, default: {} },
    feedback: { type: mongoose.Schema.Types.Mixed, default: [] },
  },
  { timestamps: true }
);

export const MockTestResult = mongoose.models.MockTestResult || mongoose.model('MockTestResult', mockTestResultSchema);
export default MockTestResult;
