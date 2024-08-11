import { NavLink } from "react-router-dom";

import ArchiveIcon from "./icons/ArchiveIcon";
import CalendarIcon from "./icons/CalendarIcon";
import FolderSyncIcon from "./icons/FolderSyncIcon";
import WebcamIcon from "./icons/WebCamIcon";
import PickaxeIcon from "./icons/PickaxeIcon";
import SettingsIcon from "./icons/SettingsIcon";
import HamburgerIcon from "./icons/Hamburger";
import { useState } from "react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex flex-col h-screen">
      <aside
        className={`bg-white h-full border-r p-4 transition-all duration-300 flex flex-col justify-between ${
          isCollapsed ? "w-20" : "w-[280px]"
        }`}
      >
        <div>
          <nav className="px-2">
            <div
              className="flex items-center gap-2 py-4 cursor-pointer"
              onClick={toggleSidebar}
            >
              <HamburgerIcon className="h-8 w-8 flex-shrink-0 text-[#FDC003]" />
              <span
                className={`overflow-hidden transition-all duration-300 ${
                  isCollapsed ? "opacity-0 scale-0" : "opacity-100 scale-100"
                }`}
              >
                BeeHub
              </span>
            </div>
          </nav>
          <nav className="mt-8 flex flex-col gap-2">
            <NavLink
              to="/beepicker"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 transition-colors ${
                  isActive
                    ? "border-l-8 border-[#FDC003] bg-[#F5FDFD] text-[#212121] -mr-4 rounded-l-lg"
                    : "text-[#212121] hover:bg-[#FDC003] hover:text-white rounded-lg"
                }`
              }
            >
              <PickaxeIcon className="h-6 w-6 flex-shrink-0" />
              <span
                className={`overflow-hidden transition-all duration-300 ${
                  isCollapsed ? "opacity-0 scale-0" : "opacity-100 scale-100"
                }`}
              >
                BeePicker
              </span>
            </NavLink>
            <NavLink
              to="/beesync"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 transition-colors ${
                  isActive
                    ? "border-l-8 border-[#FDC003] bg-[#F5FDFD] text-[#212121] -mr-4 rounded-l-lg"
                    : "text-[#212121] hover:bg-[#FDC003] hover:text-white rounded-lg"
                }`
              }
            >
              <FolderSyncIcon className="h-6 w-6 flex-shrink-0" />
              <span
                className={`overflow-hidden transition-all duration-300 ${
                  isCollapsed ? "opacity-0 scale-0" : "opacity-100 scale-100"
                }`}
              >
                BeeSync
              </span>
            </NavLink>
            <NavLink
              to="/beecalendar"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 transition-colors ${
                  isActive
                    ? "border-l-8 border-[#FDC003] bg-[#F5FDFD] text-[#212121] -mr-4 rounded-l-lg"
                    : "text-[#212121] hover:bg-[#FDC003] hover:text-white rounded-lg"
                }`
              }
            >
              <CalendarIcon className="h-6 w-6 flex-shrink-0" />
              <span
                className={`overflow-hidden transition-all duration-300 ${
                  isCollapsed ? "opacity-0 scale-0" : "opacity-100 scale-100"
                }`}
              >
                BeeCalendar
              </span>
            </NavLink>
            <NavLink
              to="/beearchive"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 transition-colors ${
                  isActive
                    ? "border-l-8 border-[#FDC003] bg-[#F5FDFD] text-[#212121] -mr-4 rounded-l-lg"
                    : "text-[#212121] hover:bg-[#FDC003] hover:text-white rounded-lg"
                }`
              }
            >
              <ArchiveIcon className="h-6 w-6 flex-shrink-0" />
              <span
                className={`overflow-hidden transition-all duration-300 ${
                  isCollapsed ? "opacity-0 scale-0" : "opacity-100 scale-100"
                }`}
              >
                BeeArchive
              </span>
            </NavLink>
            <NavLink
              to="/beechat"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 transition-colors ${
                  isActive
                    ? "border-l-8 border-[#FDC003] bg-[#F5FDFD] text-[#212121] -mr-4 rounded-l-lg"
                    : "text-[#212121] hover:bg-[#FDC003] hover:text-white rounded-lg"
                }`
              }
            >
              <WebcamIcon className="h-6 w-6 flex-shrink-0" />
              <span
                className={`overflow-hidden transition-all duration-300 ${
                  isCollapsed ? "opacity-0 scale-0" : "opacity-100 scale-100"
                }`}
              >
                BeeChat
              </span>
            </NavLink>
          </nav>
        </div>

        {/* Settings Navigation Anchored to Bottom */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 transition-colors ${
              isActive
                ? "border-l-8 border-[#FDC003] bg-[#F5FDFD] text-[#212121] -mr-4 rounded-l-lg"
                : "text-[#212121] hover:bg-[#FDC003] hover:text-white rounded-lg"
            }`
          }
        >
          <SettingsIcon className="h-6 w-6 flex-shrink-0" />
          <span
            className={`overflow-hidden transition-all duration-300 ${
              isCollapsed ? "opacity-0 scale-0" : "opacity-100 scale-100"
            }`}
          >
            Settings
          </span>
        </NavLink>
      </aside>
    </div>
  );
}
