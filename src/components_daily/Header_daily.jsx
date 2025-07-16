import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import agendaharian from '../assets/agendaharian.png';
import { useAuth } from '../context/AuthContext';

const Header_daily = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const goToNotification = () => {
    navigate('/notification');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    alert('Anda telah keluar dari aplikasi');
    navigate('/account');
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-5 pt-8 pb-4 flex items-center justify-between bg-transparent ">
      {/* Tombol Notifikasi */}
      <button
        aria-label="Notifications"
        onClick={goToNotification}
        className="text-white hover:text-[#F66300]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>

      {/* Logo Tengah */}
      <div className="mb-6 relative" style={{ width: "178px", height: "34px" }}>
        <img
          src={agendaharian}
          alt="Agenda Harian"
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>

      {/* Menu Dropdown */}
      <div className="relative" ref={menuRef}>
        <button 
          aria-label="More options" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white hover:text-white/80"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <circle cx="6" cy="10" r="2" />
            <circle cx="14" cy="10" r="2" />
            <circle cx="10" cy="10" r="2" />
          </svg>
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-[#1A0A4C] rounded-2xl shadow-lg py-1 z-50 border border-[#1A0A4C]">
            <button
              onClick={goToHome}
              className="block w-full text-center px-4 py-2 text-white hover:bg-white/10 text-sm"
            >
              Beranda
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-center px-4 py-2 text-white hover:bg-white/10 text-sm"
            >
              Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header_daily;
