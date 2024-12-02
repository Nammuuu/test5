
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: String,
  name: { type: String, required: true },
  description: { type: String },
  seles: {type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  media: [{ type: String }], // Changed from productImages to media
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    required: true,
  },
  categoryName: { type: String }, 
  createdAt: { type: Date, default: Date.now },
  tags: [String],
  sizes: [String], 
  colors: [String],
  materials: [String],

  // New fields for tracking performance
  viewsCount: { type: Number, default: 0 }, // Number of views
  salesCount: { type: Number, default: 0 }, // Number of sales

  // New fields for reviews and ratings
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1 and 5
    comment: { type: String },
    profilePictureImagePreview: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 }, // To store the average rating
  
  // New fields for recommendations
displayOptions: {
  type: String,
  enum: ['recommended', 'allproducts', 'latest', 'future', 'toprating'],
  default: 'recommended'
},
 

discountPrice: { type: Number, default: 0 },

// New field for coupons
coupons: [{ 
  code: { type: String }, 
  discount: { type: Number, default: 0 }, // Discount amount or percentage
  validUntil: { type: Date } // Coupon expiry date
}]


});

// Create a text index on specified fields
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });


// Function to update views count
ProductSchema.methods.incrementViews = function () {
  this.viewsCount += 1;
  return this.save();
};

// Function to update sales count
ProductSchema.methods.incrementSales = function () {
  this.salesCount += 1;
  return this.save();
};

// Calculate average rating based on reviews
ProductSchema.methods.calculateAverageRating = function () {
  const totalRatings = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  const numReviews = this.reviews.length;
  this.averageRating = numReviews ? totalRatings / numReviews : 0;
  return this.save();
};


export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
