// ui/dropdown-menu.tsx

import React from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  return <div className="relative inline-block text-left">{children}</div>;
};

export const DropdownMenuTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

export const DropdownMenuContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
      {children}
    </div>
  );
};

export const DropdownMenuItem: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
  return (
    <button
      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
