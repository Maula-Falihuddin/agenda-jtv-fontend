import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components_daily/Footer';
import Header from '../../components_daily/Header_daily';

const Daily = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAgendaModal, setShowAgendaModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const defaultDate = today.toISOString().split('T')[0];
  const defaultTime = today.toTimeString().slice(0, 5);
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [agendas, setAgendas] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const agendaSectionRef = useRef(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchAgendas = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/daily', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      setAgendas(data);
    } catch (error) {
      console.error('Gagal mengambil agenda:', error);
    }
  };

  useEffect(() => {
    fetchAgendas();
  }, []);

  const daysInWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const agendasForSelectedDate = agendas
    .filter((agenda) => agenda.tanggal === date)
    .sort((a, b) => a.jam.localeCompare(b.jam));

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const openAgendaModal = () => setShowAgendaModal(true);
  const closeAgendaModal = () => {
    setShowAgendaModal(false);
    resetForm();
    setEditingIndex(null);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('');
    setDate(defaultDate);
    setTime(defaultTime);
  };

  const handleDateClick = (day) => {
    const selected = new Date(currentYear, currentMonth, day + 1);
    const formattedDate = selected.toISOString().split('T')[0];
    setDate(formattedDate);
    setSelectedDate(day);
  };

  const handleSave = async () => {
  if (!title || !priority || !date || !time) {
    alert('Mohon isi semua field kecuali deskripsi.');
    return;
  }

  const newAgenda = {
    judul: title,
    deskripsi: description,
    prioritas: priority,
    tanggal: date,
    jam: time,
  };

  try {
    const response = await fetch('http://localhost:8000/api/daily', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newAgenda),
    });

    if (!response.ok) {
      throw new Error('Gagal menyimpan agenda');
    }

    const data = await response.json();
    closeAgendaModal(); // <- tambahkan ini
    navigate('/daily', { state: { newAgenda: data } });
  } catch (error) {
    console.error('Gagal menyimpan agenda:', error);
    alert('Gagal menyimpan agenda ke server.');
  }
};


  const isToday = (day) =>
    day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  return (
    <div className="h-[500px] bg-cover bg-center text-gray-200 flex flex-col justify-between">
      <Header />
      <main className="flex-grow flex flex-col items-center px-8">
        <div className="mt-4 bg-gradient-to-b from-[#54ACBF] to-[#0600AB] rounded-4xl p-6 w-full max-w-md shadow-lg">
          <div className="flex justify-between items-center mb-4 text-white font-bold text-center">
            <button onClick={handlePrevMonth} className="w-5 h-5 opacity-80 hover:opacity-100">
              <img src="https://cdn-icons-png.flaticon.com/512/11839/11839308.png" alt="prev" className="w-full h-full object-contain" />
            </button>
            <div className="text-lg">{monthNames[currentMonth]} {currentYear}</div>
            <button onClick={handleNextMonth} className="w-5 h-5 opacity-80 hover:opacity-100">
              <img src="https://cdn-icons-png.flaticon.com/512/11839/11839355.png" alt="next" className="w-full h-full object-contain" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-xs text-white/50 font-bold mb-2 select-none">
            {daysInWeek.map((day) => <div key={day}>{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 text-white font-bold text-center">
            {[...Array(firstDayIndex)].map((_, i) => <div key={'empty-' + i} />)}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const todayHighlight = isToday(day);
              const selectedHighlight = selectedDate === day;
              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`rounded-full w-8 h-8 flex items-center justify-center transition-colors ${
                    selectedHighlight ? 'bg-[#F66300] text-white' :
                    todayHighlight ? 'border-2 border-yellow-400 text-yellow-400 font-semibold' :
                    'hover:bg-[#F66300] hover:text-blue-900'
                  }`}
                >{day}</button>
              );
            })}
          </div>
        </div>

        <div className="mt-40 text-center">
          <p className="text-sm text-white opacity-80">
            Tekan tombol <span className="text-lg">➕</span> di kanan bawah untuk membuat agenda harian
          </p>
        </div>

        <button
          onClick={openAgendaModal}
          className="fixed bottom-20 right-6 bg-gradient-to-b from-[#0600AB] to-[#54ACBF] text-[#1A0A4C] rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </main>

      {showAgendaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-end z-50">
          <div className="w-full max-w-md bg-gradient-to-b from-[#00033D] to-[#0600AB] p-6 pb-24 rounded-t-3xl shadow-2xl">
            <div className="flex flex-col items-center gap-4 mb-6 mt-5">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="bg-gradient-to-b from-[#0600AB] to-[#54ACBF] text-white text-sm px-4 py-2 rounded-full cursor-pointer" />
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                className="bg-gradient-to-b from-[#0600AB] to-[#54ACBF] text-white text-sm px-4 py-2 rounded-full cursor-pointer" />
            </div>
            <input type="text" placeholder="Judul" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border-b border-white py-2 text-white placeholder-gray-500 focus:outline-none" />
            <textarea placeholder="Deskripsi" value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-transparent border-b border-white placeholder-gray-500 text-white py-1 focus:outline-none resize-none" />
            <div className="relative mt-6">
              <select value={priority} onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-gradient-to-b from-[#0600AB] to-[#54ACBF] text-white text-sm px-4 py-2 rounded-full">
                <option value="" disabled>Pilih Prioritas</option>
                <option value="tinggi">🔴 Prioritas Tinggi</option>
                <option value="sedang">🟡 Prioritas Sedang</option>
                <option value="rendah">🟢 Prioritas Rendah</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white">▼</div>
            </div>
            <div className="flex justify-center gap-4 mt-10">
              <button onClick={closeAgendaModal} className="bg-[#1A0A4C] text-white px-6 py-2 rounded-full">Tutup</button>
              <button onClick={handleSave} className="bg-blue-500 text-white px-6 py-2 rounded-full">
                {editingIndex !== null ? 'Update' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Daily;
