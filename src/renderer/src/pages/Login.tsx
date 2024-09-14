import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { Checkbox } from "../components/ui/checkbox";
import BeakerIcon from "../components/icons/BeakerIcon";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useSettings } from "../context/SettingsContext";  // Import the context

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { settings, updateSetting } = useSettings();  // Get settings context
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(settings.rememberMe?.value as boolean);

  useEffect(() => {
    setRememberMe(settings.rememberMe?.value as boolean);  // Sync with context
  }, [settings.rememberMe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;

    try {
      await login(email, password, rememberMe);
      navigate("/");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
    updateSetting("rememberMe", checked);  // Update context when checkbox changes
  };

  return (
    <main className="flex-1 flex items-center justify-center p-4 lg:p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <div className="mb-8 text-center">
          <Link to="#" className="flex items-center justify-center gap-2">
            <BeakerIcon className="h-8 w-8 text-[#FDC003]" />
            <span className="text-2xl font-bold text-[#212121]">BeeHub</span>
          </Link>
          <p className="mt-2 text-[#212121]">Your University Companion</p>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email" className="text-[#212121]">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-1 w-full rounded-md border border-[#0372CE] bg-white p-2 text-[#212121] focus:border-[#0372CE] focus:ring-[#0372CE]"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-[#212121]">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mt-1 w-full rounded-md border-[#0372CE] bg-white p-2 text-[#212121] focus:border-[#0372CE] focus:ring-[#0372CE]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => handleRememberMeChange(!!checked)}  // Sync with context
            />
            <label htmlFor="rememberMe" className="text-sm font-medium leading-none">
              Remember me!
            </label>
          </div>

          <Button className="w-full h-10 bg-[#FDC003] text-[#0372CE] font-bold hover:bg-[#fdc003d9]">Sign In</Button>
        </form>
      </div>
    </main>
  );
};

export default LoginForm;
