import React, { createContext, useState, useContext, useEffect } from "react";
import axios from 'axios';
import CryptoJS from 'crypto-js';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');

        if (rememberMe) {
          const encryptedEmail = CryptoJS.AES.encrypt(email, 'your-secret-key').toString();
          const encryptedPassword = CryptoJS.AES.encrypt(password, 'your-secret-key').toString();
          localStorage.setItem('email', encryptedEmail);
          localStorage.setItem('password', encryptedPassword);
        }
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      setIsLoggedIn(false);
      localStorage.removeItem('isLoggedIn');
      throw error;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');

    if (storedEmail && storedPassword) {
      const decryptedEmail = CryptoJS.AES.decrypt(storedEmail, 'your-secret-key').toString(CryptoJS.enc.Utf8);
      const decryptedPassword = CryptoJS.AES.decrypt(storedPassword, 'your-secret-key').toString(CryptoJS.enc.Utf8);

      login(decryptedEmail, decryptedPassword, true).catch(console.error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
