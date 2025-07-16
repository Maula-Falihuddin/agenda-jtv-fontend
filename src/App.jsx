import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Umum
import Home from './pages/home';
import About from './pages/About';
import Auth from './pages/Auth';

// Meeting
import MeetingLayout from './layouts/MeetingLayout';
import Index from './pages/meeting/Index';
import AgendaRapat from './pages/meeting/Create';
import Update from './pages/meeting/Update';
import Notes from './pages/meeting/notes';
import NoteCreate from './pages/meeting/NoteCreate';

// Daily
import DailyLayout from './layouts/DailyLayout';
import Daily from './pages/daily/Daily';
import Home_Daily from './pages/daily/Home_Daily';
import Activity from './pages/daily/Activity';
import Notification from './pages/daily/Notification';
import ActPage from './pages/daily/Act';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('Token tidak ditemukan. Belum login.');
      return;
    }

    fetch('http://127.0.0.1:8000/api/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Gagal mendapatkan data user.');
      }
      return response.json();
    })
    .then(data => {
      setUser(data.data);
      console.log('User berhasil diambil:', data.data);
    })
    .catch(error => {
      console.error('Error saat ambil user:', error);
    });
  }, []);

  return (
    <AuthProvider>
      
      <BrowserRouter>
        <Routes>
          {/* Umum */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/account" element={<Auth />} />

          {/* Daily */}
          <Route path="/daily" element={<DailyLayout />}>
            <Route index element={<Daily />} />
            <Route path="home_daily" element={<Home_Daily />} />
            <Route path="activity" element={<Activity />} />
            <Route path="notification" element={<Notification />} />
            <Route path="act" element={<ActPage />} />
            <Route path="daily" element={<Daily />} />
          </Route>

          {/* Meeting */}
          <Route path="/meeting" element={<MeetingLayout />}>
            <Route index element={<Index />} />
            <Route path="create" element={<AgendaRapat />} />
            <Route path="update" element={<Update />} />
            <Route path="notes" element={<Notes />} />
            <Route path="notes/create" element={<NoteCreate />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
