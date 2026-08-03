"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useMemo, useState, useCallback } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import BookCard from "@/components/BookCard";
import BookForm from "@/components/BookForm";
import BookFilters from "@/components/BookFilters";

function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    counts: { "want-to-read": 0, reading: 0, completed: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [status, setStatus] = useState("");
  const [tag, setTag] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  const fetchStats = useCallback(async () => {
    const res = await api.get("/books/dashboard/stats");
    setStats(res.data.data);
  }, []);

  const fetchBooks = useCallback(async () => {
    const params = {};
    if (status) params.status = status;
    if (tag) params.tag = tag;
    const res = await api.get("/books", { params });

    console.log("BOOKS API RESPONSE:", res.data);
    console.log("BOOKS DATA:", res.data.data);
    setBooks(res.data.data);
  }, [status, tag]);

  useEffect(() => {
    if (authLoading || !user) return;

    setLoading(true);

    Promise.all([fetchBooks(), fetchStats()]).finally(() => setLoading(false));
  }, [authLoading, user, fetchBooks, fetchStats]);

  const allTags = useMemo(() => {
    const set = new Set();
    books.forEach((b) => b.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [books]);

  if (authLoading) {
    return <p>Checking authentication...</p>;
  }

  if (!user) {
    return <p>Redirecting to login...</p>;
  }

  const handleCreate = async (formData) => {
    await api.post("/books", formData);
    setShowForm(false);
    await Promise.all([fetchBooks(), fetchStats()]);
  };

  const handleUpdate = async (formData) => {
    if (!editingBook?._id) {
      console.error("No book selected for editing");
      return;
    }

    await api.patch(`/books/${editingBook._id}`, formData);

    setEditingBook(null);

    await Promise.all([fetchBooks(), fetchStats()]);
  };

  const handleDelete = async (bookId) => {
    if (!confirm("Remove this book from your collection?")) return;
    await api.delete(`/books/${bookId}`);
    await Promise.all([fetchBooks(), fetchStats()]);
  };

  const handleStatusChange = async (bookId, newStatus) => {
    await api.patch(`/books/${bookId}/status`, { status: newStatus });
    await Promise.all([fetchBooks(), fetchStats()]);
  };
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatsCard label="Total Books" value={stats.total} emoji="📚" />
          <StatsCard
            label="Want to Read"
            value={stats.counts["want-to-read"]}
            emoji="📖"
          />
          <StatsCard label="Reading" value={stats.counts.reading} emoji="📘" />
          <StatsCard
            label="Completed"
            value={stats.counts.completed}
            emoji="✅"
          />
        </section>

        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <BookFilters
            status={status}
            setStatus={setStatus}
            tag={tag}
            setTag={setTag}
            allTags={allTags}
          />
          {!showForm && !editingBook && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 rounded-md bg-accent text-white text-sm font-medium hover:opacity-90 transition"
            >
              + Add Book
            </button>
          )}
        </section>

        {showForm && (
          <BookForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        )}

        {editingBook && (
          <BookForm
            initialBook={editingBook}
            onSubmit={handleUpdate}
            onCancel={() => setEditingBook(null)}
          />
        )}

        <section>
          {loading ? (
            <p className="text-ink/50 text-sm">Loading your collection...</p>
          ) : books.length === 0 ? (
            <div className="text-center py-16 text-ink/50">
              <p className="text-3xl mb-2">🗒️</p>
              <p>No books match these filters yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onEdit={setEditingBook}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default DashboardPage;
