import React from 'react';
import calendarIcon from '../assets/navbar kalender.png';
import agendaIcon from '../assets/NavBar_agendaditambah.png';
import notesIcon from '../assets/Navbar_catatan.png';
import { Link } from 'react-router-dom';

export default function FooterNav() {
  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 bg-white/20 flex justify-around p-4 z-20 max-w-4xl mx-auto">
      <div className="nav-item flex-1 flex justify-center">
        <Link
          to="/meeting/create"
          className="calendar-button bg-transparent border-none focus:outline-none"
          aria-label="Kalender"
        >
          <img
            src={calendarIcon}
            alt="Kalender"
            className="w-7 h-7 filter transition duration-300"
            style={{ filter: 'hue-rotate(150deg)' }}
          />
        </Link>
      </div>
      <div className="nav-item flex-1 flex justify-center">
        <Link
          to="/meeting/"
          className="jadwal-button bg-transparent border-none focus:outline-none"
          aria-label="Agenda Ditambah"
        >
          <img src={agendaIcon} alt="Agenda Ditambah" className="w-7 h-7" />
        </Link>
      </div>
      <div className="nav-item flex-1 flex justify-center">
        <Link
          to="/meeting/notes"
          className="catatan-button bg-transparent border-none focus:outline-none"
          aria-label="Catatan"
        >
          <img src={notesIcon} alt="Catatan" className="w-7 h-7" />
        </Link>
      </div>
    </nav>
  );
}
