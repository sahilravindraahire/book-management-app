
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <p className="text-5xl mb-4">📚</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">
          Personal Book Manager
        </h1>
        <p className="text-ink/60 mb-8">
          Track what you want to read, what you're reading, and what you've
          finished — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-md bg-accent text-white text-sm font-medium hover:opacity-90 transition"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-md border border-ink/20 text-sm font-medium hover:bg-ink/5 transition"
          >
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}
