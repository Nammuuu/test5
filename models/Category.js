import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  categoryImage: {
    type: String, // Use this field to store the image URL
    required: true, 
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export default Category;
