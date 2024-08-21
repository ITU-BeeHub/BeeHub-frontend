import React, { createContext, useState, useContext } from "react";
import axios from 'axios';

// AuthContext'in tipi
interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// AuthContext'i oluştur
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        setIsLoggedIn(true);
        // Eğer token vb. şeyler gerekiyorsa burada kaydedebilirsiniz
        // localStorage.setItem('token', response.data.token);
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    // Eğer bir token kaydediyorsanız, burada silebilirsiniz
    // localStorage.removeItem('token');
  };

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

