// src/context/VersionContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { VERSION } from "../Constants";
import { useNavigate } from "react-router-dom";

interface VersionContextType {
  isVersionValid: boolean;
  loading: boolean;
}

const VersionContext = createContext<VersionContextType>({
  isVersionValid: false,
  loading: true,
});

export const useVersion = () => useContext(VersionContext);

export const VersionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVersionValid, setIsVersionValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch('http://localhost:8080/version');
        const { version: backendVersion } = await response.json();

        if (backendVersion === VERSION) {
          setIsVersionValid(true);
        } else {
          navigate("/version-error");
        }
      } catch (error) {
        console.error("Error checking app version:", error);
        navigate("/version-error");
      } finally {
        setLoading(false);
      }
    };

    checkVersion();
  }, [navigate]);

  return (
    <VersionContext.Provider value={{ isVersionValid, loading }}>
      {children}
    </VersionContext.Provider>
  );
};
