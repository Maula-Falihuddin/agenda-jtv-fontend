import React, { useState } from 'react';
import background from '../assets/background.png';
import Header from '../components/Header';
import FooterNav from '../components/Navbar';
import { Outlet, useLocation } from 'react-router-dom';

const HEADER_HEIGHT = 70;
const FOOTER_HEIGHT = 5;

const MeetingLayout = () => {
  const [schedules, setSchedules] = useState([]);
  const location = useLocation();
  const isCreateNotePage = location.pathname === '/meeting/notes/create';

  const addSchedule = (newSchedule) => {
    setSchedules(prev => [...prev, newSchedule]);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white font-sans relative md:py-8 overflow-hidden"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="relative overflow-hidden md:bg-white/10 md:backdrop-blur-md md:border md:border-white/20 md:shadow-lg md:rounded-xl max-w-md w-full mx-auto px-6 h-[calc(100vh-4rem)]">

        {!isCreateNotePage && (
          <div className="h-16">
            <Header />
          </div>
        )}

        <main
        className="absolute left-0 w-full overflow-y-auto p-4"
        style={{
          top: !isCreateNotePage ? `${HEADER_HEIGHT}px` : 0,
          bottom: `${FOOTER_HEIGHT}px`,     
          height: !isCreateNotePage 
            ? `calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px - 65px)`
            : `calc(100vh - ${FOOTER_HEIGHT}px)`, 
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
          <Outlet context={{ schedules, addSchedule }} />
        </main>

          <div className=" absolute bottom-0 left-0 w-full">
            <FooterNav />
          </div>
      </div>
    </div>
  );
};

export default MeetingLayout;
