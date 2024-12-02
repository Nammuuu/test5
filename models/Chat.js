




// models/Chat.js
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  message: { type: String, required: true },
  sender: { type: String, required: true }, // User or Admin ID
  receiver: { type: String }, // The person receiving the message (Admin ID or User ID)
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' }, // Track message status
});

export default mongoose.models.Chat || mongoose.model('Chat', chatSchema);

