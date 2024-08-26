import React, { useEffect, useState } from "react";
import { toast, ToastContainer, Id } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const InternetConnectionToast: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [toastId, setToastId] = useState<Id | null>(null);

  const checkInternetConnection = async () => {
    try {
      const response = await fetch("https://www.google.com", {
        method: "HEAD",
        mode: "no-cors",
        cache: "no-store",
      });

      // If the request succeeds, we're online
      setIsOnline(true);
    } catch (error) {
      // If the request fails, we're offline
      setIsOnline(false);
    }
  };

  useEffect(() => {
    checkInternetConnection();

    // Set interval to check connection periodically
    const intervalId = setInterval(checkInternetConnection, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!isOnline) {
      // Show an indefinite offline notification if the user goes offline
      if (toastId === null) {
        const id = toast.error("You are currently offline. Some features may not work properly.", {
          position: "top-center",
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          hideProgressBar: true,
          pauseOnHover: true,
          closeButton: false,
        });
        setToastId(id);
      }
    } else if (isOnline && toastId !== null) {
      // When the user comes back online, dismiss the previous offline toast and show a new one for 5 seconds
      toast.dismiss(toastId);
      setToastId(null);
      toast.success("Internet connection restored.", {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        pauseOnHover: true,
        closeButton: true,
      });
    }
  }, [isOnline, toastId]);

  return (
    <>
      <ToastContainer />
      {children}
    </>
  );
};

export default InternetConnectionToast;
