import React, { createContext, useState, useContext } from "react";

// AuthContext'in tipi
interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

// AuthContext'i oluştur
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider bileşeni
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Context'i kullanmak için özel hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
