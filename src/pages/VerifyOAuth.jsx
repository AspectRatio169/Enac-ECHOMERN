import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { account } from "../lib/appwrite";
import { getUserProfile, createUserProfile, setVerified } from "../lib/db";
import { useAuth } from "../lib/useAuth";

export default function VerifyOAuthPage() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function complete() {
      try {
        const userId = searchParams.get("userId");
        const secret = searchParams.get("secret");

        if (!userId || !secret) {
          navigate("/login", { replace: true });
          return;
        }

        // Exchange token for session — same as magic link flow
        await account.createSession(userId, secret);

        const currentUser = await account.get();

        // Check email is allowed
        const NSUT_EMAIL = /@nsut\.ac\.in$/i;
        const DEV_ALLOWLIST = [
          "kulshresthaprankush@gmail.com",
          "iitjee202312345@gmail.com",
          "jojot3750@gmail.com",
        ];
        const email = currentUser.email?.toLowerCase().trim();
        if (!NSUT_EMAIL.test(email) && !DEV_ALLOWLIST.includes(email)) {
          await account.deleteSession("current");
          localStorage.removeItem("echo_jwt");
          navigate("/login?error=email_not_allowed", { replace: true });
          return;
        }

        // Store JWT for Express API
        const jwtResult = await account.createJWT();
        localStorage.setItem("echo_jwt", jwtResult.jwt);

        // Ensure profile exists in MongoDB
        try {
          await getUserProfile();
        } catch {
          await createUserProfile(
            currentUser.name || "",
            currentUser.email,
            currentUser.$id,
          );
        }

        // Mark verified
        await setVerified(currentUser.name || "");

        // Refresh auth context
        await checkAuth();

        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("OAuth error:", err);
        navigate("/login", { replace: true });
      }
    }
    complete();
  }, []);

  return (
    <div className="min-h-screen bg-hero-pattern flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-full animate-spin"
          style={{ border: "3px solid #dcfce7", borderTopColor: "#2D4A22" }}
        />
        <span className="font-mono text-sm text-bark/50 tracking-widest uppercase">
          Signing you in...
        </span>
      </div>
    </div>
  );
}
