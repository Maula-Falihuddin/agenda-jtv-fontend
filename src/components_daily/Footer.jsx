    import { useLocation, useNavigate } from 'react-router-dom';

    const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname == path;

    return (
<footer className="fixed bottom-0 left-0 right-0 z-50 bg-cover backdrop-blur-md py-3 px-8 flex justify-between text-white/40 text-xs md:text-sm select-none">
        <button
        className={`flex flex-col items-center space-y-1 text-white/40 hover:text-[#F66300] transition-colors duration-200 cursor-pointer ${
        isActive('/') ? 'text-[#F66300]' : 'text-white/40 hover:text-[#F66300]'
        }`}
        onClick={() => navigate('/daily/Home_Daily')}
        >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4M3 10h18" />
        </svg>
        <span className="font-semibold">Semua</span>
        </button>

        <button 
        className="flex flex-col items-center space-y-1 hover:text-[#F66300] transition-colors duration-200 cursor-pointer"
        onClick={() => navigate('/daily/Daily')}>

        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>Harian</span>
        </button>

        <button 
        className="flex flex-col items-center space-y-1 hover:text-[#F66300] transition-colors duration-200 cursor-pointer"
        onClick={() => navigate('/daily/activity')}>

        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}>

            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"/>
        </svg>
        <span>Aktivitas</span>
        </button>
        </footer>
    );
    };

    export default Footer;
