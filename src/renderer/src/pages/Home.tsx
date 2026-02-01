import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import BeakerIcon from "../components/icons/BeakerIcon";

const Home: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center bg-[#F5FDFD] p-6">
      <div className="max-w-4xl w-full mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FDC003] rounded-2xl shadow-lg mb-6">
            <BeakerIcon className="h-12 w-12 text-[#0372CE]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to BeeHub
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A course selection assistant for ITU students.
            Plan and submit your courses with confidence.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-6">
          {/* BeePicker Card */}
          <Link to="/beepicker" className="group">
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#FDC003]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#FDC003]/20 rounded-xl flex items-center justify-center group-hover:bg-[#FDC003] transition-colors">
                  <svg className="w-6 h-6 text-[#0372CE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#0372CE]">BeePicker</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Build your schedule, avoid conflicts, and submit your course selection in one place.
              </p>
              <div className="flex items-center text-[#0372CE] font-medium">
                <span>Go to BeePicker</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            To access the ITU Kepler system,{" "}
            <Link to="/login" className="text-[#0372CE] hover:underline font-medium">
              sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Home;
