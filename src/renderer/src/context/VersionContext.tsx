import React, { createContext, useContext, useEffect, useState } from "react";
import { VERSION } from "../Constants";
import { useNavigate } from "react-router-dom";

interface VersionContextType {
  isVersionValid: boolean;
  loading: boolean;
  backendAvailable: boolean;
}

const VersionContext = createContext<VersionContextType>({
  isVersionValid: false,
  loading: true,
  backendAvailable: true,
});

export const useVersion = () => useContext(VersionContext);

export const VersionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVersionValid, setIsVersionValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const navigate = useNavigate();

  const checkVersion = async () => {
    try {
      const response = await fetch("http://localhost:8080/version");
      if (response.ok) {
        const { version: backendVersion } = await response.json();
        if (backendVersion === VERSION) {
          setIsVersionValid(true);
          setBackendAvailable(true);
        } else {
          navigate("/version-error");
        }
      } else {
        throw new Error("Backend not available");
      }
    } catch (error) {
      console.error("Error checking app version:", error);
      setBackendAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkVersion();
      if (backendAvailable && isVersionValid) {
        clearInterval(interval); // Stop checking once the backend is available and the version is valid
      }
    }, 5000); // Retry every 5 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [backendAvailable, isVersionValid, navigate]);

  return (
    <VersionContext.Provider value={{ isVersionValid, loading, backendAvailable }}>
      {children}
    </VersionContext.Provider>
  );
};
