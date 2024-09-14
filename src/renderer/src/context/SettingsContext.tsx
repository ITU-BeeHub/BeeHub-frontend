// src/context/SettingsContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface Setting {
  value: string | number | boolean;
}

interface SettingsContextType {
  settings: { [key: string]: Setting };
  updateSetting: (key: string, value: string | number | boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<{ [key: string]: Setting }>({
    rememberMe: { value: false }, 
    setting1: { value: false },
    setting2: { value: 10 },
    setting3: { value: "Default Text" },
  });

  useEffect(() => {
    const storedSettings = localStorage.getItem("appSettings");
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  const updateSetting = (key: string, value: string | number | boolean) => {
    setSettings((prevSettings) => {
      const newSettings = { ...prevSettings, [key]: { value } };
      localStorage.setItem("appSettings", JSON.stringify(newSettings));
      return newSettings;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};
