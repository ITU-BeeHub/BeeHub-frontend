import { VERSION } from "../Constants";

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-3 text-white mt-auto">
      <div className="flex flex-col items-center gap-2 px-4 md:flex-row md:justify-between">
        <p className="text-center text-sm text-gray-400 md:text-left">
          &copy; {new Date().getFullYear()} BeeHub
        </p>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">v{VERSION}</span>
          <a 
            href="mailto:beehubdev@proton.me" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            beehubdev@proton.me
          </a>
        </div>
      </div>
    </footer>
  );
}
