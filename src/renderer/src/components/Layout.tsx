import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#F5FDFD]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
