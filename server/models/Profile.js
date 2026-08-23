import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    educationField: { type: String, default: '' },
    degree: { type: String, default: '' },
    percentage: { type: String, default: '' },
    skills: { type: [String], default: [] },
    preferredJobType: { type: String, default: '' },
    locations: { type: [String], default: [] },
    targetRole: { type: String, default: '' },
    summary: { type: String, default: '' },
    yearsOfExperience: { type: Number, default: 0 },
    links: {
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
export default Profile;
