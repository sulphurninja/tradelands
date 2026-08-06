import { Schema, models, model } from "mongoose";

const BlogSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: String,
    body: String,
    coverImage: String,
    category: String,
    author: String,
    publishedAt: String,
    readTime: String,
  },
  { timestamps: true }
);

export const Blog = models.Blog || model("Blog", BlogSchema);
