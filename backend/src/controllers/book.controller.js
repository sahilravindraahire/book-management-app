import { Book } from "../models/book.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const VALID_STATUSES = ["want-to-read", "reading", "completed"];

export const createBook = asyncHandler(async (req, res) => {
  const { title, author, tags, status } = req.body;

  if (!title?.trim() || !author?.trim()) {
    throw new apiError(400, "Title and author are required");
  }

  if (status && !VALID_STATUSES.includes(status)) {
    throw new apiError(400, "Invalid status value");
  }

  const normalizedTags = Array.isArray(tags)
    ? tags.map((t) => t.trim()).filter(Boolean)
    : (tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

  let coverImage;

  if (req.file?.path) {
    const uploaded = await uploadOnCloudinary(req.file.path);

    if (!uploaded) {
      throw new apiError(500, "Cover image upload failed, please try again");
    }

    coverImage = { url: uploaded.secure_url, public_id: uploaded.public_id };
  }

  const book = await Book.create({
    title,
    author,
    tags: normalizedTags,
    status: status || "want-to-read",
    ...(coverImage ? { coverImage } : {}),
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new apiResponse(201, book, "Book added to your collection"));
});

export const getBooks = asyncHandler(async (req, res) => {
  const { tag, status } = req.query;

  const filter = { owner: req.user._id };

  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      throw new apiError(400, "Invalid status filter");
    }
    filter.status = status;
  }

  if (tag) {
    filter.tags = tag;
  }

  const books = await Book.find(filter).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new apiResponse(200, books, "Books fetched successfully"));
});

export const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findOne({
    _id: req.params.bookId,
    owner: req.user._id,
  });

  if (!book) {
    throw new apiError(404, "Book not found");
  }

  return res.status(200).json(new apiResponse(200, book, "Book fetched"));
});

export const updateBook = asyncHandler(async (req, res) => {
  const { title, author, tags, status } = req.body;

  if (status && !VALID_STATUSES.includes(status)) {
    throw new apiError(400, "Invalid status value");
  }

  const existingBook = await Book.findOne({
    _id: req.params.bookId,
    owner: req.user._id,
  });

  if (!existingBook) {
    throw new apiError(404, "Book not found");
  }

  const updates = {};

  if (title !== undefined) updates.title = title;
  if (author !== undefined) updates.author = author;
  if (status !== undefined) updates.status = status;
  if (tags !== undefined) {
    updates.tags = Array.isArray(tags)
      ? tags.map((t) => t.trim()).filter(Boolean)
      : tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
  }

  if(req.file?.path){
    const uploaded = await uploadOnCloudinary(req.file.path)

    if(!uploaded){
        throw new apiError(500, "Cover image upload failed, please try again")
    }

    if(existingBook.coverImage?.public_id){
        await deleteFromCloudinary(existingBook.coverImage.public_id)
    }

    updates.coverImage = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id
    }
  }

  const book = await Book.findOneAndUpdate(
    {_id: req.params.bookId, owner: req.user._id},
    {$set: updates},
    {new: true, runValidators: true}
  )

  return res
  .status(200)
  .json(new apiResponse(200, book, "Book updated successfully"))
});


export const updateBookStatus = asyncHandler(async(req, res) => {
    const {status} = req.body

    if(!status || !VALID_STATUSES.includes(status)){
        throw new apiError(400, "A valid status is required")
    }

    const book = await Book.findOneAndUpdate(
        {_id: req.params.bookId, owner: req.user._id},
        {$set: {status}},
        {new: true}
    )

    if(!book){
        throw new apiError(404, "Book not found")
    }

    return res
    .status(200)
    .json(new apiResponse(200, book, "Book status updated"))
})

export const deleteBook = asyncHandler(async(req, res) => {
    const book = await Book.findOneAndDelete({
        _id: req.params.bookId,
        owner: req.user._id
    })

    if(!book){
        throw new apiError(404, "Book not found")
    }

    if(book.coverImage?.public_id){
        await deleteFromCloudinary(book.coverImage.public_id)
    }

    return res
    .status(200)
    .json(new apiResponse(200, {}, "Book removed from your collection"))
})

export const getDashboardStats = asyncHandler(async(req, res) => {
    const stats = await Book.aggregate([
        {$match: {owner: req.user._id}},
        {$group: {_id: "$status", count: {$sum: 1}}}
    ])

    const counts = {
        "want-to-read": 0,
        reading: 0,
        completed: 0,
    }

    stats.forEach((s) => {
        counts[s._id] = s.count
    })

    const total = counts["want-to-read"] + counts["reading"] + counts["completed"]

    return res
    .status(200)
    .json(new apiResponse(
        200,
        {
            total,
            counts
        },
        "Dashboard stats fetched"
    ))
})