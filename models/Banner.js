




const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  images: {
    type: String, // Use this field to store the image URL
    required: true,
   },
  productUrl: {
    type: String, // URL to the product page
   
  },
  title: {
    type: String, // Banner title
    required: true
  },
  heading: {
    type: String, // Banner heading
    
  },
  description: {
    type: String, // Small description of the banner
   
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},

{
  timestamps: true, // Automatically handles createdAt and updatedAt fields
}

);


export default mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
