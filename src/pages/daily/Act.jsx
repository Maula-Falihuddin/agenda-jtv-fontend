import Footer from '../../components_daily/Footer';
import Header from '../../components_daily/Header_daily';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ActPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [agendas, setAgendas] = useState([]);
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const token = localStorage.getItem('token');

  // Load checkedAgendas dari localStorage
  const [checkedAgendas, setCheckedAgendas] = useState(() => {
    const saved = localStorage.getItem('checkedAgendas');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchAllAgendas = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/activity-all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Gagal fetch semua agenda');
      const data = await response.json();
      const allAgendas = data.map((item) => ({
        id: item.id,
        day: item.day,
        time: `${String(item.hour).padStart(2, '0')}:${String(item.minute).padStart(2, '0')}`,
        description: item.description,
        is_checked: item.is_checked || false,
      }));
      setAgendas(allAgendas);
    } catch (error) {
      console.error('Gagal mengambil agenda:', error);
    }
  };

  const handleCheckToggle = async (agendaId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/activity/${agendaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_checked: !currentStatus,
        }),
      });

      if (!response.ok) throw new Error('Gagal update status centang');

      // Update langsung UI
      setAgendas((prev) =>
        prev.map((agenda) =>
          agenda.id === agendaId ? { ...agenda, is_checked: !currentStatus } : agenda
        )
      );

      // Update localStorage
      setCheckedAgendas((prev) => {
        const newChecked = !currentStatus
          ? [...prev, agendaId]
          : prev.filter((id) => id !== agendaId);

        localStorage.setItem('checkedAgendas', JSON.stringify(newChecked));
        return newChecked;
      });
    } catch (error) {
      console.error('Gagal mengubah status centang:', error);
    }
  };

  const handleAgendaClick = (agenda) => {
    setSelectedAgenda(agenda);
  };

  const handleDelete = async () => {
    if (!selectedAgenda) return;
    if (!window.confirm('Yakin ingin menghapus agenda ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/api/activity/${selectedAgenda.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Gagal menghapus agenda');
      setSelectedAgenda(null);
      fetchAllAgendas(); // Refresh daftar agenda
    } catch (err) {
      console.error('Gagal menghapus agenda:', err);
      alert('Terjadi kesalahan saat menghapus agenda.');
    }
  };

  useEffect(() => {
    fetchAllAgendas();
  }, [location]);

  return (
    <div className="min-h-screen bg-cover bg-center text-gray-200 flex flex-col justify-between">
      <Header />
      <main className="flex-1 overflow-y-auto p-2 flex flex-col items-center pb-24">
        {/* Toggle Harian / Aktivitas */}
        <div className="flex bg-gradient-to-r from-[#54ACBF] to-[#5B4B99] rounded-full p-1 mb-8 w-full max-w-xs mt-[0.5cm]">
          <button
            className="flex-grow text-center py-2 rounded-full hover:bg-purple-800 transition-colors"
            onClick={() => navigate('/daily/home_daily')}
          >
            Harian
          </button>
          <button className="flex-grow text-center py-2 rounded-full bg-gradient-to-r from-[#0600AB] to-[#00033D] font-semibold shadow-md">
            Aktivitas
          </button>
        </div>

        {/* Konten Agenda */}
        <div className="flex flex-col items-center px-5 w-full pt-2">
          {agendas.length > 0 ? (
            <div className="w-full space-y-4">
              {agendas.map((agenda) => (
                  <div
                    key={agenda.id}
                    className="px-5 py-3 rounded-lg bg-gradient-to-r from-[#0600AB] to-[#54ACBF] shadow-md flex items-center justify-between transition transform hover:scale-105"
                    onClick={(e) => {
                      if (e.target.type !== 'checkbox') {
                        handleAgendaClick(agenda);
                      }
                    }}
                  >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">
                      {agenda.day}, {agenda.time}
                    </span>
                    <span
                      className={`text-md font-semibold ${
                        agenda.is_checked ? 'line-through text-gray-400' : ''
                      }`}
                    >
                      {agenda.description}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-orange-500 rounded border-gray-300 focus:ring-0"
                    checked={agenda.is_checked}
                    onChange={(e) => {
                      e.stopPropagation(); // ⬅ Penting! Ini mencegah card click terpicu
                      handleCheckToggle(agenda.id, agenda.is_checked);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="relative w-48 h-48 mb-6">
                <img
                  src="/src/assets/bookpen.png"
                  alt="Ilustrasi Buku dan Pulpen"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <p className="text-[#939393] text-sm md:text-base select-none font-light">
                Belum ada agenda
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />

      {/* Modal Detail Agenda */}
      {selectedAgenda && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gradient-to-b from-[#00033D] to-[#0600AB] p-6 rounded-2xl max-w-sm w-full text-white relative">
            <button
              onClick={() => setSelectedAgenda(null)}
              className="absolute top-2 right-4 text-white text-2xl"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-2">{selectedAgenda.description}</h2>
            <p className="text-sm">Hari: {selectedAgenda.day}</p>
            <p className="text-sm">Waktu: {selectedAgenda.time}</p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleDelete}
                className="bg-red-600 px-4 py-2 rounded-full text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActPage;