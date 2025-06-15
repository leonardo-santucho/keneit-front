// src/services/auth.js
const API_URL = import.meta.env.VITE_API_URL;

export async function login({ email, password }) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    if (!res.ok) {
      throw new Error('Login fallido');
    }
  
    const data = await res.json();
  
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('therapist_id', data.user.therapist_id || null);
  
    return data.user;
  }
  