import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  Mail,
  Lock,
  Hash,
  AlertCircle,
  Send,
  KeyRound,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../lib/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginPassword, requestOTP, verifyOTP, loginGoogle } = useAuth();

  // "password" | "otp-request" | "otp-verify"
  const [mode, setMode] = useState("password");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // ── Password login ──────────────────────────────────────
  async function handlePasswordLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginPassword(email.trim().toLowerCase(), password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── OTP: request code ───────────────────────────────────
  async function handleOTPRequest(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await requestOTP(email.trim().toLowerCase());
      setInfo(`A 6-digit code has been sent to ${email.trim()}.`);
      setMode("otp-verify");
    } catch (err) {
      setError(err.message || "Failed to send code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── OTP: verify code ────────────────────────────────────
  async function handleOTPVerify(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyOTP(email.trim().toLowerCase(), otpCode.trim());
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  }

  // ── Google login ──────────────────────────────────
  async function handleGoogleSuccess(response) {
    setError("");
    setLoading(true);
    try {
      await loginGoogle(response.credential);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  // ── Shared error banner ─────────────────────────────────
  const ErrorBanner = () =>
    error ? (
      <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 mb-6">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <p className="font-body text-sm">{error}</p>
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-hero-pattern flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-moss/10 border border-eco-100 p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center w-14 h-14 bg-moss rounded-2xl mb-4 hover:bg-leaf transition-colors duration-300"
            >
              <Leaf className="w-7 h-7 text-cream" />
            </Link>
            <h1 className="font-display font-bold text-2xl text-moss mb-1">
              Welcome back
            </h1>
            <p className="font-body text-bark/55 text-sm">
              Sign in to Project ECHO
            </p>
          </div>

          <ErrorBanner />

          {/* ── PASSWORD MODE ─────────────────────────────────── */}
          {mode === "password" && (
            <>
              <form onSubmit={handlePasswordLogin} className="space-y-5">
                <div>
                  <label className="font-display font-medium text-sm text-bark/70 mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bark/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@nsut.ac.in"
                      required
                      className="w-full pl-11 pr-4 py-3.5 border-2 border-eco-100 rounded-2xl font-body text-sm text-bark focus:outline-none focus:border-moss transition-colors duration-200 bg-cream/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-display font-medium text-sm text-bark/70 mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bark/40" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-11 pr-4 py-3.5 border-2 border-eco-100 rounded-2xl font-body text-sm text-bark focus:outline-none focus:border-moss transition-colors duration-200 bg-cream/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Sign In
                    </span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-eco-100" />
                <span className="font-mono text-xs text-bark/35">or</span>
                <div className="flex-1 h-px bg-eco-100" />
              </div>

              <button
                onClick={() => { setError(""); setMode("otp-request"); }}
                className="w-full flex items-center justify-center gap-2 border-2 border-eco-100 rounded-2xl py-3 font-display font-semibold text-sm text-bark/70 hover:border-moss/40 hover:text-moss transition-all duration-200"
              >
                <KeyRound className="w-4 h-4" />
                Sign in with OTP instead
              </button>
            </>
          )}

          {/* ── OTP REQUEST MODE ───────────────────────────────── */}
          {mode === "otp-request" && (
            <>
              <form onSubmit={handleOTPRequest} className="space-y-5">
                <div>
                  <label className="font-display font-medium text-sm text-bark/70 mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bark/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@nsut.ac.in"
                      required
                      className="w-full pl-11 pr-4 py-3.5 border-2 border-eco-100 rounded-2xl font-body text-sm text-bark focus:outline-none focus:border-moss transition-colors duration-200 bg-cream/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending code...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Send OTP Code
                    </span>
                  )}
                </button>
              </form>

              <button
                onClick={() => { setError(""); setMode("password"); }}
                className="w-full text-center font-body text-sm text-bark/50 hover:text-moss mt-5 transition-colors"
              >
                ← Use password instead
              </button>
            </>
          )}

          {/* ── OTP VERIFY MODE ────────────────────────────────── */}
          {mode === "otp-verify" && (
            <>
              {info && (
                <div className="bg-eco-50 border border-eco-100 text-moss rounded-2xl p-4 mb-5 font-body text-sm">
                  {info}
                </div>
              )}

              <form onSubmit={handleOTPVerify} className="space-y-5">
                <div>
                  <label className="font-display font-medium text-sm text-bark/70 mb-2 block">
                    6-Digit Code
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bark/40" />
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="123456"
                      required
                      className="w-full pl-11 pr-4 py-3.5 border-2 border-eco-100 rounded-2xl font-body text-sm text-bark focus:outline-none focus:border-moss tracking-widest transition-colors duration-200 bg-cream/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="w-full btn-primary justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4" />
                      Verify & Sign In
                    </span>
                  )}
                </button>
              </form>

              <button
                onClick={() => { setError(""); setInfo(""); setOtpCode(""); setMode("otp-request"); }}
                className="w-full text-center font-body text-sm text-bark/50 hover:text-moss mt-5 transition-colors"
              >
                ← Resend code
              </button>
            </>
          )}

          {/* Google Sign-In — always visible regardless of mode */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-eco-100" />
            <span className="font-mono text-xs text-bark/35">or</span>
            <div className="flex-1 h-px bg-eco-100" />
          </div>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-in failed. Please try again.")}
              theme="outline"
              shape="pill"
              text="continue_with"
              logo_alignment="left"
            />
          </div>

          {/* Register link */}
          <p className="text-center font-body text-sm text-bark/55 mt-6">
            New to Project ECHO?{" "}
            <Link
              to="/register"
              className="text-moss font-semibold hover:text-leaf transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
