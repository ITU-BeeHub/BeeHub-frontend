import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import BeakerIcon from "../components/icons/BeakerIcon";

const Home: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center  bg-[#F5FDFD] p-6">
      <div className="max-w-5xl w-full mx-auto">
        <div className="text-center mb-10">
          <BeakerIcon className="h-20 w-20 text-[#FDC003] mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-gray-800 mb-2">Welcome to BeeHub</h1>
          <p className="text-lg text-gray-600">
            Your ultimate university companion for managing your academic journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link to="/beepicker" className="hover:shadow-lg transition-shadow duration-300">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-semibold text-[#0372CE] mb-4">BeePicker</h3>
              <p className="text-gray-600">
                Manage your course selections easily and efficiently with BeePicker.
              </p>
              <Button className="mt-6 w-full bg-[#0372CE] text-white font-bold py-2">
                Go to BeePicker
              </Button>
            </div>
          </Link>

          <Link to="/beesync" className="hover:shadow-lg transition-shadow duration-300">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-semibold text-[#0372CE] mb-4">BeeSync</h3>
              <p className="text-gray-600">
                Sync your academic files and stay organized with BeeSync.
              </p>
              <Button className="mt-6 w-full bg-[#0372CE] text-white font-bold py-2">
                Explore BeeSync
              </Button>
            </div>
          </Link>

          <Link to="/beecalendar" className="hover:shadow-lg transition-shadow duration-300">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-semibold text-[#0372CE] mb-4">BeeCalendar</h3>
              <p className="text-gray-600">
                Keep track of your tasks and deadlines with BeeCalendar.
              </p>
              <Button className="mt-6 w-full bg-[#0372CE] text-white font-bold py-2">
                Check BeeCalendar
              </Button>
            </div>
          </Link>

          <Link to="/beearchive" className="hover:shadow-lg transition-shadow duration-300">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-semibold text-[#0372CE] mb-4">BeeArchive</h3>
              <p className="text-gray-600">
                Access and manage your past courses and notes with BeeArchive.
              </p>
              <Button className="mt-6 w-full bg-[#0372CE] text-white font-bold py-2">
                Visit BeeArchive
              </Button>
            </div>
          </Link>

          <Link to="/beechat" className="hover:shadow-lg transition-shadow duration-300">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-semibold text-[#0372CE] mb-4">BeeChat</h3>
              <p className="text-gray-600">
                Connect with your peers using BeeChat.
              </p>
              <Button className="mt-6 w-full bg-[#0372CE] text-white font-bold py-2">
                Chat with BeeChat
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Home;
