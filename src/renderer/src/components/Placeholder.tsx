import React, { useEffect, useState } from "react";
import BeakerIcon from "../components/icons/BeakerIcon";

interface PlaceholderProps {
  title: string;
  message: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title, message }) => {
  const [headerFooterHeight, setHeaderFooterHeight] = useState(0);
  // I am NOT proud of this code. I am sorry. I am so sorry. I am so, so sorry.
  // In order to properly fit the placeholder in the center of the screen, we need to calculate the height of the header and footer.
  // This is because for some reason min-h-screen doesn't work as expected, it doesn't take into account the header and footer.
  // I tried using flexbox and h-screen but it didn't work.

  useEffect(() => {
    // Get the height of the header and footer
    const headerHeight = document.querySelector('header')?.clientHeight || 0;
    const footerHeight = document.querySelector('footer')?.clientHeight || 0;
    
    // Set the total height of both header and footer
    setHeaderFooterHeight(headerHeight + footerHeight);
  }, []);

  return (
    <div
      className="flex items-center justify-center bg-gray-100"
      style={{
        height: `calc(100vh - ${headerFooterHeight + 50}px)`, // 50px is the padding of the placeholder
      }}
    >
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <BeakerIcon className="h-16 w-16 text-[#FDC003] mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
      </div>
    </div>
  );
};

export default Placeholder;
