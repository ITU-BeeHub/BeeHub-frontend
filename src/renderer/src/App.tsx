{/* REACT */ }
import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";

{/* CONTEXT */ }
import { AuthProvider } from "./context/AuthContext";
import { VersionProvider, useVersion } from "./context/VersionContext";
import { SettingsProvider } from "./context/SettingsContext";

{/* COMPONENTS */ }
import InternetConnectionChecker from "./components/InternetConnectionStartup";
import InternetConnectionToast from "./components/InternetConnectionToast";
import LoadingAnimation from "./components/LoadingAnimation";
import Layout from "./components/Layout";
import UpdateNotification from "./components/UpdateNotification";

{/* PAGES */ }
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Beepicker from "./pages/BeePicker";
import BeeSync from './pages/BeeSync';
import BeeCalendar from './pages/BeeCalendar';
import BeeArchive from './pages/BeeArchive';
import BeeChat from './pages/BeeChat';
import Settings from "./pages/Settings";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";

import VersionError from "./pages/VersionError";
import VersionMismatch from "./pages/VersionMismatch";

function AppContent() {
  const { isVersionValid, loading, backendAvailable, forceUpdate } = useVersion();

  if (loading) {
    return (
      <LoadingAnimation
        mainText="Loading..."
        subText="Fetching data, please wait."
        animationType="spin"
        spinDuration={2} // Optional: defaults to 2 seconds
      />
    );
  }

  if (!backendAvailable) {
    return (
      <LoadingAnimation
        mainText="Connecting to BeeHub..."
        subText="Attempting to establish a connection with the server."
        animationType="bounce"
        spinDuration={1} // Optional: duration for bounce effect
      />
    );
  }

  if (!isVersionValid && !forceUpdate) {
    return (
      <Routes>
        <Route path="/version-mismatch" element={<VersionMismatch />} />
        <Route path="*" element={<Navigate to="/version-mismatch" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/beepicker" element={<Beepicker />} />
        <Route path="/beesync" element={<BeeSync />} />
        <Route path="/beecalendar" element={<BeeCalendar />} />
        <Route path="/beearchive" element={<BeeArchive />} />
        <Route path="/beechat" element={<BeeChat />} />
        <Route path="/version-error" element={<VersionError />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/version-mismatch" element={<VersionMismatch />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <InternetConnectionChecker>
        <VersionProvider>
          <SettingsProvider>
            <AuthProvider>
              <InternetConnectionToast>
                <UpdateNotification />
                <AppContent />
              </InternetConnectionToast>
            </AuthProvider>
          </SettingsProvider>
        </VersionProvider>
      </InternetConnectionChecker>
    </Router>
  );
}

export default App;
