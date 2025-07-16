import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Index() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const token = localStorage.getItem('token');

  // State
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('');

  // Derived Value
  const selectedSchedule = schedules.find((s) => s.id === selectedScheduleId);

  // Effects
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/account');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/schedules', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Gagal mengambil data.');
        setSchedules(data.schedules);

        const checkedMap = {};
        data.schedules.forEach((sched) => {
          checkedMap[sched.id] = sched.is_checked || false;
        });
        setCheckedItems(checkedMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [token]);

  // Helper Functions
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'low':
        return { label: 'Rendah', color: '#16a34a' };
      case 'medium':
        return { label: 'Normal', color: '#facc15' };
      case 'high':
        return { label: 'Tinggi', color: '#ef4444' };
      default:
        return { label: priority, color: '#6b7280' };
    }
  };

  const FlagIcon = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={color} viewBox="0 0 24 24" stroke="none">
      <path d="M4 2a1 1 0 011 1v18a1 1 0 11-2 0V3a1 1 0 011-1z" />
      <path d="M5 4h14l-3 5 3 5H5V4z" />
    </svg>
  );

  const isLate = (schedule) => {
    const dateTime = new Date(`${schedule.meeting_date}T${schedule.meeting_time}`);
    return dateTime < new Date();
  };

  const getLateDays = (schedule) => {
    const meetingDate = new Date(`${schedule.meeting_date}T${schedule.meeting_time}`);
    const now = new Date();
    meetingDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = now - meetingDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Event Handlers
  const handleCheckboxChange = async (id) => {
    const currentStatus = checkedItems[id] || false;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/schedules/check/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({ is_checked: !currentStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal update status checklist');

      setCheckedItems((prev) => ({ ...prev, [id]: !currentStatus }));
      setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, is_checked: !currentStatus } : s)));
    } catch (err) {
      alert(`Gagal memperbarui status checklist: ${err.message}`);
    }
  };

  useEffect(() => {
    if (selectedScheduleId !== null && selectedSchedule) {
      setEditTitle(selectedSchedule.title);
      setEditDescription(selectedSchedule.description || '');
      setEditPriority(selectedSchedule.priority || 'low');
    }
  }, [selectedScheduleId, selectedSchedule]);

  const handleSave = async () => {
    if (editTitle.trim() === '') {
      alert('Judul tidak boleh kosong.');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/schedules/${selectedScheduleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          title: editTitle,
          priority: editPriority,
          meeting_date: selectedSchedule.meeting_date,
          meeting_time: selectedSchedule.meeting_time,
          description: editDescription,
          minutes: selectedSchedule.minutes || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal menyimpan perubahan.');

      setSchedules((prev) => prev.map((s) => (s.id === selectedScheduleId ? data.schedule : s)));
      setSelectedScheduleId(null);
      setIsEditing(false);
      alert('Agenda berhasil diperbarui!');
    } catch (err) {
      alert(`Terjadi kesalahan: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Apakah kamu yakin ingin menghapus agenda ini?')) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/schedules/${selectedScheduleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal menghapus agenda.');

      setSchedules((prev) => prev.filter((s) => s.id !== selectedScheduleId));
      setSelectedScheduleId(null);
      alert('Agenda berhasil dihapus!');
    } catch (err) {
      alert(`Terjadi kesalahan saat menghapus: ${err.message}`);
    }
  };

  // Render UI
  return (
    <div className="rounded-2xl mb-10 flex flex-col">
      <div>
        {!selectedSchedule ? (
          schedules.length === 0 ? (
            <p className="text-center text-white/70">Belum ada agenda rapat yang dibuat.</p>
          ) : (
            [...schedules]
              .sort(
                (a, b) =>
                  new Date(`${a.meeting_date}T${a.meeting_time}`) -
                  new Date(`${b.meeting_date}T${b.meeting_time}`)
              )
              .map((schedule) => {
                const isChecked = checkedItems[schedule.id] || false;
                const { color: priorityColor } = getPriorityInfo(schedule.priority);

                return (
                  <div
                    key={schedule.id}
                    className="mb-4 p-4 rounded-lg bg-white/20 backdrop-blur-sm transition-transform cursor-pointer hover:scale-[1.02] flex items-start space-x-3"
                    onClick={() => setSelectedScheduleId(schedule.id)}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckboxChange(schedule.id);
                      }}
                      className="mt-1 cursor-pointer w-5 h-5 rounded border-white/50 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3
                          className={`text-lg font-semibold ${
                            isChecked ? 'line-through text-white/50' : 'text-white'
                          } truncate max-w-[200px]`}
                        >
                          {schedule.title}
                        </h3>
                        <FlagIcon color={priorityColor} />
                      </div>
                      <div
                        className={`flex items-center text-sm ${
                          isChecked ? 'line-through text-white/50' : 'text-white/70'
                        } mb-2 space-x-2`}
                      >
                        <span>
                          {new Date(schedule.meeting_date).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                        <span>·</span>
                        <span>{schedule.meeting_time.slice(0, 5)}</span>
                        {isLate(schedule) && (
                          <>
                            <span>·</span>
                            <span className="text-red-500 font-semibold">
                              Terlambat {getLateDays(schedule)} hari
                            </span>
                          </>
                        )}
                      </div>
                      {schedule.description && (
                        <p
                          className={`mt-2 text-sm italic ${
                            isChecked ? 'line-through text-white/50' : 'text-white/80'
                          }`}
                        >
                          {schedule.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
          )
        ) : (
          <div className="relative p-4 rounded-lg bg-white/10 backdrop-blur-md shadow-lg flex flex-col space-y-4">
            <div className="flex justify-between items-center text-sm text-white/70 space-x-4">
              <div>
                {new Date(selectedSchedule.meeting_date).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
              <div>{selectedSchedule.meeting_time.slice(0, 5)}</div>
              {isLate(selectedSchedule) && (
                <div className="text-red-500 font-semibold">
                  Terlambat {getLateDays(selectedSchedule)} hari
                </div>
              )}
              <FlagIcon color={getPriorityInfo(editPriority).color} />
            </div>

            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-2xl font-bold p-2 rounded-md text-white"
                autoFocus
              />
            ) : (
              <h2 className="text-2xl font-bold break-words text-white">{selectedSchedule.title}</h2>
            )}

            <div>
              <label className="text-sm text-white/70 font-semibold">Prioritas</label>
              {isEditing ? (
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="w-full mt-1 p-2 rounded-md text-white"
                >
                  <option value="low" className="bg-gray-800 text-white">
                    Rendah
                  </option>
                  <option value="medium" className="bg-gray-800 text-white">
                    Normal
                  </option>
                  <option value="high" className="bg-gray-800 text-white">
                    Tinggi
                  </option>
                </select>
              ) : (
                <div className="mt-1 text-white/80 flex items-center space-x-2">
                  <FlagIcon color={getPriorityInfo(editPriority).color} />
                  <span>{getPriorityInfo(editPriority).label}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-white/70 font-semibold">Deskripsi</label>
              {isEditing ? (
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full mt-1 p-2 rounded-md text-white resize-y"
                  rows={4}
                />
              ) : (
                <p className="mt-1 text-white/80 italic">{selectedSchedule.description || '-'}</p>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={checkedItems[selectedSchedule.id] || false}
                onChange={() => handleCheckboxChange(selectedSchedule.id)}
                className="w-6 h-6 rounded border-white/50 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex flex-wrap gap-3 self-end">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                    Simpan
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditTitle(selectedSchedule.title);
                      setEditDescription(selectedSchedule.description || '');
                      setEditPriority(selectedSchedule.priority || 'low');
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md">
                    Batal
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  >
                    Hapus
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedScheduleId(null)}
                className="bg-white/20 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Selesai
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}