import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-4 text-white mt-auto">
      <div className="flex flex-col items-center gap-4 px-4 md:flex-row md:justify-between">
        <p className="text-center md:text-left">&copy; 2024 BeeHub. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/contact" className="text-gray-400 hover:text-white">
            Contact
          </Link>
          <Link to="/privacy" className="text-gray-400 hover:text-white">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-gray-400 hover:text-white">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
