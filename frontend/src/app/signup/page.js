"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

function SignupPage() {
    const { signup } = useAuth();
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup({ name, email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-xl border border-ink/10 shadow-sm p-6 sm:p-8 flex flex-col gap-4"
      >
        <h1 className="font-serif text-2xl font-bold text-center">Create your account</h1>

        {error && (
          <p className="text-sm bg-red-50 text-red-600 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm text-ink/70">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-ink/20 rounded-md px-3 py-2 bg-paper text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-ink/70">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-ink/20 rounded-md px-3 py-2 bg-paper text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-ink/70">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-ink/20 rounded-md px-3 py-2 bg-paper text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-4 py-2.5 rounded-md bg-accent text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="text-sm text-center text-ink/60">
          Already have an account?{" "}
          <Link href="/login" className="text-accent font-medium">
            Log in
          </Link>
        </p>
      </form>
    </main>
  )
}

export default SignupPage
