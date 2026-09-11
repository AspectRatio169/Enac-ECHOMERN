import { createContext, useEffect, useState } from "react";

// AuthContext is defined here and consumed via useAuth.js
export const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

// ── helper: make an authenticated call ────────────────────────────────────────
async function authFetch(method, path, body = null) {
  const token = localStorage.getItem("echo_jwt");
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Server error.");
  return data.data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // ─────────────────────────────────
  // CHECK EXISTING SESSION
  // ─────────────────────────────────
  async function checkAuth() {
    const token = localStorage.getItem("echo_jwt");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const userData = await authFetch("GET", "/api/auth/me");
      setUser(userData);
      setProfile(userData);
    } catch {
      // Token invalid/expired — clear it
      localStorage.removeItem("echo_jwt");
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  // ─────────────────────────────────
  // REGISTER (email + password)
  // ─────────────────────────────────
  async function register(name, email, password) {
    const data = await authFetch("POST", "/api/auth/register", {
      name,
      email,
      password,
    });
    localStorage.setItem("echo_jwt", data.token);
    setUser(data.user);
    setProfile(data.user);
  }

  // ─────────────────────────────────
  // LOGIN — PASSWORD
  // ─────────────────────────────────
  async function loginPassword(email, password) {
    const data = await authFetch("POST", "/api/auth/login/password", {
      email,
      password,
    });
    localStorage.setItem("echo_jwt", data.token);
    setUser(data.user);
    setProfile(data.user);
  }

  // ─────────────────────────────────
  // LOGIN — REQUEST OTP
  // ─────────────────────────────────
  async function requestOTP(email) {
    await authFetch("POST", "/api/auth/login/otp/request", { email });
  }

  // ─────────────────────────────────
  // LOGIN — VERIFY OTP
  // ─────────────────────────────────
  async function verifyOTP(email, code) {
    const data = await authFetch("POST", "/api/auth/login/otp/verify", {
      email,
      code,
    });
    localStorage.setItem("echo_jwt", data.token);
    setUser(data.user);
    setProfile(data.user);
  }

  // ─────────────────────────────────
  // LOGIN — GOOGLE
  // ─────────────────────────────────
  async function loginGoogle(credential) {
    const data = await authFetch("POST", "/api/auth/google", { credential });
    localStorage.setItem("echo_jwt", data.token);
    setUser(data.user);
    setProfile(data.user);
  }

  // ─────────────────────────────────
  // SET PASSWORD (from Settings)
  // ─────────────────────────────────
  async function setPassword(password) {
    await authFetch("POST", "/api/auth/set-password", { password });
  }

  // ─────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────
  function logout() {
    localStorage.removeItem("echo_jwt");
    setUser(null);
    setProfile(null);
  }

  // ─────────────────────────────────
  // REFRESH PROFILE
  // ─────────────────────────────────
  async function refreshProfile() {
    try {
      const userData = await authFetch("GET", "/api/auth/me");
      setUser(userData);
      setProfile(userData);
    } catch {
      // silently fail
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        register,
        loginPassword,
        loginGoogle,
        requestOTP,
        verifyOTP,
        setPassword,
        logout,
        refreshProfile,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
