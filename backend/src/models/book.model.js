import mongoose, { Schema } from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["want-to-read", "reading", "completed"],
      default: "want-to-read",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    coverImage: {
      url: { type: String },
      public_id: { type: String },
    },
  },
  { timestamps: true },
);

bookSchema.index({owner: 1, status: 1})
bookSchema.index({owner: 1, tags: 1})

export const Book = mongoose.model("Book", bookSchema)