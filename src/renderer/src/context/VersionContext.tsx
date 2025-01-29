import React, { createContext, useContext, useEffect, useState } from "react";
import { VERSION } from "../Constants";
import { useNavigate } from "react-router-dom";

interface VersionContextType {
  isVersionValid: boolean;
  loading: boolean;
  backendAvailable: boolean;
  currentVersion: string;
  backendVersion: string | null;
  forceUpdate: boolean;
  setForceUpdate: (force: boolean) => void;
}

const VersionContext = createContext<VersionContextType>({
  isVersionValid: false,
  loading: true,
  backendAvailable: true,
  currentVersion: VERSION,
  backendVersion: null,
  forceUpdate: false,
  setForceUpdate: () => { },
});

export const useVersion = () => useContext(VersionContext);

export const VersionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVersionValid, setIsVersionValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [backendVersion, setBackendVersion] = useState<string | null>(null);
  const [forceUpdate, setForceUpdate] = useState(false);
  const navigate = useNavigate();

  const checkVersion = async () => {
    try {
      const response = await fetch("http://localhost:8080/version");
      if (response.ok) {
        const data = await response.json();
        setBackendVersion(data.version);
        setBackendAvailable(true);

        if (data.version === VERSION) {
          setIsVersionValid(true);
        } else if (!forceUpdate) {
          navigate("/version-mismatch");
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
      if (!backendAvailable) {
        checkVersion();
      } else {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [backendAvailable, forceUpdate]);

  return (
    <VersionContext.Provider
      value={{
        isVersionValid,
        loading,
        backendAvailable,
        currentVersion: VERSION,
        backendVersion,
        forceUpdate,
        setForceUpdate
      }}
    >
      {children}
    </VersionContext.Provider>
  );
};
