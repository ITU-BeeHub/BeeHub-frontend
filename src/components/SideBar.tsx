import { Link } from 'react-router-dom';
// Remove the duplicate import statement for 'SVGProps'
import { JSX } from 'react/jsx-runtime';
import { SVGProps } from 'react';


export default function Sidebar() {
  return (
    <aside className="hidden w-[280px] flex-col border-r bg-white p-4 lg:flex">
      <Link to="/" className="flex items-center gap-2 py-4">
        <BeakerIcon className="h-8 w-8 text-[#FDC003]" />
        <span className="text-2xl font-bold text-[#212121]">BeeHub</span>
      </Link>
      <nav className="mt-8 flex flex-col gap-2">
        <Link
          to="/beepicker"
          className="flex items-center gap-3 rounded-lg p-3 text-[#212121] transition-colors hover:bg-[#FDC003] hover:text-white"
        >
          <PickaxeIcon className="h-6 w-6" />
          <span>BeePicker</span>
        </Link>
        <Link
          to="/beesync"
          className="flex items-center gap-3 rounded-lg p-3 text-[#212121] transition-colors hover:bg-[#FDC003] hover:text-white"
        >
          <FolderSyncIcon className="h-6 w-6" />
          <span>BeeSync</span>
        </Link>
        <Link
          to="/beecalendar"
          className="flex items-center gap-3 rounded-lg p-3 text-[#212121] transition-colors hover:bg-[#FDC003] hover:text-white"
        >
          <CalendarIcon className="h-6 w-6" />
          <span>BeeCalendar</span>
        </Link>
        <Link
          to="/beearchive"
          className="flex items-center gap-3 rounded-lg p-3 text-[#212121] transition-colors hover:bg-[#FDC003] hover:text-white"
        >
          <ArchiveIcon className="h-6 w-6" />
          <span>BeeArchive</span>
        </Link>
        <Link
          to="/beechat"
          className="flex items-center gap-3 rounded-lg p-3 text-[#212121] transition-colors hover:bg-[#FDC003] hover:text-white"
        >
          <WebcamIcon className="h-6 w-6" />
          <span>BeeChat</span>
        </Link>
      </nav>
    </aside>
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