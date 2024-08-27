// src/components/InternetConnectionChecker.tsx
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

const InternetConnectionChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Internet Connection</h1>
          <p className="text-gray-600 mb-6">
            Please check your internet connection. The app will automatically reconnect when the connection is restored.
          </p>
          <Button
            className="w-full bg-[#FDC003] text-[#0372CE] font-bold hover:bg-[#fdc003d9] py-3"
            onClick={() => window.location.reload()}
          >
            Retry Now
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default InternetConnectionChecker;
