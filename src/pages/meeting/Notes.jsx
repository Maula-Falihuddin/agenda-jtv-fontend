import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Format tanggal sesuai format di gambar: dd/mm/yy
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date)) return '';
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear().toString().slice(2)}`;
  };

  // Ambil daftar catatan dari API
const fetchNotes = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:8000/api/notes', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch notes');

    const data = await response.json();

    // Validasi data harus array
    if (Array.isArray(data)) {
      setNotes(data);
    } else if (Array.isArray(data.data)) {
      // Kalau backend Laravel pakai resource collection
      setNotes(data.data);
    } else {
      console.error('Format data dari API tidak sesuai:', data);
      setNotes([]); // fallback
    }
  } catch (error) {
    console.error('Error fetching notes:', error);
    setNotes([]); // fallback saat error
  }
};


  const handleDelete = async (id) => {
  const konfirmasi = window.confirm('Yakin ingin menghapus catatan ini?');
  if (!konfirmasi) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8000/api/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Gagal menghapus catatan');

    // Hapus dari state setelah berhasil
    setNotes((prevNotes) => prevNotes.filter(note => note.id !== id));
  } catch (error) {
    console.error('Gagal menghapus catatan:', error);
    alert('Terjadi kesalahan saat menghapus catatan.');
  }
};

  useEffect(() => {
    fetchNotes();
  }, []);

  // Filter catatan berdasar pencarian
  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render masing-masing item catatan dengan style seperti gambar
  // dan buat clickable agar navigasi ke NotesCreate dengan id sebagai query param
const renderNoteItem = (note) => {
  const shortContent = note.content.length > 40 ? note.content.substring(0, 40) + '...' : note.content;

  return (
    <div
      key={note.id}
      className="bg-white/20 rounded-2xl p-4 mb-4 text-white cursor-pointer select-none font-sans flex justify-between items-start"
    >
      {/* Konten klik untuk edit */}
      <div
        onClick={() => navigate(`/meeting/notes/create?id=${note.id}`)}
        className="flex-1"
      >
        <p style={{ fontSize: '0.875rem', margin: 0 }}>{shortContent}</p>
        <p style={{ fontSize: '0.75rem', marginTop: '0.75rem', opacity: 0.6 }}>
          {formatDate(note.created_at)}
        </p>
      </div>

      {/* Tombol delete */}
      <button
        onClick={() => handleDelete(note.id)}
        className="ml-4 text-red-400 hover:text-red-600"
        title="Hapus catatan"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};


  return (
    <div className="rounded-2xl mb-10 flex flex-col " style={{ color: 'white' }}>
      <h1 className="text-xl font-semibold mb-2">Catatan</h1>

      <input
        type="text"
        placeholder="Cari"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 rounded-2xl bg-white/20 placeholder-gray-400 text-white focus:outline-none focus:ring-1 focus:ring-white-200"
      />

      <div>
        {filteredNotes.length === 0 ? (
          <p style={{ opacity: 0.6, fontStyle: 'italic' }}>Belum ada catatan</p>
        ) : (
          filteredNotes.map(renderNoteItem)
        )}
      </div>

      {/* Tombol navigasi tambah catatan */}
      <button
        aria-label="Tambah Catatan"
        className="fixed bottom-20 right-6 bg-orange-500 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg"
        onClick={() => navigate('/meeting/notes/create')}
      >
        {/* Icon plus */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default Notes;
