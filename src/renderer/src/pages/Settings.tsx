import React, { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext";
import { Button } from "../components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { VERSION } from "../Constants";

interface RemoteConfig {
  request?: {
    headers?: Record<string, string>;
    userAgents?: string[];
  };
  urls?: {
    coursePickerApi?: string;
    origin?: string;
  };
  version?: string;
}

const Settings: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [remoteConfig, setRemoteConfig] = useState<RemoteConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);
  const [showConfigDetails, setShowConfigDetails] = useState(false);

  // Fetch remote config from GitHub
  useEffect(() => {
    const fetchRemoteConfig = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/ITU-BeeHub/BeeHub-backend/main/remote-config.json'
        );
        if (response.ok) {
          const data = await response.json();
          setRemoteConfig(data);
        } else {
          setConfigError('Failed to load configuration');
        }
      } catch (error) {
        console.error('Remote config fetch error:', error);
        setConfigError('Connection error');
      } finally {
        setConfigLoading(false);
      }
    };

    fetchRemoteConfig();
  }, []);

  const handleChange = (key: string, value: string | number | boolean) => {
    setLocalSettings({ ...localSettings, [key]: { ...localSettings[key], value } });
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    Object.entries(localSettings).forEach(([key, setting]) => {
      updateSetting(key, setting.value);
    });

    setIsSaving(false);
    toast.success('Settings saved!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
    });
  };

  const clearLocalData = () => {
    localStorage.removeItem("selectedCourses");
    localStorage.removeItem("responseData");
    localStorage.removeItem("courseNameMap");
    localStorage.removeItem("groupIdCounter");
    localStorage.removeItem("dropCRNs");
    toast.info('Local data cleared!', {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Settings Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-[#0372CE] mb-6">Settings</h2>

        <div className="space-y-4">
          {/* Remember Me */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-gray-700 font-medium">Remember Me</label>
              <p className="text-sm text-gray-500">Keep session information on this device</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.rememberMe?.value as boolean}
                onChange={(e) => handleChange("rememberMe", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FDC003]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FDC003]"></div>
            </label>
          </div>

          {/* Clear Data Button */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-gray-700 font-medium">Clear Local Data</label>
              <p className="text-sm text-gray-500">Selected courses and previous results</p>
            </div>
            <Button
              onClick={clearLocalData}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Clear
            </Button>
          </div>
        </div>

        <Button
          className="w-full mt-6 bg-[#FDC003] text-[#0372CE] font-bold hover:bg-[#fdc003d9]"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#0372CE]"></div>
          ) : (
            "Save"
          )}
        </Button>
      </div>

      {/* Remote Config Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">System Configuration</h3>
          <button
            onClick={() => setShowConfigDetails(!showConfigDetails)}
            className="text-sm text-[#0372CE] hover:underline"
          >
            {showConfigDetails ? 'Hide details' : 'Show details'}
          </button>
        </div>

        {configLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#0372CE]"></div>
          </div>
        ) : configError ? (
          <div className="text-center py-4 text-gray-500">
            <p>{configError}</p>
            <p className="text-sm mt-1">Using default configuration</p>
          </div>
        ) : remoteConfig && (
          <div className="space-y-3">
            {/* Status Indicators */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700">API Connection Active</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-700">
                  Remote Config v{remoteConfig.version || '?'}
                </span>
              </div>
            </div>

            {/* Config Details */}
            {showConfigDetails && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">API Endpoint</p>
                  <p className="text-sm font-mono text-gray-700 break-all">
                    {remoteConfig.urls?.coursePickerApi || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">User-Agent Count</p>
                  <p className="text-sm text-gray-700">
                    {remoteConfig.request?.userAgents?.length || 0} browser signatures
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">HTTP Headers</p>
                  <p className="text-sm text-gray-700">
                    {Object.keys(remoteConfig.request?.headers || {}).length} headers configured
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Version Info */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Version Info</h3>
            <p className="text-sm text-gray-500">BeeHub Course Picker</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#0372CE]">{VERSION}</p>
            <p className="text-xs text-gray-400">App Version</p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Settings;
