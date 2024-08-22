import { useAuth } from '../context/AuthContext'; // AuthContext yolunuza göre güncelleyin
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Oturumu kapat
    navigate('/');
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <p>This is the profile page.</p>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
        Log Out
      </button>
    </div>
  );
}
