import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    jobId: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: 'Remote' },
    platform: { type: String, default: 'ARJ' },
    status: { type: String, default: 'Applied' },
    match: { type: Number, default: 0 },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
export default Application;
