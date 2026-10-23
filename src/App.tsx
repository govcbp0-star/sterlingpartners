import { lazy, Suspense, useLayoutEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Team from "./pages/Team";
import LawyerProfile from "./pages/LawyerProfile";
import Contact from "./pages/Contacts";
import RequireAdmin from "./components/admin/RequireAdmin";
import { AdminAuthProvider } from "./contexts/AdminAuthProvider";
import Seo from "./components/Seo";
import { firm } from "./data/firm";

const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const LawyerEditorPage = lazy(() => import("./pages/admin/LawyerEditorPage"));
const AdminPreviewPage = lazy(() => import("./pages/admin/AdminPreviewPage"));

function AdminRouteFallback() {
  return <main className="admin-page"><div className="admin-container" role="status">Loading dashboard…</div></main>;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function NotFound({ path }: { path: string }) {
  return (
    <>
      <Seo
        page={{
          path,
          title: `Page Not Found | ${firm.name}`,
          description: `The requested page could not be found on the ${firm.name} website.`,
        }}
        noindex
        includeFirmSchema={false}
      />
      <main className="not-found">
        <div className="container">
          <span className="eyebrow">404 — PAGE NOT FOUND</span>
          <h1>This page doesn't exist.</h1>
          <p>Please use the navigation to find what you're looking for.</p>
          <a href="/" className="button button-dark">
            Return Home
          </a>
        </div>
      </main>
    </>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <AdminAuthProvider>
      <>
        <ScrollToTop />
        {!isAdminRoute && <Navbar />}
        {isAdminRoute && (
          <Seo
            page={{
              path: pathname,
              title: `Administration | ${firm.name}`,
              description: "Authorized lawyer profile administration.",
            }}
            noindex
            includeFirmSchema={false}
          />
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/team/:slug" element={<LawyerProfile />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<Suspense fallback={<AdminRouteFallback />}><AdminLoginPage /></Suspense>} />
          <Route path="/admin" element={<RequireAdmin />}>
            <Route index element={<Suspense fallback={<AdminRouteFallback />}><AdminDashboard /></Suspense>} />
            <Route path="lawyers/new" element={<Suspense fallback={<AdminRouteFallback />}><LawyerEditorPage /></Suspense>} />
            <Route path="lawyers/:lawyerId/edit" element={<Suspense fallback={<AdminRouteFallback />}><LawyerEditorPage /></Suspense>} />
            <Route path="lawyers/:lawyerId/preview" element={<Suspense fallback={<AdminRouteFallback />}><AdminPreviewPage /></Suspense>} />
          </Route>
          <Route path="*" element={<NotFound path={pathname} />} />
        </Routes>

        {!isAdminRoute && <Footer />}
      </>
    </AdminAuthProvider>
  );
}
