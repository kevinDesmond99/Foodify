import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8000'; // cambia se usi un dominio diverso

export const login = async (username: string, password: string) => {
  const body = new URLSearchParams();
  body.append('username', username);
  body.append('password', password);

  const response = await axios.post(`${API_URL}/auth/token`, body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const token = response.data.access_token;
  localStorage.setItem('token', token);
  return jwtDecode(token);
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  const decoded: any = jwtDecode(token);
  const now = Date.now() / 1000;
  return decoded.exp > now;
};
