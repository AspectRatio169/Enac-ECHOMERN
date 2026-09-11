import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  Mail,
  User,
  Lock,
  AlertCircle,
  CheckCircle,
  Send,
} from "lucide-react";
import { useAuth } from "../lib/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              Join Project ECHO
            </h1>
            <p className="font-body text-bark/55 text-sm">
              Create your account and start earning eco-points
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="font-body text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="font-display font-medium text-sm text-bark/70 mb-2 block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bark/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  required
                  className="w-full pl-11 pr-4 py-3.5 border-2 border-eco-100 rounded-2xl font-body text-sm text-bark focus:outline-none focus:border-moss transition-colors duration-200 bg-cream/50"
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
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
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-11 pr-4 py-3.5 border-2 border-eco-100 rounded-2xl font-body text-sm text-bark focus:outline-none focus:border-moss transition-colors duration-200 bg-cream/50"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="font-display font-medium text-sm text-bark/70 mb-2 block">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bark/40" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  className="w-full pl-11 pr-4 py-3.5 border-2 border-eco-100 rounded-2xl font-body text-sm text-bark focus:outline-none focus:border-moss transition-colors duration-200 bg-cream/50"
                />
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-eco-50 border border-eco-100 rounded-2xl p-4 space-y-2">
              {[
                "Earn eco-points for every deposit",
                "Redeem rewards from partner brands",
                "Track your environmental impact",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-eco-500 shrink-0" />
                  <span className="font-body text-xs text-bark/65">{benefit}</span>
                </div>
              ))}
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
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Create Account
                </span>
              )}
            </button>
          </form>

          <p className="text-center font-body text-sm text-bark/55 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-moss font-semibold hover:text-leaf transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}