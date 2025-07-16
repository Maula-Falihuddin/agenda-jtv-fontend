import { useEffect, useState } from "react";
import Footer from '../../components_daily/Footer';
import Header from '../../components_daily/Header_daily';

const SettingPage = () => {
  // State untuk toggle notifikasi
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  // State untuk pilihan suara (hanya 1 yang aktif)
  const [sounds, setSounds] = useState([
    { id: 1, label: "Beep", checked: false },
    { id: 2, label: "Beep", checked: false },
    { id: 3, label: "Beep", checked: false },
    { id: 4, label: "Beep", checked: false },
  ]);

  // Handler toggle notifikasi
  const handleNotificationToggle = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);

    // Request permission untuk notifikasi browser
    if (newState && typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("Notifikasi diaktifkan! 🎉");
        }
      });
    }
  };

  // Handler checklist suara (hanya 1 yang bisa dipilih)
  const handleSoundToggle = (id) => {
    setSounds(prevSounds => 
      prevSounds.map(sound => ({
        ...sound,
        checked: sound.id === id ? !sound.checked : false // Uncheck lainnya
      }))
    );

    // Play sound jika dicentang (bukan di-uncheck)
    const selectedSound = sounds.find(s => s.id === id);
    if (!selectedSound?.checked) {
      const audio = new Audio("/beep.mp3");
      audio.play().catch(e => console.error("Gagal memutar suara:", e));
    }
  };

  // Load saved settings dari localStorage saat komponen mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      const { notifications, sounds } = JSON.parse(savedSettings);
      setNotificationsEnabled(notifications);
      setSounds(sounds);
    }
  }, []);

  // Simpan settings ke localStorage saat ada perubahan
  useEffect(() => {
    localStorage.setItem(
      "appSettings",
      JSON.stringify({ notifications: notificationsEnabled, sounds })
    );
  }, [notificationsEnabled, sounds]);

  return (
    <div className="min-h-screen bg-cover bg-center text-gray-200 flex flex-col justify-between"
      style={{ backgroundImage: "url('/src/assets/wallpaper.png')" }}>
      
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-grow flex justify-center p-4">
        <div className="max-w-md w-full p-6 bg-opacity-90 rounded-lg shadow-sm text-white">
          {/* Header */}
         

          {/* Section Notifikasi */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-2">Notifikasi</h2>
            <p className="text-white mb-4">
              Mengaktifkan notifikasi akan memungkinkan Anda mendapat notifikasi dari aplikasi ini.
            </p>
            
            {/* Toggle Switch */}
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={notificationsEnabled}
                  onChange={handleNotificationToggle}
                />
                <div className={`block w-12 h-6 rounded-full transition-colors ${
                  notificationsEnabled ? "bg-gradient-to-r from-[#54ACBF] to-[#5B4B99]" : "bg-gray-300"
                }`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  notificationsEnabled ? "transform translate-x-6" : ""
                }`}></div>
              </div>
              <span className="ml-3 text-white">
                {notificationsEnabled ? "Aktif" : "Nonaktif"}
              </span>
            </label>
          </div>

          {/* Section Suara */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Suara</h2>
            <p className="text-sm text-white mb-3">Pilih satu suara notifikasi:</p>
            <div className="space-y-3">
              {sounds.map((sound) => (
                <label key={sound.id} className="flex items-center space-x-3">
                  <input
                    type="radio" // Ganti dari checkbox ke radio button
                    name="sound-selection" // Nama sama untuk grouping
                    checked={sound.checked}
                    onChange={() => handleSoundToggle(sound.id)}
                    className="form-radio h-5 w-5 text-blue-500 border-gray-300 focus:ring-blue-400"
                  />
                  <span className="text-white">{sound.label} {sound.id}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SettingPage;