import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    fileName: { type: String, required: true },
    fileType: { type: String, default: 'text/plain' },
    text: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
export default Resume;
