import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function Update() {
  const { schedules } = useOutletContext();

  if (!schedules || schedules.length === 0) {
    return <p className="text-white text-center mt-8">Belum ada jadwal yang dibuat.</p>;
  }

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-4">Daftar Jadwal</h2>
      <ul>
        {schedules.map((schedule, index) => (
          <li key={index} className="mb-3 p-3 bg-white/20 rounded">
            <p><strong>Judul:</strong> {schedule.title}</p>
            <p><strong>Prioritas:</strong> {schedule.priority}</p>
            <p><strong>Waktu:</strong> {schedule.time}</p>
            {schedule.notes && <p><strong>Catatan:</strong> {schedule.notes}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
