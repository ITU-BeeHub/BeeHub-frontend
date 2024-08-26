import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Beepicker from "./pages/BeePicker";
import VersionError from "./pages/VersionError";
import { VersionProvider, useVersion } from "./context/VersionContext";

function AppContent() {
  const { isVersionValid, loading } = useVersion();

  if (loading) {
    return <div>Loading...</div>; // You can customize this loading state with your own design.
  }

  if (!isVersionValid) {
    return (
      <Routes>
        <Route path="/version-error" element={<VersionError />} />
        {/* Only VersionError is accessible if the version is not valid */}
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
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <VersionProvider>
          <AppContent />
        </VersionProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
