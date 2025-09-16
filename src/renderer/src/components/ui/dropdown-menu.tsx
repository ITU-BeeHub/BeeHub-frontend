// ui/dropdown-menu.tsx
import React, { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuContextProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextProps | null>(null);

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const contextValue = {
    isOpen,
    setIsOpen,
  };

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children }) => {
  const context = React.useContext(DropdownMenuContext);

  if (!context) {
    throw new Error('DropdownMenuTrigger must be used within a DropdownMenu');
  }

  const { isOpen, setIsOpen } = context;

  const child = React.Children.only(children) as React.ReactElement;

  const handleClick = () => {
    if (child.props.disabled) return;
    setIsOpen(!isOpen);
  };

  return React.cloneElement(child, {
    onClick: handleClick,
  });
};

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ children, className, style }) => {
  const context = React.useContext(DropdownMenuContext);

  if (!context) {
    throw new Error('DropdownMenuContent must be used within a DropdownMenu');
  }

  const { isOpen, setIsOpen } = context;

  // Close menu when clicking outside
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <>
      {isOpen && (
        <div
          ref={menuRef}
          className={`origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 ${className}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          style={style}
        >
          {React.Children.map(children, (child) =>
            React.cloneElement(child as React.ReactElement<any>, {
              closeMenu: () => setIsOpen(false),
            })
          )}
        </div>
      )}
    </>
  );
};

interface DropdownMenuItemProps {
  onClick?: () => void;
  children: React.ReactNode;
  closeMenu?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ onClick, children, className, style, closeMenu }) => {
  const handleClick = () => {
    if (onClick) onClick();
    if (closeMenu) closeMenu();
  };

  return (
    <button
      onClick={handleClick}
      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${className}`}
      role="menuitem"
      style={style}
    >
      {children}
    </button>
  );
};
