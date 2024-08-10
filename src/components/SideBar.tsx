import { JSX } from 'react/jsx-runtime';
import { SVGProps } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex flex-col h-screen">
      <aside className={`bg-white h-full border-r p-4 transition-all duration-300 flex flex-col justify-between ${isCollapsed ? 'w-20' : 'w-[280px]'}`}>
        <div>
          <nav className="px-2">
            <div className="flex items-center gap-2 py-4 cursor-pointer" onClick={toggleSidebar}>
              <HamburgerIcon className="h-8 w-8 flex-shrink-0 text-[#FDC003]" />
              <span
                className={`overflow-hidden transition-all duration-300 ${
                  isCollapsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
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
                    ? 'border-l-8 border-[#FDC003] bg-[#F5FDFD] text-[#212121] -mr-4 rounded-l-lg'
                    : 'text-[#212121] hover:bg-[#FDC003] hover:text-white rounded-lg'
                }`
              }
            >
              <PickaxeIcon className="h-6 w-6 flex-shrink-0" />
              <span
                className={`overflow-hidden transition-all duration-300 ${
                  isCollapsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
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
                    ? 'border-l-8 border-[#FDC003] bg-[#F5FDFD] text-[#212121] -mr-4 rounded-l-lg'
                    : 'text-[#212121] hover:bg-[#FDC003] hover:text-white rounded-lg'
                }`
              }
            >
              <FolderSyncIcon className="h-6 w-6 flex-shrink-0" />
              <span
                className={`overflow-hidden transition-all duration-300 ${
                  isCollapsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
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
                    ? 'border-l-8 border-[#FDC003] bg-[#F5FDFD] text-[#212121] -mr-4 rounded-l-lg'
                    : 'text-[#212121] hover:bg-[#FDC003] hover:text-white rounded-lg'
                }`
              }
            >
              <CalendarIcon className="h-6 w-6 flex-shrink-0" />
              <span
                className={`overflow-hidden transition-all duration-300 ${
                  isCollapsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
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
                    ? 'border-l-8 border-[#FDC003] bg-[#F5FDFD] text-[#212121] -mr-4 rounded-l-lg'
                    : 'text-[#212121] hover:bg-[#FDC003] hover:text-white rounded-lg'
                }`
              }
            >
              <ArchiveIcon className="h-6 w-6 flex-shrink-0" />
              <span
                className={`overflow-hidden transition-all duration-300 ${
                  isCollapsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
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
                    ? 'border-l-8 border-[#FDC003] bg-[#F5FDFD] text-[#212121] -mr-4 rounded-l-lg'
                    : 'text-[#212121] hover:bg-[#FDC003] hover:text-white rounded-lg'
                }`
              }
            >
              <WebcamIcon className="h-6 w-6 flex-shrink-0" />
              <span
                className={`overflow-hidden transition-all duration-300 ${
                  isCollapsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
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
          ? 'border-l-8 border-[#FDC003] bg-[#F5FDFD] text-[#212121] -mr-4 rounded-l-lg'
          : 'text-[#212121] hover:bg-[#FDC003] hover:text-white rounded-lg'
      }`
    }
  >
    <SettingsIcon className="h-6 w-6 flex-shrink-0" />
    <span
      className={`overflow-hidden transition-all duration-300 ${
        isCollapsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
      }`}
    >
      Settings
    </span>
  </NavLink>
        
      </aside>
    </div>
  );
}


function ArchiveIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="5" x="2" y="3" rx="1" />
        <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
        <path d="M10 12h4" />
      </svg>
    )
  }

  function SettingsIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props} 
        xmlns="http://www.w3.org/2000/svg"
         width="1em" 
         height="1em" 
         viewBox="0 0 24 24">
          <path fill="currentColor" fillRule="evenodd" 
            d="m19.85 8.75l4.15.83v4.84l-4.15.83l2.35 3.52l-3.43 3.43l-3.52-2.35l-.83 4.15H9.58l-.83-4.15l-3.52 2.35l-3.43-3.43l2.35-3.52L0 14.42V9.58l4.15-.83L1.8 5.23L5.23 1.8l3.52 2.35L9.58 0h4.84l.83 4.15l3.52-2.35l3.43 3.43zm-1.57 5.07l4-.81v-2l-4-.81l-.54-1.3l2.29-3.43l-1.43-1.43l-3.43 2.29l-1.3-.54l-.81-4h-2l-.81 4l-1.3.54l-3.43-2.29l-1.43 1.43L6.38 8.9l-.54 1.3l-4 .81v2l4 .81l.54 1.3l-2.29 3.43l1.43 1.43l3.43-2.29l1.3.54l.81 4h2l.81-4l1.3-.54l3.43 2.29l1.43-1.43l-2.29-3.43zm-8.186-4.672A3.43 3.43 0 0 1 12 8.57A3.44 3.44 0 0 1 15.43 12a3.43 3.43 0 1 1-5.336-2.852m.956 4.274c.281.188.612.288.95.288A1.7 1.7 0 0 0 13.71 12a1.71 1.71 0 1 0-2.66 1.422" 
            clipRule="evenodd">
          </path>
        </svg>
    );
  }
  
  
  function BeakerIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.5 3h15" />
        <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
        <path d="M6 14h12" />
      </svg>
    )
  }
  
  
  function CalendarIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
      </svg>
    )
  }
  
  
  function FolderSyncIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v.5" />
        <path d="M12 10v4h4" />
        <path d="m12 14 1.535-1.605a5 5 0 0 1 8 1.5" />
        <path d="M22 22v-4h-4" />
        <path d="m22 18-1.535 1.605a5 5 0 0 1-8-1.5" />
      </svg>
    )
  }
  
  
  function PickaxeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912" />
        <path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393" />
        <path d="M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z" />
        <path d="M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319" />
      </svg>
    )
  }
  
  function WebcamIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="10" r="8" />
        <circle cx="12" cy="10" r="3" />
        <path d="M7 22h10" />
        <path d="M12 22v-4" />
      </svg>
    )
}

function HamburgerIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
  );
}
