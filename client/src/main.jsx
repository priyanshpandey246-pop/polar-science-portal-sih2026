import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Photos from "./pages/Photos.jsx";
import Videos from "./pages/Videos.jsx";
import Activities from "./pages/Activities.jsx";
import "./index.css";
import ManageContent from "./pages/admin/ManageContent.jsx";
import App from "./App.jsx";
import Expeditions from "./pages/Expeditions.jsx";
import ExpeditionDetail from "./pages/ExpeditionDetail.jsx";
import Publications from "./pages/Publications.jsx";
import Datasets from "./pages/Datasets.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import AskPolar from "./pages/AskPolar.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageExpeditions from "./pages/admin/ManageExpeditions.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import OutreachGenerator from "./pages/admin/OutreachGenerator.jsx";
import NotFound from "./pages/NotFound.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route
          path="/expeditions"
          element={<Expeditions />}
        />

        <Route
  path="/admin/manage/:type"
  element={
    <ProtectedRoute>
      <ManageContent />
    </ProtectedRoute>
  }
/>

        <Route
          path="/expeditions/:id"
          element={<ExpeditionDetail />}
        />

        <Route
          path="/publications"
          element={<Publications />}
        />

        <Route
          path="/admin/outreach"
          element={
        <ProtectedRoute>
        <OutreachGenerator />
        </ProtectedRoute>
  }
/>

        <Route
          path="/datasets"
          element={<Datasets />}
        />

        <Route
          path="/search"
          element={<SearchPage />}
        />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route path="*" element={<NotFound />} />

        <Route
          path="/ask-polar"
          element={<AskPolar />}
        />

        <Route path="/photos" element={<Photos />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/activities" element={<Activities />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
  path="/admin/expeditions"
  element={
    <ProtectedRoute>
      <ManageExpeditions />
    </ProtectedRoute>
  }
/>
      </Routes>

      <Toaster position="top-right" />
    </BrowserRouter>
  </StrictMode>
);