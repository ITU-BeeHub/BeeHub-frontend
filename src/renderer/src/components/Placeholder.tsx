import BeakerIcon from "../components/icons/BeakerIcon";

interface PlaceholderProps {
  title: string;
  message: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title, message }) => {
  return (
    <main className="flex-1 flex items-center justify-center p-4 lg:p-4">
    
      <header className="h-16"> {/* Example fixed header height */}
        {/* Your Header content */}
      </header>
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <BeakerIcon className="h-16 w-16 text-[#FDC003] mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>
          <p className="text-gray-600 mb-6">{message}</p>
        </div>
      </div>
      <footer className="h-16"> {/* Example fixed footer height */}
        {/* Your Footer content */}
      </footer>
    </main>
  );
};

export default Placeholder;