import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout/layout";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { Loading } from "@/components/ui/loading";
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

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="zohar-media-theme">
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
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
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
