import mongoose from 'mongoose';

const atsReportSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    resumeId: { type: String, required: true },
    score: { type: Number, required: true },
    rawScore: { type: Number },
    scoreNote: { type: String },
    confidence: { type: String },
    scoringModel: { type: String },
    sections: { type: Map, of: Number },
    weakSections: { type: [String], default: [] },
    missingKeywords: { type: [String], default: [] },
    matchedKeywords: { type: [String], default: [] },
    formattingIssues: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const AtsReport = mongoose.models.AtsReport || mongoose.model('AtsReport', atsReportSchema);
export default AtsReport;
