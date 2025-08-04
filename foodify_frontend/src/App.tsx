import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { JSX } from "react/jsx-runtime";

export default function App() {
  const [isLogged, setIsLogged] = useState(false);

  function PrivateRoute({ children }: { children: JSX.Element }) {
    return isLogged ? (
      children
    ) : (
      <Navigate to="/login" replace />
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLogged ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={() => setIsLogged(true)} />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard onLogout={() => setIsLogged(false)} />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}