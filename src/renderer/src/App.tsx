{/* REACT */}
import { HashRouter as Router, Route, Routes } from "react-router-dom";

{/* CONTEXT */}
import { AuthProvider } from "./context/AuthContext";
import { VersionProvider, useVersion } from "./context/VersionContext";
import { SettingsProvider } from "./context/SettingsContext";

{/* COMPONENTS */}
import InternetConnectionChecker from "./components/InternetConnectionStartup";
import InternetConnectionToast from "./components/InternetConnectionToast";
import LoadingAnimation from "./components/LoadingAnimation";
import Layout from "./components/Layout";

{/* PAGES */}
import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Beepicker from "./pages/BeePicker";
import Settings from "./pages/Settings";
import VersionError from "./pages/VersionError";



function AppContent() {
  const { isVersionValid, loading, backendAvailable } = useVersion();

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

  if (!isVersionValid) {
    return (
      <Routes>
        <Route path="/version-error" element={<VersionError />} />
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
        <Route path="/version-error" element={<VersionError />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/contact" element={<Contact />} />
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
