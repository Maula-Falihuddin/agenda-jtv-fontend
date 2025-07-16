import React, { useEffect, useState } from 'react';
import Calendar from '../../components/Calendar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AgendaRapat() {
  
const navigate = useNavigate();
const { isLoggedIn } = useAuth();

const getFormattedDate = () => {
  if (!selectedDate) return null;

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(selectedDate).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

useEffect(() => {
  if (!isLoggedIn) {
    navigate('/account');
  }
}, [isLoggedIn]);

const { logout } = useAuth();

<button onClick={logout}>Logout</button>
  const [isAdding, setIsAdding] = useState(false); 
  const [formData, setFormData] = useState({
    title: '',
    priority: '',
    time: '',
    notes: '',
  });
  const [showError, setShowError] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date(). getDate());
      const token = localStorage.getItem('token');

  const handleToggleAdd = () => {
    setIsAdding(prev => !prev);
    if (isAdding) {
      setFormData({ title: '', priority: '', time: '', notes: '' });
      setShowError(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (showError) setShowError(false); 
  };

  const isFormValid = formData.title.trim() !== '' && formData.priority !== '' && formData.time !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setShowError(true);
      return;
    }


    try {
      const response = await fetch('http://127.0.0.1:8000/api/schedules', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          priority: formData.priority,
          meeting_date: getFormattedDate(),
          meeting_time: formData.time,
          description: formData.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Gagal Menambahkan data');

      alert('berhasil menambahkan data!');
    } catch (err) {
      alert(err.message);
    }

    setIsAdding(false);
    setFormData({ title: '', priority: '', time: '', notes: '' });
    setShowError(false);
  };

  return (
    <div className="flex flex-col relative">
      <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      <div
        className="content bg-white/20 rounded-2xl p-8 flex flex-col justify-center items-center relative flex-grow text-center text-white"    
        style={{ minHeight: '340px' }}  >
        {isAdding && (
          <>
            <button
              onClick={handleToggleAdd}
              className="absolute top-4 right-4 text-orange-500 font-bold text-xl"
              aria-label="Tutup form tambah tugas"
            >
              &times;
            </button>
            <form onSubmit={handleSubmit} className="w-full text-white text-left">
              <label className="block mb-2 font-semibold">Judul Tugas</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full mb-4 rounded-md border px-3 py-2 ${
                  showError && formData.title.trim() === '' ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Masukkan judul tugas"
              />
              <label className="block mb-2 font-semibold">Prioritas</label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`w-full mb-4 rounded-md border px-3 py-2 ${
                  showError && formData.priority === '' ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value=""className="block mb-2 font-semibold">Pilih prioritas</option>
                <option value="low" className="bg-gray-800 text-white">Rendah</option>
                  <option value="medium" className="bg-gray-800 text-white">Normal</option>
                  <option value="high" className="bg-gray-800 text-white">Tinggi</option>
              </select>

              <label className="block mb-2 font-semibold">Waktu</label>

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`w-full mb-4 rounded-md border px-3 py-2 ${
                  showError && formData.time === '' ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ color: 'white', backgroundColor: 'transparent' }}
              />

              <label className="block mb-2 font-semibold">Catatan</label>
              
              <textarea
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="w-full mb-4 rounded-md border border-gray-300 px-3 py-2 resize-none"
                placeholder="Tambahkan catatan"
              />
              {showError && (
                <p className="text-red-600 mb-4 font-semibold">
                  Harap isi semua field wajib sebelum menekan Selesai.
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 rounded-md py-2 font-bold text-white transition"
              >
                Selesai
              </button>
            </form>
          </>
        )}
        
        {!isAdding && (
          <>
            <p className="mb-6 text-lg">
              Belum ada agenda rapat hari ini<br />klik + untuk membuat tugas baru
            </p>
            <button
              onClick={handleToggleAdd}
              className="add-button absolute bottom-8 right-8 w-14 h-14 border-2 border-orange-500 text-orange-500 rounded-full text-4xl font-bold flex items-center justify-center hover:bg-orange-500 hover:text-white transition"
              aria-label="Tambah tugas baru"
            >
              +
            </button>
          </>
        )}
      </div>
    </div>
  );
}
