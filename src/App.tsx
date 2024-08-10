// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
