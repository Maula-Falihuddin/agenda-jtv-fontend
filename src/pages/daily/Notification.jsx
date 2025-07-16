// src/pages/Notification.jsx
import { useNavigate } from "react-router-dom";
import bell from "../../assets/bell.png";


const Notification = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0C0153] flex flex-col items-center pt-16 text-white">
     <button
       onClick={() => navigate(-1)}
       className="self-start ml-4 mb-4 px-3 py-1 rounded bg-[#F66300] hover:bg-[#d15300] transition"
      >
      <img
         src="https://cdn-icons-png.flaticon.com/512/3585/3585896.png"
         alt="Kembali"
         className="w-5 h-5"
      />
      </button>


      <div className="flex items-center gap-2 mb-30">
        <h1 className="text-lg font-bold text-[#FFFFF]">Notifikasi</h1>
      </div>

      <img
        src={bell}
        alt="Bell Illustration"
        className="w-99 h-70 mb-6"
      />

      <p className="text-gray-400 text-sm">Belum ada notifikasi</p>
    </div>
  );
};

export default Notification;
