import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  profilePicture: {
    type: String,
  },
  fullName: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    default: '',
  },

  savedShippingAddresses: [{
    address: String,
    address2: String,
    phoneNo: String,
    city: String,
    state: String,
    landmark: String,
    country: String,
    pinCode: String,
  }],

  deletedAccountRequest: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

export default mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema);
