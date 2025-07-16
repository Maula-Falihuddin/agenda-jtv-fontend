import React, { useState } from 'react';

const months = [
  'januari', 'februari', 'maret', 'april', 'mei', 'juni',
  'juli', 'agustus', 'september', 'oktober', 'november', 'desember'
];

export default function Calendar({ currentDate, setCurrentDate, selectedDate, setSelectedDate }) {


  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const datesArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const today = new Date();
  const isToday = (day) =>
    day === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  const currentMonthYear = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <div className="calendar bg-white/20 rounded-2xl p-6 mb-8 flex flex-col">
      {/* Navbar */}
      <div className="month flex items-center justify-between text-white mb-5">
        <button
          onClick={goToPreviousMonth}
          className="prev-month text-3xl font-bold focus:outline-none"
          aria-label="Previous Month"
        >
          &lt;
        </button>
        <h2 id="current-date" className="text-xl font-normal capitalize">{currentMonthYear}</h2>
        <button
          onClick={goToNextMonth}
          className="next-month text-3xl font-bold focus:outline-none"
          aria-label="Next Month"
        >
          &gt;
        </button>
      </div>

      {/* Weekdays */}
      <div className="weekdays grid grid-cols-7 text-center text-white text-opacity-60 font-light mb-3 text-lg select-none">
        <div>Sen</div>
        <div>Sel</div>
        <div>Rab</div>
        <div>Kam</div>
        <div>Jum</div>
        <div>Sab</div>
        <div>Min</div>
      </div>

      {/* Dates */}
      <div className="dates grid grid-cols-7 gap-3 justify-items-center text-white text-opacity-90">
      {datesArray.map(day => {
        const isSelected = selectedDate === day;
        const showHighlight = (!selectedDate && isToday(day)) || isSelected;

        return (
          <span
            key={day}
            onClick={() => setSelectedDate(day)}
            className={`
              cursor-pointer flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-300
              ${showHighlight ? 'bg-orange-500 font-bold' : ''}
              hover:bg-orange-400
            `}
            role="button"
            tabIndex={0}
            aria-label={`Tanggal ${day}`}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedDate(day);
              }
            }}
          >
            {day}
          </span>
        );
      })}
      </div>
    </div>
  );
}
