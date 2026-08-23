import mongoose from 'mongoose';

const resumeTemplateSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, default: 'Professional' },
    atsScore: { type: Number, default: 90 },
    accent: { type: String, default: '#2563eb' },
    desc: { type: String, default: '' },
    sections: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.ResumeTemplate || mongoose.model('ResumeTemplate', resumeTemplateSchema);
