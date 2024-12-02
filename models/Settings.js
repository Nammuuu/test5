

import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  enableCOD: { type: Boolean, default: true },
  enableStripe: { type: Boolean, default: false },
  stripeKey: { type: String },
  stripeSecret: { type: String },
  enableRazorPay: { type: Boolean, default: false },
  razorPayKey: { type: String },  // Check that this field exists
  razorPaySecret: { type: String },

  enablePayPal: { type: Boolean, default: false },  // PayPal integration
  payPalClientId: { type: String }, 
  payPalSecret: { type: String }, 

  fontfamily: {
    type: String, // Font family for the page
   
  },
  
  enableGoogleAnalytics: { type: Boolean, default: false },
  googleAnalyticsKey: { type: String },
  themeColor: { type: String, default: "#ffffff" },
  shopName: { type: String },
  companyName: { type: String },
  address: { type: String },
  postCode: { type: String },
  contact: { type: String },
  email: { type: String },
  website: { type: String },
  font: { type: String, default: "Poppins" },
  contrastLayout: { type: Boolean, default: false },

  // extra 

  // social media 
  // socialmedia : [
  //   {
      facebook: { type: String },
      instagram: {
        type: String, 
      },
      twitter: { type: String },
      youtube: { type: String },
  //   },
  // ],



});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
