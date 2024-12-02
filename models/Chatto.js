



import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  message: { type: String, required: true },
  sender: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Chat || mongoose.model('Chat', chatSchema);
