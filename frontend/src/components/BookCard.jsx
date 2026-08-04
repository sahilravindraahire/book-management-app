"use client";

const STATUS_META = {
  "want-to-read": {
    label: "Want to Read",
    emoji: "📖",
    color: "bg-amber-100 text-amber-800",
  },
  reading: {
    label: "Reading",
    emoji: "📘",
    color: "bg-blue-100 text-blue-800",
  },
  completed: {
    label: "Completed",
    emoji: "✅",
    color: "bg-emerald-100 text-emerald-800",
  },
};

function BookCard({ book, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="group bg-white rounded-2xl border border-ink/10 p-4 shadow-sm hover:shadow-xl hover:shadow-ink/10 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {book.coverImage?.url && (
            <img
              src={book.coverImage.url}
              alt={`${book.title} cover`}
              className="w-12 h-16 object-cover rounded-md border border-ink/10 flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow"
            />
          )}
          <div>
            <h3 className="font-serif font-semibold text-lg leading-snug">
              {book.title}
            </h3>
            <p className="text-sm text-ink/60">by {book.author}</p>
          </div>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-medium shadow-sm ${STATUS_META[book.status].color}`}
        >
          {STATUS_META[book.status].emoji} {STATUS_META[book.status].label}
        </span>
      </div>

      {book.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {book.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-ink/5 text-ink/70 border border-ink/5 hover:bg-ink/10 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mt-1">
        <select
          value={book.status}
          onChange={(e) => onStatusChange(book._id, e.target.value)}
          className="text-sm border border-ink/20 rounded-md px-2 py-1 bg-paper"
        >
          {Object.entries(STATUS_META).map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.emoji} {meta.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => onEdit(book)}
          className="text-sm px-3 py-1 rounded-md border border-ink/20 hover:bg-ink hover:text-paper transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(book._id)}
          className="text-sm px-3 py-1 rounded-md border border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default BookCard;
