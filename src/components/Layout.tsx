import Sidebar from './SideBar';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-4 lg:p-6 bg-[#F5FDFD]">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
