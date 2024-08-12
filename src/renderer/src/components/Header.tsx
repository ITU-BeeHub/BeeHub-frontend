import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserIcon } from "@heroicons/react/24/outline"; // Daha önce belirttiğimiz şekilde ekleyin veya manuel SVG kullanın
import BeakerIcon from "./icons/BeakerIcon";

export default function Header() {
  const { isLoggedIn } = useAuth(); // Kullanıcı giriş durumu
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/profile"); // Giriş yapılmışsa profile yönlendir
    } else {
      navigate("/login"); // Giriş yapılmamışsa login sayfasına yönlendir
    }
  };

  return (
    <header className="flex h-[60px] items-center justify-between border-b bg-white px-4 lg:px-6">
      <Link to="/" className="flex items-center gap-2">
        <BeakerIcon className="h-8 w-8 text-[#FDC003]" />
        <span className="text-2xl font-bold text-[#212121]">BeeHub</span>
      </Link>
      <div onClick={handleProfileClick} className="cursor-pointer">
        <UserIcon className="h-8 w-8 text-[#212121]" />
      </div>
    </header>
  );
}
