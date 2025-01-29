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
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [backendVersion, setBackendVersion] = useState<string | null>(null);
  const navigate = useNavigate();

  const checkVersion = async () => {
    try {
      const response = await fetch("http://localhost:8080/version");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      setBackendVersion(data.version);
      setBackendAvailable(true);
      setIsVersionValid(data.version === VERSION);
    } catch (error) {
      setBackendAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle version mismatch navigation
  useEffect(() => {
    if (backendAvailable && !isVersionValid && backendVersion) {
      navigate("/version-error");
    }
  }, [backendAvailable, isVersionValid, backendVersion, navigate]);

  // Check version periodically
  useEffect(() => {
    checkVersion(); // Initial check
    
    const interval = setInterval(() => {
      if (!backendAvailable) {
        checkVersion();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [backendAvailable]);

  return (
    <VersionContext.Provider value={{ isVersionValid, loading, backendAvailable }}>
      {children}
    </VersionContext.Provider>
  );
};
