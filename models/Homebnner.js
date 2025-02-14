


const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  images: {
    type: String, // Use this field to store the image URL
    required: true,
   },
  productUrl: {
    type: String, // URL to the product page
   
  },

  displayOptions: {
    type: String,
    enum: ['Baner1', 'Baner2', 'Baner1', 'Baner4', 'Baner5'],
    default: 'Baner1'
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


export default mongoose.models.Banner || mongoose.model('Homebanner', bannerSchema);
