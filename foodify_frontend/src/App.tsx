// App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import RegisterPage from "./pages/registerPage";
import Dashboard from "./components/Dashboard"; // se ce l’hai

export function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard onLogout={function (): void {
          throw new Error("Function not implemented.");
        } } />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}
