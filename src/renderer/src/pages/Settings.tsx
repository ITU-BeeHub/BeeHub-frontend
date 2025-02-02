import React, { useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { Button } from "../components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { VERSION } from "../Constants";

const Settings: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false); // State for the spinner

  const handleChange = (key: string, value: string | number | boolean) => {
    setLocalSettings({ ...localSettings, [key]: { ...localSettings[key], value } });
  };

  const handleSave = async () => {
    setIsSaving(true); // Show spinner
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async save delay

    Object.entries(localSettings).forEach(([key, setting]) => {
      updateSetting(key, setting.value);
    });

    setIsSaving(false); // Hide spinner
    toast.success('Settings saved successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#0372CE]">Settings</h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-gray-700 font-medium">Remember Me</label>
          <input
            type="checkbox"
            checked={localSettings.rememberMe.value as boolean}
            onChange={(e) => handleChange("rememberMe", e.target.checked)}
            className="form-checkbox h-6 w-6 text-[#FDC003] rounded focus:ring-2 focus:ring-[#0372CE]"
          />
        </div>

        {/* Sample settings 
        <div className="flex items-center justify-between">
          <label className="text-gray-700 font-medium">Enable Feature</label>
          <input
            type="checkbox"
            checked={localSettings.setting1.value as boolean}
            onChange={(e) => handleChange("setting1", e.target.checked)}
            className="form-checkbox h-6 w-6 text-[#FDC003] rounded focus:ring-2 focus:ring-[#0372CE]"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-gray-700 font-medium">Max Items</label>
          <input
            type="number"
            value={localSettings.setting2.value as number}
            onChange={(e) => handleChange("setting2", parseInt(e.target.value))}
            className="w-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0372CE] focus:border-transparent"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-gray-700 font-medium mr-4">Username</label>
          <input
            type="text"
            value={localSettings.setting3.value as string}
            onChange={(e) => handleChange("setting3", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0372CE] focus:border-transparent"
          />
        </div>
      */}
      </div>

      <div className="mt-8 text-center">
        <Button
          className="px-6 py-2 bg-[#FDC003] text-[#0372CE] font-bold rounded-lg hover:bg-[#fdc003d9] transition duration-300"
          onClick={handleSave}
          disabled={isSaving} // Disable button while saving
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>App Version: <span className="font-medium text-gray-700">{VERSION}</span></p>
      </div>

      <ToastContainer /> {/* Toast container for displaying notifications */}
    </div>
  );
};

export default Settings;
