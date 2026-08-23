import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    company: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, default: 'Remote' },
    salary: { type: String, default: '$100k - $140k' },
    match: { type: Number, default: 85 },
    posted: { type: String, default: 'Recently' },
    skillsMatched: [{ type: String }],
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model('Job', jobSchema);
