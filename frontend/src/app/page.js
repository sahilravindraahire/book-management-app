import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 -left-24 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-24 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl" />

      <div className="max-w-md w-full text-center relative animate-fadeUp">
        <p className="text-6xl mb-4 drop-shadow-sm">📚</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
          Personal Book Manager
        </h1>
        <p className="text-ink/60 mb-10 text-lg leading-relaxed">
          Track what you want to read, what you're reading, and what you've
          finished — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg bg-accent text-white text-sm font-semibold shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 rounded-lg border-2 border-ink/15 text-sm font-semibold hover:bg-white hover:border-ink/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}

