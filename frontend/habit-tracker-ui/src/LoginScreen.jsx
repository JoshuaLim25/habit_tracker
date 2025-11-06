import React, { useState } from "react";
import { motion } from "framer-motion";

// Login screen with Framer Motion animations (JS-only)
// - Tailwind styling
// - Client-side validation
// - Mock login (swap for real API call later)

export default function LoginScreen({ onSwitchToSignup, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function isValidEmail(v) {
    // simple email check without regex
    if (!v) return false;
    const at = v.indexOf("@");
    if (at <= 0) return false;
    const dot = v.indexOf(".", at + 2);
    if (dot <= at + 2) return false;
    if (dot === v.length - 1) return false;
    return true;
  }

  function validate() {
    if (!email.trim()) return "Email is required";
    if (!isValidEmail(email)) return "Enter a valid email";
    if (!password.trim()) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  }

  async function realLogin({ email, password }) {
  const res = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error("Invalid email or password");
  return await res.json();
}


  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const result = await realLogin({ email, password });
      setSuccess("Logged in! Redirecting…");
      if (remember) localStorage.setItem("habit_auth", JSON.stringify(result));
      else sessionStorage.setItem("habit_auth", JSON.stringify(result));
      // navigate to dashboard
      if (onLogin) onLogin(result);
    } catch (err) {
      setError((err && err.message) || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
          className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8"
        >
          <header className="mb-6">
            <motion.h1
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-2xl font-semibold tracking-tight text-slate-900"
            >
              Sign in
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-slate-600 mt-1"
            >
              Welcome back. Enter your email and password to continue.
            </motion.p>
          </header>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 focus:border-slate-500 focus:ring-slate-500/30 px-3 py-2 outline-none"
                placeholder="you@example.com"
                aria-invalid={!!error && !isValidEmail(email)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-xs text-slate-600 hover:text-slate-900 underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 focus:border-slate-500 focus:ring-slate-500/30 px-3 py-2 outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-slate-700 focus:ring-slate-500/30"
                />
                Remember me
              </label>
              <button 
                type="button"
                className="text-sm text-slate-600 hover:text-slate-900 underline" 
                onClick={() => alert("Forgot password flow coming soon!")}> 
                Forgot password?
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-2"
                role="alert"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-2"
                role="status"
              >
                {success}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-2xl px-4 py-2.5 font-medium shadow-sm bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign in"}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-6 text-center text-sm text-slate-600"
          >
            Don’t have an account? <button type="button" onClick={onSwitchToSignup} className="underline hover:text-slate-900">Create one</button>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-slate-500 mt-4 text-center"
        >
          Demo credentials: jdoe@example.com / password123 · asmith@example.com / letmein
        </motion.p>
      </motion.div>
    </div>
  );
}