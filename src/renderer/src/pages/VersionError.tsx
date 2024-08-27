import React from "react";
import { APP_DOWNLOAD_URL } from "../Constants";
import { Button } from "../components/ui/button";
import BeakerIcon from "../components/icons/BeakerIcon";

const VersionErrorPage: React.FC = () => {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <BeakerIcon className="h-16 w-16 text-[#FDC003] mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Version Mismatch
        </h1>
        <p className="text-gray-600 mb-6">
          Your current app version is outdated. Please download the latest version to continue using the app.
        </p>
        <Button
          className="w-full bg-[#FDC003] text-[#0372CE] font-bold hover:bg-[#fdc003d9] py-3"
          onClick={() => window.open(APP_DOWNLOAD_URL, "_blank")}
        >
          Download Latest Version
        </Button>
      </div>
    </main>
  );
};

export default VersionErrorPage;
