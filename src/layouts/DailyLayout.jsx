import React from 'react';
import background from '../assets/wallpaper.png';
import HeaderDaily from '../components_daily/Header_daily';
import FooterDaily from '../components_daily/Footer';
import { Outlet, useLocation } from 'react-router-dom';

const HEADER_HEIGHT = 96; // px, sesuaikan dengan tinggi Header_daily
const FOOTER_HEIGHT = 56; // px, sesuaikan dengan tinggi Footer

const DailyLayout = () => {
  const location = useLocation();
  const hideHeaderOnPage = ['/daily/some-page']; // halaman yang tidak pakai header

  const isHeaderHidden = hideHeaderOnPage.includes(location.pathname);

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white font-sans relative overflow-hidden"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="relative max-w-md w-full mx-auto px-4 md:px-6 h-screen">

        {/* Header */}
        {!isHeaderHidden && (
          <div className="h-[96px] fixed top-0 left-0 right-0 z-50">
            <HeaderDaily />
          </div>
        )}

        {/* Main Content */}
        <main
          className="absolute left-0 right-0 overflow-y-auto"
          style={{
            top: !isHeaderHidden ? `${HEADER_HEIGHT}px` : 0,
            bottom: `${FOOTER_HEIGHT}px`,
            height: !isHeaderHidden
              ? `calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)`
              : `calc(100vh - ${FOOTER_HEIGHT}px)`,
            padding: '1rem',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          <Outlet />
        </main>

        {/* Footer */}
        <div className="h-[56px] fixed bottom-0 left-0 right-0 z-50">
          <FooterDaily />
        </div>
      </div>
    </div>
  );
};

export default DailyLayout;
