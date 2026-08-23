import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    type: { type: String, default: 'info' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    actionUrl: { type: String, default: '' },
    icon: { type: String, default: '🔔' },
    priority: { type: String, default: 'medium' },
    unread: { type: Boolean, default: true },
    timestamp: { type: String },
  },
  { timestamps: true }
);

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
