"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };
  return (
    <nav className="border-b border-ink/10 bg-paper/95 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="font-serif text-xl font-bold tracking-tight"
        >
          📚 Book Manager
        </Link>
        {user && (
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden sm:inline text-sm text-ink/60">
              Hi, {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1.5 rounded-md border border-ink/20 hover:bg-ink hover:text-paper transition"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
