import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginScreen from "./LoginScreen";
import SignupScreen from "./SignupScreen";
import Dashboard from "./Dashboard";

function AppRoutes() {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = sessionStorage.getItem("habit_auth") || localStorage.getItem("habit_auth");
    if (raw) {
      try { setAuth(JSON.parse(raw)); } catch {}
    }
  }, []);

  function handleLogin(result) {
    setAuth(result);
    sessionStorage.setItem("habit_auth", JSON.stringify(result));
    navigate("/dashboard");
  }
  function handleLogout() {
    setAuth(null);
    sessionStorage.removeItem("habit_auth");
    localStorage.removeItem("habit_auth");
    navigate("/login");
  }

  return (
    <Routes>
      <Route path="/login" element={
        <LoginScreen
          onSwitchToSignup={() => navigate("/signup")}
          onLogin={handleLogin}
        />
      } />
      <Route path="/signup" element={
        <SignupScreen onSwitchToLogin={() => navigate("/login")} />
      } />
      <Route path="/dashboard" element={
        auth?.user ? <Dashboard auth={auth} onLogout={handleLogout} /> : <Navigate to="/login" />
      } />
      <Route path="*" element={<Navigate to={auth?.user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}