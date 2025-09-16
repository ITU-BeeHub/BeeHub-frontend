import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import type { UpdateInfo, ProgressInfo } from '../types/electron';
import { IpcRendererEvent } from 'electron';

const UpdateNotification: React.FC = () => {
    const [updateAvailable, setUpdateAvailable] = useState<UpdateInfo | null>(null);
    const [downloading, setDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.electronAPI.checkForUpdates();

        window.electronAPI.onUpdateAvailable((_event: IpcRendererEvent, info: UpdateInfo) => {
            setUpdateAvailable(info);
        });

        window.electronAPI.onDownloadProgress((_event: IpcRendererEvent, progressObj: ProgressInfo) => {
            setDownloadProgress(progressObj.percent);
        });

        window.electronAPI.onUpdateDownloaded(() => {
            console.log('Update downloaded, installing...');
        });

        window.electronAPI.onUpdateError((_event: IpcRendererEvent, errorMessage: string) => {
            setError(errorMessage);
            setDownloading(false);
        });
    }, []);

    const handleUpdate = async () => {
        setDownloading(true);
        setError(null);
        try {
            await window.electronAPI.startUpdate();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Update failed');
            setDownloading(false);
        }
    };

    if (!updateAvailable) return null;

    return (
        <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">New Update Available!</h3>
            <p className="text-gray-600">Version {updateAvailable.version} is available</p>

            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            {downloading ? (
                <div className="mt-3">
                    <div className="h-2 bg-gray-200 rounded">
                        <div
                            className="h-full bg-blue-500 rounded"
                            style={{ width: `${downloadProgress}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Downloading... {Math.round(downloadProgress)}%
                    </p>
                </div>
            ) : (
                <Button
                    onClick={handleUpdate}
                    className="mt-3 bg-blue-500 text-white"
                >
                    Update Now
                </Button>
            )}
        </div>
    );
};

export default UpdateNotification;
