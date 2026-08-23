import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    role: { type: String, enum: ['user', 'ai'], required: true },
    text: { type: String, required: true },
    createdAt: { type: String },
  },
  { timestamps: true }
);

export const ChatMessage = mongoose.models.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;
