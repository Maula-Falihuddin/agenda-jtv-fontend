import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NoteEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil id dari query URL
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const [noteContent, setNoteContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch data catatan berdasarkan id jika ada
  useEffect(() => {
    if (id) {
      const token = localStorage.getItem('token');
      fetch(`http://localhost:8000/api/notes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch note");
          return res.json();
        })
        .then(data => {
          setNoteContent(data.content || '');
        })
        .catch(err => {
          console.error(err);
          alert("Gagal mengambil data catatan");
        });
    }
  }, [id]);


  // Fungsi untuk simpan atau update catatan ke API
  const saveNoteToApi = async () => {
    if (!noteContent.trim()) {
      alert('Catatan tidak boleh kosong!');
      return false;
    }

    setIsSaving(true);

    const method = id ? 'PUT' : 'POST';  // jika id ada, update, kalau tidak, buat baru
    const url = id ? `http://localhost:8000/api/notes/${id}` : 'http://localhost:8000/api/notes';

    try {
      const response = await fetch(url, {
  method: method,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`, // tambahkan ini
  },
  body: JSON.stringify({ content: noteContent }),
});

      if (!response.ok) {
        const errorData = await response.json();
        alert('Gagal menyimpan catatan: ' + (errorData.message || response.statusText));
        setIsSaving(false);
        return false;
      }

      const savedNote = await response.json();
      console.log('Catatan disimpan:', savedNote);
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error('Error saat menyimpan catatan:', error);
      alert('Terjadi kesalahan saat menyimpan catatan');
      setIsSaving(false);
      return false;
    }
  };

  // Handle tombol simpan
  const handleSave = async () => {
    const success = await saveNoteToApi();
    if (success) {
      navigate(-1);
    }
  };

  // Handle tombol kembali
  const handleBack = () => {
    navigate(-1);
  };

  return (
  <div className="flex flex-col h-screen text-white pt-10"> {/* padding top untuk memberi ruang tombol */}
   <div className="h-14 absolute bottom-0 left-0 w-full"></div>
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center bg-black bg-opacity-80 px-4 py-5">
      <button onClick={handleBack} className="text-orange-500 font-semibold text-lg">
        &lt; Catatan
      </button>
      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`text-orange-500 font-semibold text-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSaving ? 'Menyimpan...' : 'selesai'}
      </button>
    </div>

    <textarea
      autoFocus
      value={noteContent}
      onChange={(e) => setNoteContent(e.target.value)}
      placeholder="Tuliskan catatanmu di sini..."
      className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none resize-none mt-4"
      style={{ fontSize: '1rem', lineHeight: '1.5rem' }}
      disabled={isSaving}
    />
  </div>
);
};

export default NoteEditor;
