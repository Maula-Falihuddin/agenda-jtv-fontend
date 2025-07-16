import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoJtv from '../assets/agenda.png';
import background from '../assets/background.png';

export default function Home() {
  const navigate = useNavigate(); 

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-start pt-45 text-white font-sans">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      />
      
      <div className="relative z-10 flex flex-col items-center w-full">
        <img src={logoJtv} alt="JTV Agenda Logo" className="w-50 mb-12" />

        <div className="flex flex-col space-y-10 w-64 ">
          <button 
            onClick={() => navigate('/daily/Home_Daily')}
            className="py-3 bg-gradient-to-r from-cyan-400 to-blue-700 rounded-xl shadow-lg text-lg font-semibold hover:from-cyan-500 hover:to-blue-800 transition">
            Agenda Harian
          </button>
          <button
            onClick={() => navigate('/meeting/create')}
            className="py-3 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl shadow-lg text-lg font-semibold hover:from-purple-700 hover:to-indigo-800 transition"
          >
            Agenda Rapat
          </button>
        </div>
      </div>
    </div>
  );
}
