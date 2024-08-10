import React from 'react';
import Header from './Header';


interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen">

      <div className="flex flex-1 flex-col">
        <Header />

          {children}
      

      </div>
    </div>
  );
}
