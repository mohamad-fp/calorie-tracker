"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // If user doesn't exist, sign them up
      if (error.message.includes("Invalid login")) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }
      } else {
        setError(error.message);
        setLoading(false);
        return;
      }
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-[380px] space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-lime-accent">
            Road to 185lbs
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Calorie and Weight Tracker
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl bg-surface-card border border-border-subtle px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-lime-accent transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl bg-surface-card border border-border-subtle px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-lime-accent transition-colors"
          />

          {error && (
            <p className="text-danger text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-lime-accent text-surface font-bold py-3 text-base min-h-[48px] disabled:opacity-50 active:scale-[0.98] transition-transform"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
