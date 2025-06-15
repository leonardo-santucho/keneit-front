// src/pages/Login.jsx
import { useState } from 'react';
import { login as loginService } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // ← importa el login del contexto

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await loginService({ email, password });
      const token = localStorage.getItem('token');
      login(user, token); // ← actualiza el contexto global
      navigate('/matrix');
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Ingresar a KINEIT</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border p-2 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
