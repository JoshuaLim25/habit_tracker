import React, { useState } from "react";
import { motion } from "framer-motion";

export default function SignupScreen({ onSwitchToLogin }) {
  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  const [username, setUsername]     = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [success, setSuccess]       = useState(null);

  function isValidEmail(v) {
    return /[^@\s]+@[^@\s]+\.[^@\s]+/.test(v);
  }

  function validate() {
    if (!firstName.trim()) return "First name is required";
    if (!lastName.trim())  return "Last name is required";
    if (!username.trim())  return "Username is required";
    if (!email.trim())     return "Email is required";
    if (!isValidEmail(email)) return "Enter a valid email";
    if (!password.trim())  return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  }

  async function signupRequest(payload) {
    const res = await fetch("http://127.0.0.1:5000/api/signup", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Signup failed");
    }
    return res.json();
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const v = validate();
    if (v) { setError(v); return; }

    setLoading(true);
    try {
      await signupRequest({
        first_name: firstName.trim(),
        last_name:  lastName.trim(),
        username:   username.trim(),
        email:      email.trim(),
        password:   password,
      });
      setSuccess("Account created! You can sign in now.");
      // Optional: auto-switch to login after 1s
      setTimeout(() => onSwitchToLogin && onSwitchToLogin(), 1000);
    } catch (err) {
      setError(err.message || "Signup failed");
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
              Create account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-slate-600 mt-1"
            >
              Fill in your details to get started.
            </motion.p>
          </header>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">First name</label>
                <input
                  value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 focus:border-slate-500 focus:ring-slate-500/30 px-3 py-2 outline-none"
                  placeholder="Jurgen"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Last name</label>
                <input
                  value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 focus:border-slate-500 focus:ring-slate-500/30 px-3 py-2 outline-none"
                  placeholder="Baeza"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Username</label>
              <input
                value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-300 focus:border-slate-500 focus:ring-slate-500/30 px-3 py-2 outline-none"
                placeholder="jdoe"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 focus:border-slate-500 focus:ring-slate-500/30 px-3 py-2 outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 focus:border-slate-500 focus:ring-slate-500/30 px-3 py-2 outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
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
              {loading ? "Creating account…" : "Sign up"}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-6 text-center text-sm text-slate-600"
          >
            Already have an account?{" "}
            <button onClick={onSwitchToLogin} className="underline hover:text-slate-900">Sign in</button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}