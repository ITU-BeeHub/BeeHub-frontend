import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
  email: string;
  first_name: string;
  last_name: string;
  faculty: string;
  department: string;
  gpa: string;
  photo: string;
  class: string;
}

const Profile: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:8080/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!isMounted) return;

        if (response.status === 401) {
          // Sadece açıkça unauthorized olduğunda logout yap
          const data = await response.json();
          if (data.error === "unauthenticated" || data.error === "session expired") {
            await logout();
            navigate('/login');
          }
        } else if (response.ok) {
          const data: ProfileData = await response.json();
          if (data.email === "" && data.photo === "") {
            // Geçersiz profil verisi
            setError('Invalid profile data');
            await logout();
            navigate('/login');
          } else {
            setProfile(data);
          }
        } else {
          throw new Error('Failed to fetch profile data');
        }
      } catch (err) {
        if (!isMounted) return;
        setError('Error fetching profile data');
        console.error('Error fetching profile:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [logout, navigate]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600"
        >
          Log Out
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-center text-red-500 mb-4">{error}</div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600"
        >
          Log Out
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-center text-xl mb-4">No profile data available.</div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600"
        >
          Log Out
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex items-center space-x-6">
        <img
          src={`data:image/jpeg;base64,${profile.photo}`}
          alt="Profile"
          className="w-32 h-32 rounded-full shadow-md"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{profile.first_name} {profile.last_name}</h1>
          <p className="text-sm text-gray-600">{profile.email}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <p className="text-gray-600"><strong>Class:</strong> {profile.class}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <p className="text-gray-600"><strong>Cumulative GPA:</strong> {profile.gpa}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Academic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <p className="text-gray-600"><strong>Faculty:</strong> {profile.faculty}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <p className="text-gray-600"><strong>Department:</strong> {profile.department}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
