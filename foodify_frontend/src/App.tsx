import React from 'react';
import Login from './components/Login';
import { isAuthenticated, logout } from './utils/authService';
import registerPage from './pages/registerPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/registerPage';


export function App() {
  return (
      <div className="min-h-screen bg-gray-100 p-8">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-4">Benvenuto!</h1>
                  <button
                    onClick={() => {
                      logout();
                      window.location.reload();
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Login />
              )
            }
          />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
  );
}

