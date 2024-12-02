



import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    content: {
      type: String, // For rich text content (HTML)
      required: true,
    },
    images: [
      {
        type: String, // URL to the image stored
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user/admin creating the blog
      required: true,
    },
    urlSlug: {
      type: String,
      required: true,
      unique: true, // For SEO-friendly URLs
    },
    metaDescription: {
      type: String,
      required: false,
    },
    metaKeywords: {
      type: [String], // For SEO keywords
      required: false,
    },
    published: {
      type: Boolean,
      default: false, // Admin can choose to publish the blog
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically handles createdAt and updatedAt fields
  }
);

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

export default Blog;
