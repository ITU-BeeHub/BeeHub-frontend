import React from 'react';
import { Link } from 'react-router-dom'; // Next.js yerine React Router kullanıyoruz
import { JSX } from 'react/jsx-runtime';


export default function Header() {
  return (
    <header className="flex h-[60px] items-center justify-between border-b bg-white px-4 lg:px-6">
      <Link to="/" className="flex items-center gap-2">  {/* href yerine to kullanıyoruz */}
        <BeakerIcon className="h-8 w-8 text-[#FDC003]" />
        <span className="text-2xl font-bold text-[#212121]">BeeHub</span>
      </Link>
      <span className="text-sm text-[#212121]">Your University Companion</span>
    </header>
  );
}

function BeakerIcon(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
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
