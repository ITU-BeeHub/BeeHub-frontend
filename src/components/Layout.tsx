// src/components/Layout.tsx
import Sidebar from './SideBar';
import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6 bg-[#F5FDFD]">
        <Header />
        {children}
      </main>
    </div>
  );
}
