import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

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
          const data = await response.json();
          if (data.error === "unauthenticated" || data.error === "session expired") {
            await logout();
            navigate('/login');
          }
        } else if (response.ok) {
          const data: ProfileData = await response.json();
          if (!data.email) {
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
        setError('Error loading profile');
        console.error('Profile error:', err);
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
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0372CE]"></div>
        <p className="mt-4 text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <div className="text-center text-red-500 mb-4">{error}</div>
        <Button
          onClick={handleLogout}
          className="bg-red-500 text-white hover:bg-red-600"
        >
          Log Out
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <div className="text-center text-gray-600 mb-4">No profile data available.</div>
        <Button
          onClick={handleLogout}
          className="bg-red-500 text-white hover:bg-red-600"
        >
          Log Out
        </Button>
      </div>
    );
  }

  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();
  const hasPhoto = Boolean(profile.photo && profile.photo.trim().length > 0);

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#0372CE] to-[#0284c7] h-24"></div>
        
        {/* Profile Content */}
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex justify-center -mt-12">
            {hasPhoto ? (
              <img
                src={`data:image/jpeg;base64,${profile.photo}`}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-[#FDC003] text-[#0372CE] flex items-center justify-center text-2xl font-bold">
                {initials || 'BH'}
              </div>
            )}
          </div>

          {/* Name & Email */}
          <div className="text-center mt-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {profile.first_name} {profile.last_name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-6 py-4 border-t border-b border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#0372CE]">{profile.gpa}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">GPA</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#0372CE]">{profile.class}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Class</p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-[#FDC003] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#0372CE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-xs text-gray-500">Faculty</p>
                <p className="text-sm font-medium text-gray-700">{profile.faculty}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-[#FDC003] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#0372CE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-xs text-gray-500">Department</p>
                <p className="text-sm font-medium text-gray-700">{profile.department}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5"
          >
            {isLoggingOut ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                Logging out...
              </div>
            ) : (
              'Log Out'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
