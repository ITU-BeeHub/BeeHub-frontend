import React from "react";
import { Link } from "react-router-dom";

import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import BeakerIcon from "../components/icons/BeakerIcon";

const LoginForm: React.FC = () => {
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
        <form className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-[#212121]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-1 w-full rounded-md border border-[#0372CE] bg-white p-2 text-[#212121] focus:border-[#0372CE] focus:ring-[#0372CE]"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-[#212121]">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mt-1 w-full rounded-md border-[#0372CE] bg-white p-2 text-[#212121] focus:border-[#0372CE] focus:ring-[#0372CE]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </label>
          </div>
          <Button className="w-full h-10 bg-[#FDC003] text-[#0372CE] font-bold hover:bg-[#fdc003d9]">
            Sign In
          </Button>
        </form>
      </div>
    </main>
  );
};

export default LoginForm;
