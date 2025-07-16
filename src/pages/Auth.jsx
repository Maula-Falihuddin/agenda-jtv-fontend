import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoJtv from '../assets/agenda.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { isLoggedIn, setUser } = useAuth();
  useEffect(() => {
    if (isLoggedIn) {
      // Redirect ke dashboard atau home kalau sudah login
      navigate('/');
    }
  }, [isLoggedIn, navigate]);


  const formVariants = {
    enter: (direction) => ({
      x: direction * 20,
      opacity: 0,
      position: 'absolute',
      width: '100%',
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'relative',
      width: '100%',
    },
    exit: (direction) => ({
      x: direction * -20,
      opacity: 0,
      position: 'absolute',
      width: '100%',
    }),
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login gagal');

      localStorage.setItem('token', data.token);
      setUser(data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (registerPassword !== registerConfirmPassword) {
      setError('Password dan konfirmasi harus sama!');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: registerUsername,
          username: registerUsername,
          password: registerPassword,
          password_confirmation: registerConfirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Registrasi gagal');

      alert('Registrasi berhasil! Silakan login.');
      setIsLogin(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1c0b3b]">
      <div className="bg-gradient-to-b from-cyan-400 to-blue-700 p-6 rounded-3xl w-[320px] shadow-xl text-white relative overflow-hidden">
        <div className="flex flex-col items-center mb-6">
          <img src={logoJtv} alt="JTV Logo" className="w-45 mb-2" />
        </div>

        <div className="flex mb-6 bg-white/30 rounded-full p-1">
          <button
            onClick={() => {
              setError('');
              setIsLogin(true);
            }}
            className={`flex-1 py-1 font-semibold rounded-full transition-colors duration-300 ${
              isLogin
                ? 'bg-gradient-to-r from-blue-700 to-purple-500 text-white'
                : 'text-white/80'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => {
              setError('');
              setIsLogin(false);
            }}
            className={`flex-1 py-1 font-semibold rounded-full transition-colors duration-300 ${
              !isLogin
                ? 'bg-gradient-to-r from-blue-700 to-purple-500 text-white'
                : 'text-white/80'
            }`}
          >
            Register
          </button>
        </div>

        <div className="relative h-[380px]">
          <AnimatePresence mode="wait" initial={false}>
            {isLogin ? (
              <motion.div
                key="login"
                custom={-1}
                initial="enter"
                animate="center"
                exit="exit"
                variants={formVariants}
                transition={{ duration: 0.2 }}
                className="space-y-4 absolute top-0 left-0"
              >
                <h2 className="text-center text-xl font-bold mb-4">Log In</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block mb-1">Username</label>
                    <input
                      type="text"
                      placeholder="Masukkan username/email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-purple-200 text-black placeholder-purple-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-purple-200 text-black placeholder-purple-500 focus:outline-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-md bg-gradient-to-r from-blue-800 to-indigo-900 text-white font-semibold"
                    disabled={loading}
                  >
                    {loading ? 'Masuk...' : 'Masuk'}
                  </button>
                </form>
                {error && <p className="text-center text-sm text-red-200 mt-2">{error}</p>}
                <p className="text-center text-sm mt-4 text-white/80">
                  Belum punya akun? klik Register di atas!
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                custom={1}
                initial="enter"
                animate="center"
                exit="exit"
                variants={formVariants}
                transition={{ duration: 0.3 }}
                className="space-y-4 absolute top-0 left-0"
              >
                <h2 className="text-center text-xl font-bold mb-3">Register</h2>
                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <label className="block mb-1">Username</label>
                    <input
                      type="text"
                      placeholder="Masukkan username/email"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-purple-200 text-black placeholder-purple-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="Masukkan password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-purple-200 text-black placeholder-purple-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Konfirmasi Password</label>
                    <input
                      type="password"
                      name="password_confirmation"
                      placeholder="Konfirmasi password"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-purple-200 text-black placeholder-purple-500 focus:outline-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-md bg-gradient-to-r from-blue-800 to-indigo-900 text-white font-semibold"
                  >
                    Daftar
                  </button>
                </form>
                {error && <p className="text-center text-sm text-red-200 mt-2">{error}</p>}
                <p className="text-center text-sm mt-4 text-white/80">
                  Sudah punya akun? klik Log In di atas!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
