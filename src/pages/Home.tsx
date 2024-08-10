import Header from '../components/Header';
import Sidebar from '../components/SideBar';

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6 bg-[#F5FDFD]">
        <Header>
          
        </Header>
        
      </main>
    </div>
  );
}
