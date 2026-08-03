"use client";

import { useState } from "react";

const STATUS_OPTIONS = [
  { value: "want-to-read", label: "📖 Want to Read" },
  { value: "reading", label: "📘 Reading" },
  { value: "completed", label: "✅ Completed" },
];

function BookForm({ initialBook, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialBook?.title || "");
  const [author, setAuthor] = useState(initialBook?.author || "");
  const [tags, setTags] = useState((initialBook?.tags || []).join(", "));
  const [status, setStatus] = useState(initialBook?.status || "want-to-read");
  const [coverFile, setCoverFile] = useState(null);
  const [preview, setPreview] = useState(initialBook?.coverImage?.url || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !author.trim()) {
      setError("Title and author are required");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("tags", tags);
      formData.append("status", status);
      if (coverFile) {
        formData.append("coverImage", coverFile);
      }
      await onSubmit(formData);
    } catch (err) {
      console.error("BOOK FORM ERROR:", err);
      console.error("STATUS:", err?.response?.status);
      console.error("DATA:", err?.response?.data);

      setError(
        err?.response?.data?.message || err?.message || "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-ink/10 p-4 sm:p-5 shadow-sm flex flex-col gap-3"
    >
      <h3 className="font-serif font-semibold text-lg">
        {initialBook ? "Edit Book" : "Add a Book"}
      </h3>

      {error && (
        <p className="text-sm bg-red-50 text-red-600 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-24 h-32 rounded-md border border-ink/15 bg-paper overflow-hidden flex items-center justify-center text-3xl">
            {preview ? (
              <img
                src={preview}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
            ) : (
              "📕"
            )}
          </div>
          <label className="text-xs px-2 py-1 rounded-md border border-ink/20 cursor-pointer hover:bg-ink/5 transition">
            {preview ? "Change cover" : "Add cover"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-ink/20 rounded-md px-3 py-2 bg-paper text-sm"
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="border border-ink/20 rounded-md px-3 py-2 bg-paper text-sm"
            />
          </div>

          <input
            type="text"
            placeholder="Tags, comma separated (e.g. fiction, sci-fi)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="border border-ink/20 rounded-md px-3 py-2 bg-paper text-sm"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-ink/20 rounded-md px-3 py-2 bg-paper text-sm w-full sm:w-56"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 mt-1">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-md bg-accent text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {submitting ? "Saving..." : initialBook ? "Save Changes" : "Add Book"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md border border-ink/20 text-sm hover:bg-ink/5 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default BookForm;
