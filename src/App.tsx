import { ProtectedRoute } from "@/components/auth/protected-route";
import { ErrorBoundary } from "@/components/error-boundary";
import { Layout } from "@/components/layout/layout";
import { ThemeProvider } from "@/components/theme-provider";
import { Loading } from "@/components/ui/loading";
import { Toaster } from "@/components/ui/toaster";
import { Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./globals.css";

// Lazy load pages for better performance
const Dashboard = lazy(() =>
  import("@/pages/dashboard").then((module) => ({ default: module.Dashboard }))
);
const Inquiries = lazy(() =>
  import("@/pages/inquiries").then((module) => ({ default: module.Inquiries }))
);
const Media = lazy(() =>
  import("@/pages/media").then((module) => ({ default: module.Media }))
);
const Testimonials = lazy(() =>
  import("@/pages/testimonials").then((module) => ({
    default: module.Testimonials,
  }))
);
const Analytics = lazy(() =>
  import("@/pages/analytics").then((module) => ({ default: module.Analytics }))
);
const Team = lazy(() =>
  import("@/pages/team").then((module) => ({ default: module.Team }))
);
const Portfolio = lazy(() =>
  import("@/pages/portfolio").then((module) => ({ default: module.Portfolio }))
);
const PortfolioCategories = lazy(() =>
  import("@/pages/portfolio-categories").then((module) => ({
    default: module.PortfolioCategories,
  }))
);
const Settings = lazy(() =>
  import("@/pages/settings").then((module) => ({ default: module.Settings }))
);

// Auth pages
const Login = lazy(() =>
  import("@/pages/auth/login").then((module) => ({ default: module.Login }))
);
const Register = lazy(() =>
  import("@/pages/auth/register").then((module) => ({
    default: module.Register,
  }))
);
const Profile = lazy(() =>
  import("@/pages/profile").then((module) => ({ default: module.Profile }))
);

function App() {
  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   // Initialize auth state from localStorage
  //   dispatch(initializeAuth());
  // }, [dispatch]);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="zohar-media-theme">
        <Router>
          <Routes>
            {/* Public auth routes */}
            <Route
              path="/login"
              element={
                <ProtectedRoute requireAuth={false}>
                  <Suspense fallback={<Loading type="page" />}>
                    <Login />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute requireAuth={false}>
                  <Suspense fallback={<Loading type="page" />}>
                    <Register />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Protected admin routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <Suspense fallback={<Loading type="page" />}>
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route
                path="inquiries"
                element={
                  <Suspense fallback={<Loading type="page" />}>
                    <Inquiries />
                  </Suspense>
                }
              />
              <Route
                path="media"
                element={
                  <Suspense fallback={<Loading type="page" />}>
                    <Media />
                  </Suspense>
                }
              />
              <Route
                path="testimonials"
                element={
                  <Suspense fallback={<Loading type="page" />}>
                    <Testimonials />
                  </Suspense>
                }
              />
              <Route
                path="analytics"
                element={
                  <Suspense fallback={<Loading type="page" />}>
                    <Analytics />
                  </Suspense>
                }
              />
              <Route
                path="team"
                element={
                  <Suspense fallback={<Loading type="page" />}>
                    <Team />
                  </Suspense>
                }
              />
              <Route
                path="portfolio"
                element={
                  <Suspense fallback={<Loading type="page" />}>
                    <Portfolio />
                  </Suspense>
                }
              />
              <Route
                path="portfolio-categories"
                element={
                  <Suspense fallback={<Loading type="page" />}>
                    <PortfolioCategories />
                  </Suspense>
                }
              />
              <Route
                path="settings"
                element={
                  <Suspense fallback={<Loading type="page" />}>
                    <Settings />
                  </Suspense>
                }
              />
              <Route
                path="profile"
                element={
                  <Suspense fallback={<Loading type="page" />}>
                    <Profile />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
