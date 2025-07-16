import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import topBarImage from '../assets/TopBar_rapat.png';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/account');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Untuk  menu saat klik di luar area menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 left-0 p-4 flex items-center justify-center bg-transparent z-10 relative">
      <div
        onClick={() => navigate(-1)}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
      >
        <IoArrowBack className="h-8 w-8" />
      </div>

      <img src={topBarImage} alt="Top Bar" className="object-contain" />

      <div className="absolute right-0 top-1/2 transform -translate-y-1/2" ref={menuRef}>
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
              onClick={handleBackToHome}
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

export default Header;
