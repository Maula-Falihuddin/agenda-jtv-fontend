import { useState } from 'react';
import Footer from '../../components_daily/Footer';
import Header from '../../components_daily/Header_daily';

const ActivityPage = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [description, setDescription] = useState('');
  const [agendas, setAgendas] = useState([]);
  const [showAgendaModal, setShowAgendaModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [showDayDropdown, setShowDayDropdown] = useState(false);
  const [showHourDropdown, setShowHourDropdown] = useState(false);
  const [showMinuteDropdown, setShowMinuteDropdown] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedAgendaDetail, setSelectedAgendaDetail] = useState(null);
  const [editId, setEditId] = useState(null);


  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const fetchAgendasByDay = async (day) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/activity?day=${day}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Gagal mengambil data');
      const data = await response.json();

      const mapped = data.map(item => ({
        id: item.id,
        day: item.day,
        time: `${String(item.hour).padStart(2, '0')}:${String(item.minute).padStart(2, '0')}`,
        description: item.description,
        is_checked: item.is_checked
      }));

      setAgendas(mapped);
    } catch (error) {
      console.error('Fetch gagal:', error);
    }
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    fetchAgendasByDay(day);
    setShowDayDropdown(false);
  };

  const handleOpenModal = (agenda = null, index = null) => {
    if (agenda) {
      setSelectedDay(agenda.day);
      const [hour, minute] = agenda.time.split(':');
      setSelectedHour(hour);
      setSelectedMinute(minute);
      setDescription(agenda.description);
      setEditIndex(index);
      setEditId(agenda.id);
    } else {
      setSelectedHour('');
      setSelectedMinute('');
      setDescription('');
      setEditIndex(null);
      setEditId(null);
    }

    setErrors({});
    setShowAgendaModal(true);
  };

  const handleCloseModal = () => {
    setShowAgendaModal(false);
    setSelectedDay(null);
    setSelectedHour('');
    setSelectedMinute('');
    setDescription('');
    setEditIndex(null);
    setErrors({});
    setShowHourDropdown(false);
    setShowMinuteDropdown(false);
  };

  const handleShowDetail = (agenda) => {
    setSelectedAgendaDetail(agenda);
  };

  const handleCloseDetail = () => {
    setSelectedAgendaDetail(null);
  };

  const handleSaveAgenda = async () => {
    const newErrors = {};

    if (!selectedDay) newErrors.day = 'Pilih hari terlebih dahulu.';
    if (!selectedHour) newErrors.hour = 'Pilih jam terlebih dahulu.';
    if (!selectedMinute) newErrors.minute = 'Pilih menit terlebih dahulu.';
    if (!description) newErrors.description = 'Deskripsi harus diisi.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const token = localStorage.getItem('token');

    const payload = {
      day: selectedDay,
      hour: parseInt(selectedHour),
      minute: parseInt(selectedMinute),
      description
    };

    try {
const isEdit = editId !== null;

const url = isEdit
  ? `http://localhost:8000/api/activity/${editId}`
  : `http://localhost:8000/api/activity`;

const method = isEdit ? 'PUT' : 'POST';


      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Gagal simpan agenda');
      await fetchAgendasByDay(selectedDay);
      handleCloseModal();
    } catch (error) {
      console.error('Gagal menyimpan agenda:', error);
    }
  };

  const handleDeleteAgenda = async (id) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:8000/api/activity/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Gagal hapus agenda');
      await fetchAgendasByDay(selectedDay);
    } catch (error) {
      console.error('Gagal menghapus agenda:', error);
    }
  };

  const agendasByDay = days.reduce((acc, day) => {
    acc[day] = agendas.filter((agenda) => agenda.day === day);
    return acc;
  }, {});

  const handleEditFromDetail = () => {
    const index = agendas.findIndex(a => a.id === selectedAgendaDetail.id);
    handleCloseDetail();
    handleOpenModal(selectedAgendaDetail, index);
  };

  const handleToggleCheck = async (id, newChecked) => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`http://localhost:8000/api/activity/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ is_checked: newChecked }),
    });

    if (!response.ok) throw new Error('Gagal update checklist');

    await fetchAgendasByDay(selectedDay); // Refresh list
  } catch (error) {
    console.error('Gagal update checklist:', error);
  }
};


  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center text-gray-200">
      <Header />
      <main className="flex-1 overflow-y-auto flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <div className="rounded-lg p-6 mb-6">
            <div className="w-full overflow-x-auto">
              <div className="flex space-x-3 w-max">
                {days.map((day) => (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`py-2 px-10 rounded-3xl transition-colors flex-shrink-0 ${
                      selectedDay === day
                        ? 'bg-gradient-to-r from-[#0600AB] to-[#00033D] text-white'
                        : 'bg-gradient-to-r from-[#54ACBF] to-[#5B4B99] hover:bg-gray-600'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center flex-grow px-5">
            {selectedDay && agendasByDay[selectedDay]?.length > 0 ? null : (
              <div className="relative w-48 h-80 mb-2">
                <img
                  src="/src/assets/activity.png"
                  alt="3D Pen and Notepad Illustration"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
            )}
          </div>

          <div className="text-center -mt-6">
            {selectedDay ? (
              agendasByDay[selectedDay] && agendasByDay[selectedDay].length > 0 ? (
                <div className="space-y-6">
                  {agendasByDay[selectedDay].map((agenda, index) => (
                    <div
                      key={agenda.id}
                      className="bg-gradient-to-r from-[#0600AB] to-[#54ACBF] rounded-3xl px-5 py-4 mx-5 flex items-center justify-between shadow-md"
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-orange-500 cursor-pointer"
                        checked={agenda.is_checked}
                        onChange={() => handleToggleCheck(agenda.id, !agenda.is_checked)}
                      />
                      <div
                        className="flex-1 ml-4 cursor-pointer"
                        onClick={() => handleShowDetail(agenda)}
                      >
                        <div className="flex justify-between w-full">
                          <span className="text-white font-bold text-base">{agenda.time}</span>
                          <span className="text-white font-bold text-base">{agenda.description}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Belum ada agenda untuk {selectedDay}</p>
              )
            ) : (
              <p className="text-gray-400">
                Klik hari untuk melihat agenda anda, jika tidak ada klik + untuk membuat agenda
              </p>
            )}
          </div>
        </div>
      </main>

      <button
        aria-label="Tambah agenda"
        onClick={() => handleOpenModal()}
        className="fixed bottom-20 right-6 bg-gradient-to-b from-[#0600AB] to-[#54ACBF] hover:bg-blue-700 text-[#1A0A4C] rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Modal Tambah/Edit Agenda */}
      {showAgendaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-end z-50">
          <div className="w-full max-w-md bg-gradient-to-b from-[#00033D] to-[#0600AB] p-6 pb-24 rounded-t-3xl shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-full">
                <button
                  onClick={() => {
                    setShowDayDropdown(!showDayDropdown);
                    setShowHourDropdown(false);
                    setShowMinuteDropdown(false);
                  }}
                  className={`w-full text-left bg-gradient-to-b from-[#0600AB] to-[#54ACBF] text-white text-sm px-4 py-2 rounded-full focus:outline-none flex justify-between items-center ${
                    errors.day ? 'border border-red-500' : ''
                  }`}
                >
                  {selectedDay || 'Pilih Hari'}
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform ${
                      showDayDropdown ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDayDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-gradient-to-b from-[#0600AB] to-[#54ACBF] rounded-lg shadow-lg max-h-60 overflow-auto">
                    <div
                      className="px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
                      onClick={() => {
                        setSelectedDay(null);
                        setShowDayDropdown(false);
                      }}
                    >
                      Pilih Hari
                    </div>
                    {days.map((day) => (
                      <div
                        key={day}
                        className="px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
                        onClick={() => {
                          handleDayClick(day);
                          setShowDayDropdown(false);
                        }}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.day && <p className="text-red-400 text-xs">{errors.day}</p>}

              <div className="flex w-full gap-2">
                <div className="relative w-1/2">
                  <button
                    onClick={() => {
                      setShowHourDropdown(!showHourDropdown);
                      setShowDayDropdown(false);
                      setShowMinuteDropdown(false);
                    }}
                    className={`w-full text-left bg-gradient-to-b from-[#0600AB] to-[#54ACBF] text-white text-sm px-4 py-2 rounded-full focus:outline-none flex justify-between items-center ${
                      errors.hour ? 'border border-red-500' : ''
                    }`}
                  >
                    {selectedHour || 'Jam'}
                    <svg
                      className={`w-4 h-4 ml-2 transition-transform ${
                        showHourDropdown ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showHourDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-gradient-to-b from-[#0600AB] to-[#54ACBF] rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      <div
                        className="px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
                        onClick={() => {
                          setSelectedHour('');
                          setShowHourDropdown(false);
                        }}
                      >
                        Jam
                      </div>
                      {hours.map((hour) => (
                        <div
                          key={hour}
                          className="px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
                          onClick={() => {
                            setSelectedHour(hour);
                            setShowHourDropdown(false);
                          }}
                        >
                          {hour}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative w-1/2">
                  <button
                    onClick={() => {
                      setShowMinuteDropdown(!showMinuteDropdown);
                      setShowDayDropdown(false);
                      setShowHourDropdown(false);
                    }}
                    className={`w-full text-left bg-gradient-to-b from-[#0600AB] to-[#54ACBF] text-white text-sm px-4 py-2 rounded-full focus:outline-none flex justify-between items-center ${
                      errors.minute ? 'border border-red-500' : ''
                    }`}
                  >
                    {selectedMinute || 'Menit'}
                    <svg
                      className={`w-4 h-4 ml-2 transition-transform ${
                        showMinuteDropdown ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showMinuteDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-gradient-to-b from-[#0600AB] to-[#54ACBF] rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      <div
                        className="px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
                        onClick={() => {
                          setSelectedMinute('');
                          setShowMinuteDropdown(false);
                        }}
                      >
                        Menit
                      </div>
                      {minutes.map((minute) => (
                        <div
                          key={minute}
                          className="px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
                          onClick={() => {
                            setSelectedMinute(minute);
                            setShowMinuteDropdown(false);
                          }}
                        >
                          {minute}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {(errors.hour || errors.minute) && (
                <p className="text-red-400 text-xs">{errors.hour || errors.minute}</p>
              )}

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi"
                rows="3"
                className="w-full bg-transparent border-b border-white placeholder-gray-400 text-white py-2 focus:outline-none resize-none"
              />
              {errors.description && <p className="text-red-400 text-xs">{errors.description}</p>}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handleCloseModal}
                className="bg-[#1A0A4C] text-white font-semibold px-6 py-2 rounded-full hover:opacity-90 transition duration-200"
              >
                Tutup
              </button>
              <button
                onClick={handleSaveAgenda}
                className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-full hover:opacity-90 transition duration-200"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Agenda */}
      {selectedAgendaDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gradient-to-b from-[#00033D] to-[#0600AB] p-6 rounded-2xl shadow-2xl w-96">
            <h2 className="text-xl font-bold text-white text-center mb-4">Detail Agenda</h2>
            <div className="text-white space-y-2">
              <div><span className="font-semibold">Hari: </span>{selectedAgendaDetail.day}</div>
              <div><span className="font-semibold">Waktu: </span>{selectedAgendaDetail.time}</div>
              <div><span className="font-semibold">Deskripsi: </span>{selectedAgendaDetail.description}</div>
            </div>

            <div className="flex justify-center mt-6 gap-3">
              <button
                onClick={handleCloseDetail}
                className="bg-gray-600 text-white font-semibold px-6 py-2 rounded-full hover:opacity-90 transition duration-200"
              >
                Tutup
              </button>
              <button
                onClick={handleEditFromDetail}
                className="bg-yellow-500 text-white font-semibold px-6 py-2 rounded-full hover:opacity-90 transition duration-200"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ActivityPage;