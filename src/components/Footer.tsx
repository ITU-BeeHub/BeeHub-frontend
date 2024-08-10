import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 p-4 text-white">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
        <p>&copy; 2023 BeeHub. All rights reserved.</p>
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