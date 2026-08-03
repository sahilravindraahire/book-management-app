"use client";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "want-to-read", label: "📖 Want to Read" },
  { value: "reading", label: "📘 Reading" },
  { value: "completed", label: "✅ Completed" },
];

function BookFilters({ status, setStatus, tag, setTag, allTags }) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border border-ink/20 rounded-md px-3 py-2 bg-white text-sm"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="border border-ink/20 rounded-md px-3 py-2 bg-white text-sm"
      >
        <option value="">All tags</option>
        {allTags.map((t) => (
          <option key={t} value={t}>
            #{t}
          </option>
        ))}
      </select>

      {(status || tag) && (
        <button
          onClick={() => {
            setStatus("");
            setTag("");
          }}
          className="text-sm px-3 py-2 text-ink/60 hover:text-ink underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

export default BookFilters;
