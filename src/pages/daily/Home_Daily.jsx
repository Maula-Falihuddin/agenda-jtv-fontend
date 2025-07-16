import { useEffect, useState } from 'react';
import Footer from '../../components_daily/Footer';
import Header from '../../components_daily/Header_daily';
import { useLocation, useNavigate } from 'react-router-dom';

const Home_Daily = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [agendas, setAgendas] = useState([]);
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    judul: '',
    tanggal: '',
    jam: '',
    deskripsi: '',
    prioritas: ''
  });

  // Gunakan is_checked langsung dari data agenda
  const toggleChecklist = async (agenda) => {
    const updatedAgenda = { ...agenda, is_checked: !agenda.is_checked };

    try {
      const res = await fetch(`http://localhost:8000/api/daily/check/${agenda.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ is_checked: updatedAgenda.is_checked })
      });

      if (res.ok) {
        setAgendas((prev) =>
          prev.map((item) => (item.id === agenda.id ? updatedAgenda : item))
        );
      } else {
        alert('Gagal update checklist');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAgendas = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/daily', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setAgendas(data);
    } catch (err) {
      console.error('Gagal mengambil data agenda:', err);
    }
  };

  useEffect(() => {
    const newAgenda = location.state?.newAgenda;
    if (newAgenda) {
      setAgendas((prev) => [newAgenda, ...prev]);
      window.history.replaceState({}, document.title);
    } else {
      fetchAgendas();
    }
  }, [location.state]);

  const handleAgendaClick = (agenda) => {
    setSelectedAgenda(agenda);
    setEditForm({
      judul: agenda.judul,
      tanggal: agenda.tanggal,
      jam: agenda.jam,
      deskripsi: agenda.deskripsi,
      prioritas: agenda.prioritas
    });
  };

  const handleDelete = async () => {
    if (!selectedAgenda) return;
    if (!confirm('Yakin ingin menghapus agenda ini?')) return;
    try {
      await fetch(`http://localhost:8000/api/daily/${selectedAgenda.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSelectedAgenda(null);
      fetchAgendas();
    } catch (err) {
      console.error('Gagal menghapus agenda:', err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedAgenda) return;
    try {
      await fetch(`http://localhost:8000/api/daily/${selectedAgenda.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      setTimeout(() => alert('Agenda berhasil diperbarui!'), 100);
      setSelectedAgenda(null);
      setIsEditing(false);
      fetchAgendas();
    } catch (err) {
      console.error('Gagal update agenda:', err);
    }
  };

  const formatTanggal = (tanggalStr) => {
    const [tahun, bulan, tanggal] = tanggalStr.split('-');
    return `${tanggal.padStart(2, '0')}-${bulan.padStart(2, '0')}-${tahun}`;
  };

  const isAgendaLate = (agenda) => {
    const now = new Date();
    const agendaDateTime = new Date(`${agenda.tanggal}T${agenda.jam}`);
    return now > agendaDateTime;
  };

  return (
    <div className="min-h-screen bg-cover bg-center text-gray-200 flex flex-col justify-between">
      <Header />
      <main className="flex-1 overflow-y-auto p-2 flex flex-col items-center pb-24">
        {/* Tombol Harian & Aktivitas */}
        <div className="flex bg-gradient-to-r from-[#54ACBF] to-[#5B4B99] rounded-full p-1 w-full max-w-xs mt-[0.5cm]">
          <button className="flex-grow text-center py-2 rounded-full bg-gradient-to-r from-[#0600AB] to-[#00033D] font-semibold shadow-md">
            Harian
          </button>
          <button
            className="flex-grow text-center py-2 rounded-full hover:bg-purple-800 transition-colors"
            onClick={() => navigate('/daily/act')}
          >
            Aktivitas
          </button>
        </div>

        {/* Daftar Agenda */}
        <div className="w-full max-w-md rounded-xl p-4 max-h-[80vh] overflow-y-auto mt-4 pb-24">
          {agendas.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-grow px-5">
              <div className="relative w-48 h-48 mb-6">
                <img
                  src="/src/assets/bookpen.png"
                  alt="3D Pen and Notepad Illustration"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <p className="text-[#939393] text-sm md:text-base select-none font-light">
                Belum ada agenda
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {agendas
                .sort((a, b) => a.tanggal.localeCompare(b.tanggal) || a.jam.localeCompare(b.jam))
                .map((agenda, index) => (
                  <li
                    key={index}
                    className={`p-3 px-5 py-3 rounded-lg border-l-4 cursor-pointer bg-gradient-to-r from-[#0600AB] to-[#54ACBF] transition ${
                      agenda.prioritas === 'tinggi'
                        ? 'border-red-500'
                        : agenda.prioritas === 'sedang'
                        ? 'border-yellow-400'
                        : 'border-green-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={agenda.is_checked}
                        onChange={() => toggleChecklist(agenda)}
                        className="mt-1"
                      />
                      <div onClick={() => handleAgendaClick(agenda)} className="w-full">
                        <div className="flex items-center justify-between">
                          <h3
                            className={`text-md font-semibold ${
                              agenda.is_checked ? 'line-through text-gray-400' : ''
                            }`}
                          >
                            {agenda.judul}
                          </h3>
                          {isAgendaLate(agenda) && (
                            <span className="text-xs text-red-400 font-bold ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                              Terlambat
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-300">
                          {formatTanggal(agenda.tanggal)} - {agenda.jam}
                        </p>
                        <p className="text-sm">{agenda.deskripsi}</p>
                        <p className="text-xs italic">Prioritas: {agenda.prioritas}</p>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />

      {/* Modal Detail/Edit Agenda */}
      {selectedAgenda && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gradient-to-b from-[#00033D] to-[#0600AB] p-6 rounded-2xl max-w-sm w-full text-white relative">
            <button
              onClick={() => {
                setSelectedAgenda(null);
                setIsEditing(false);
              }}
              className="absolute top-2 right-4 text-white text-2xl"
            >
              &times;
            </button>
            {isEditing ? (
              <>
                <input
                  className="w-full bg-transparent border-b border-white mb-3 py-1 text-white placeholder-gray-300"
                  value={editForm.judul}
                  onChange={(e) => setEditForm({ ...editForm, judul: e.target.value })}
                />
                <input
                  type="date"
                  className="w-full bg-transparent border-b border-white mb-3 py-1 text-white"
                  value={editForm.tanggal}
                  onChange={(e) => setEditForm({ ...editForm, tanggal: e.target.value })}
                />
                <input
                  type="time"
                  className="w-full bg-transparent border-b border-white mb-3 py-1 text-white"
                  value={editForm.jam}
                  onChange={(e) => setEditForm({ ...editForm, jam: e.target.value })}
                />

                <textarea
                  className="w-full bg-transparent border-b border-white mb-3 py-1 text-white"
                  value={editForm.deskripsi}
                  onChange={(e) => setEditForm({ ...editForm, deskripsi: e.target.value })}
                />
                <select
                  className="w-full bg-transparent border-b border-white mb-4 py-1 text-white"
                  value={editForm.prioritas}
                  onChange={(e) => setEditForm({ ...editForm, prioritas: e.target.value })}
                >
                  <option value="tinggi">Tinggi</option>
                  <option value="sedang">Sedang</option>
                  <option value="rendah">Rendah</option>
                </select>
                <div className="flex justify-between">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-red-500 px-4 py-2 rounded-full text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="bg-green-500 px-4 py-2 rounded-full text-sm"
                  >
                    Simpan
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-2">{selectedAgenda.judul}</h2>
                <p className="text-sm">
                  {formatTanggal(selectedAgenda.tanggal)} - {selectedAgenda.jam}
                </p>
                <p className="mt-4">{selectedAgenda.deskripsi}</p>
                <p className="mt-2 text-sm italic">Prioritas: {selectedAgenda.prioritas}</p>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-yellow-500 px-4 py-2 rounded-full text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 px-4 py-2 rounded-full text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home_Daily;