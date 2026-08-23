import mongoose from 'mongoose';

const savedJobSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    jobId: { type: String, required: true },
    title: { type: String, default: '' },
    company: { type: String, default: '' },
    location: { type: String, default: '' },
    salary: { type: String, default: '' },
    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const SavedJob = mongoose.models.SavedJob || mongoose.model('SavedJob', savedJobSchema);
export default SavedJob;
