import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import BeakerIcon from "../components/icons/BeakerIcon";
import { useVersion } from "../context/VersionContext";

const VersionMismatch: React.FC = () => {
    const navigate = useNavigate();
    const { currentVersion, backendVersion, setForceUpdate } = useVersion();
    const [downloading, setDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    const handleUpdate = async () => {
        setDownloading(true);
        try {
            await window.electronAPI.startUpdate();
        } catch (error) {
            console.error('Update failed:', error);
            setDownloading(false);
        }
    };

    useEffect(() => {
        window.electronAPI.onDownloadProgress((_event, progressObj) => {
            setDownloadProgress(progressObj.percent);
        });

        window.electronAPI.onUpdateError(() => {
            setDownloading(false);
        });
    }, []);

    const handleContinue = () => {
        setForceUpdate(true);
        navigate("/");
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                    <BeakerIcon className="h-16 w-16 text-[#FDC003] mx-auto" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Version Mismatch Detected
                </h1>
                <p className="text-gray-600 mb-4">
                    Your current version ({currentVersion}) is different from the required version ({backendVersion}).
                </p>
                <p className="text-gray-500 mb-6 text-sm">
                    It's recommended to update to the latest version for the best experience.
                </p>
                <div className="flex flex-col gap-3">
                    {downloading ? (
                        <div className="w-full">
                            <div className="h-2 bg-gray-200 rounded">
                                <div
                                    className="h-full bg-[#FDC003] rounded transition-all duration-300"
                                    style={{ width: `${downloadProgress}%` }}
                                />
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                Downloading update... {Math.round(downloadProgress)}%
                            </p>
                        </div>
                    ) : (
                        <>
                            <Button
                                className="w-full bg-[#FDC003] text-[#0372CE] font-bold hover:bg-[#fdc003d9]"
                                onClick={handleUpdate}
                            >
                                Update Now
                            </Button>
                            <Button
                                className="w-full bg-gray-200 text-gray-700 font-bold hover:bg-gray-300"
                                onClick={handleContinue}
                            >
                                Continue Anyway
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
};

export default VersionMismatch;
