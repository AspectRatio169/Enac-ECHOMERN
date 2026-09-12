import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./lib/AuthContext";
import { SiteContentProvider } from "./lib/SiteContentContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute.jsx";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import GroupsPage from "./pages/GroupsPage";
import AdminPage from "./pages/AdminPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
      <SiteContentProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout>
                <AboutPage />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <LoginPage />
              </Layout>
            }
          />
          <Route
            path="/register"
            element={
              <Layout>
                <RegisterPage />
              </Layout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/groups"
            element={
              <Layout>
                <ProtectedRoute>
                  <GroupsPage />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/admin"
            element={
              <Layout>
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              </Layout>
            }
          />
          {/* Catch-all for old verify/oauth routes */}
          <Route path="/verify" element={<Navigate to="/login" replace />} />
          <Route path="/verify-oauth" element={<Navigate to="/login" replace />} />
          <Route path="/unverified" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      </SiteContentProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
